import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import axios from "@/api/axios";
import styles from "../../../styles/CreateTemplate.module.css";

export default function EditTemplatePage() {
  const router = useRouter();
  const { id } = router.query;

  /* ===============================
     STATE
  =============================== */
  const [form, setForm] = useState<any>({
    name: "",
    templateType: "ANNUAL",
    description: "",
    ratingScale: {
      type: "FIVE_POINT",
      min: 1,
      max: 5,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ===============================
     LOAD TEMPLATE
  =============================== */
  useEffect(() => {
    if (id) loadTemplate();
  }, [id]);

  async function loadTemplate() {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const res = await api.get(`/performance/templates/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});


      setForm({
        ...res.data,
        ratingScale: res.data.ratingScale || {
          type: "FIVE_POINT",
          min: 1,
          max: 5,
        },
      });
    } catch (err) {
      console.error("LOAD TEMPLATE ERROR", err);
      setError("Failed to load template");
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     FORM HANDLERS
  =============================== */
  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRatingScaleChange(e: any) {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      ratingScale: {
        ...prev.ratingScale,
        [name]: name === "type" ? value : Number(value),
      },
    }));
  }

  /* ===============================
     SAVE TEMPLATE
  =============================== */
  async function save() {
    if (!form.name?.trim()) {
      setError("Name is required");
      return;
    }

    if (
      !form.ratingScale ||
      form.ratingScale.min >= form.ratingScale.max
    ) {
      setError("Rating scale min must be less than max");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem("token");

      const payload = {
        ...form,
        templateType: form.templateType,
      };

      const res = await api.patch(
  `/performance/templates/${id}`,
  payload,
  { headers: { Authorization: `Bearer ${token}` } }
);


      setForm({
        ...res.data,
        ratingScale: res.data.ratingScale || form.ratingScale,
      });

      setSuccessMessage("Template updated successfully!");
setTimeout(() => {
  router.push("/performance/templates?refresh=true");
}, 800);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("SAVE TEMPLATE ERROR", err);
      setError(err?.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  /* ===============================
     RENDER
  =============================== */
  if (loading) {
    return (
      <div className={styles.page}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Edit Performance Template</h1>

        {/* NAME */}
        <div className={styles.field}>
          <label>Name</label>
          <input
            className={styles.input}
            name="name"
            value={form.name || ""}
            onChange={handleChange}
          />
        </div>

        {/* TEMPLATE TYPE */}
        <div className={styles.field}>
          <label>Template Type</label>
          <select
            className={styles.select}
            name="templateType"
            value={form.templateType || "ANNUAL"}
            onChange={handleChange}
          >
            <option value="ANNUAL">Annual</option>
            <option value="SEMI_ANNUAL">Semi Annual</option>
            <option value="PROBATIONARY">Probationary</option>
            <option value="PROJECT">Project</option>
            <option value="AD_HOC">Ad Hoc</option>
          </select>
        </div>

        {/* RATING SCALE */}
        <div className={styles.field}>
          <label>Rating Scale</label>

          <select
            className={styles.select}
            name="type"
            value={form.ratingScale?.type || "FIVE_POINT"}
            onChange={handleRatingScaleChange}
          >
            <option value="THREE_POINT">3 Point</option>
            <option value="FIVE_POINT">5 Point</option>
            <option value="TEN_POINT">10 Point</option>
          </select>

          <div className={styles.scaleRow}>
            <input
              className={styles.input}
              type="number"
              name="min"
              value={form.ratingScale?.min ?? ""}
              onChange={handleRatingScaleChange}
            />
            <input
              className={styles.input}
              type="number"
              name="max"
              value={form.ratingScale?.max ?? ""}
              onChange={handleRatingScaleChange}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className={styles.field}>
          <label>Description</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description || ""}
            onChange={handleChange}
          />
        </div>

        {/* MESSAGES */}
        {error && <div className={styles.error}>{error}</div>}

        {successMessage && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "rgba(34, 197, 94, 0.2)",
              border: "1px solid rgb(34, 197, 94)",
              borderRadius: "4px",
              color: "rgb(74, 222, 128)",
              marginBottom: "10px",
            }}
          >
            {successMessage}
          </div>
        )}

        {/* ACTIONS */}
        <button
          className={styles.button}
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/performance/templates")}
          className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  );
}