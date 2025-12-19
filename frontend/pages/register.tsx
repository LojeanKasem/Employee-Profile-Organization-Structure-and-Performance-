import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../api/axios";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    candidateNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    nationalId: "",
    resumeUrl: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);

      // Convert photo to base64 if provided
      let profilePictureUrl: string | undefined;
      if (photo) {
        if (photo.size > 5 * 1024 * 1024) {
          setMsg("Photo size must be less than 5MB");
          setLoading(false);
          return;
        }
        
        profilePictureUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(photo);
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
      }

      const payload: any = {
        candidateNumber: form.candidateNumber,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        nationalId: form.nationalId,
      };

      if (form.resumeUrl) {
        payload.resumeUrl = form.resumeUrl;
      }

      if (profilePictureUrl) {
        payload.profilePictureUrl = profilePictureUrl;
      }

      await api.post("/auth/register", payload);

      alert("Candidate registered successfully ✅");
      router.push("/login");
    } catch (err: any) {
      setMsg(
        err.response?.data?.message || 
        err.response?.data?.errors?.join?.(", ") ||
        "Registration failed ❌"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <div className="w-full max-w-md glass-card p-8">

        <h1 className="text-3xl font-semibold text-center mb-2">
          Candidate Registration
        </h1>

        <p className="text-center text-white/70 mb-6">
          Apply for a position
        </p>

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            className="input"
            placeholder="CAND2025-001"
            value={form.candidateNumber}
            onChange={(e) =>
              update("candidateNumber", e.target.value)
            }
            required
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              update("password", e.target.value)
            }
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) =>
                update("firstName", e.target.value)
              }
              required
            />
            <input
              className="input"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) =>
                update("lastName", e.target.value)
              }
              required
            />
          </div>

          <input
            className="input"
            placeholder="National ID"
            value={form.nationalId}
            onChange={(e) =>
              update("nationalId", e.target.value)
            }
            required
          />

          <input
            className="input"
            placeholder="Resume URL (optional)"
            value={form.resumeUrl}
            onChange={(e) =>
              update("resumeUrl", e.target.value)
            }
          />

          {/* ✅ PHOTO UPLOAD */}
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Photo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPhoto(e.target.files?.[0] || null)
              }
              className="input"
            />
            {photo && (
              <p className="text-xs text-white/50 mt-1">
                Selected: {photo.name} ({(photo.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glow-btn w-full"
          >
            {loading ? "Registering..." : "Apply Now"}
          </button>
        </form>

        {msg && (
          <p className="text-center mt-4 text-red-400">
            {msg}
          </p>
        )}

        <p className="text-center text-sm text-white/60 mt-6">
          Already applied?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-cyan-300 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
