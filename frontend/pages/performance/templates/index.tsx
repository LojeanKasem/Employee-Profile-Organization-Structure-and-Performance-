import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../api/axios";
import styles from "../../../styles/CreateTemplate.module.css";
import { useRouter } from "next/router";
import { getCurrentRole } from "../../../utils/routeGuard";

export default function PerformanceTemplatesPage() {
  const router = useRouter();

  /* ===============================
     ROLE (CLIENT ONLY)
  =============================== */
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  useEffect(() => {
    setCurrentRole(getCurrentRole());
  }, []);

  const isHR = currentRole === "HR";
  const isManager = currentRole === "MANAGER";

  useEffect(() => {
    if (currentRole && !isHR && !isManager) {
      router.push("/dashboard");
    }
  }, [currentRole, isHR, isManager, router]);

  /* ===============================
     STATE
  =============================== */
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);

  /* ===============================
     LOAD TEMPLATES
  =============================== */
  useEffect(() => {
    if (currentRole) {
      loadTemplates();
    }
  }, [currentRole, router.query.refresh]);

  async function loadTemplates() {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await api.get("/performance/templates", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.items ?? res.data?.data ?? [];

      const filtered =
        isManager && !isHR
          ? list.filter((t: any) => t.isActive !== false)
          : list;

      setTemplates(filtered);
    } catch {
      setError("Failed to load templates");
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     DELETE TEMPLATE
  =============================== */
  async function deleteTemplate(id: string) {
    if (!confirm("Delete this template?")) return;

    try {
      setOperationLoading(`delete-${id}`);
      const token = localStorage.getItem("token");

      await api.delete(`/performance/templates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      loadTemplates();
    } catch {
      setError("Failed to delete template");
    } finally {
      setOperationLoading(null);
    }
  }

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ maxWidth: 900 }}>
        {/* BACK */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
        >
          Back
        </button>

        <h1 className={styles.title}>Performance Templates</h1>

        {/* CREATE TEMPLATE (HR ONLY) */}
        {isHR && (
          <Link
            href="/performance/templates/create"
            className={styles.button}
            style={{ marginBottom: 20, display: "inline-block" }}
          >
            + Create Template
          </Link>
        )}

        {/* MANAGER INFO */}
        {isManager && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 16px",
              backgroundColor: "rgba(255,193,7,0.1)",
              border: "1px solid rgba(255,193,7,0.3)",
              borderRadius: 8,
              color: "#ffc107",
            }}
          >
            ℹ️ Read-only view. Templates are managed by HR.
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p>Loading templates...</p>
          </div>
        )}

        {/* ERROR */}
        {error && <div className={styles.error}>{error}</div>}

        {/* EMPTY */}
        {!loading && templates.length === 0 && isHR && (
          <Link
            href="/performance/templates/create"
            className={styles.button}
            style={{ marginTop: 20 }}
          >
            + Create Template
          </Link>
        )}

        {/* TABLE */}
        {!loading && templates.length > 0 && (
          <table width="100%" cellPadding={10}>
            <thead>
              <tr>
                <th align="left">Name</th>
                <th align="left">Type</th>
                <th align="left">Scale</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t._id}>
                  <td>{t.name}</td>
                  <td>{t.templateType}</td>
                  <td>{t.ratingScale?.type}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/performance/templates/${t._id}`}
                        className={styles.viewBtn}
                      >
                        View
                      </Link>

                      {isHR && (
                        <button
                          className={styles.deleteBtn}
                          onClick={() => deleteTemplate(t._id)}
                          disabled={operationLoading === `delete-${t._id}`}
                        >
                          {operationLoading === `delete-${t._id}`
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}