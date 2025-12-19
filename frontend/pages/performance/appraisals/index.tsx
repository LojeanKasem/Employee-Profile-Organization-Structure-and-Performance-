import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/api/axios";

export default function ManagerAppraisalsPage() {
  const [appraisals, setAppraisals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCycle, setActiveCycle] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/login");
          return;
        }

        // Get all cycles to find active one
        const cyclesRes = await api.get("/performance/cycles", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cyclesList = Array.isArray(cyclesRes.data)
          ? cyclesRes.data
          : cyclesRes.data?.items || cyclesRes.data?.data || [];

        // Filter to only ACTIVE cycles
        const active = cyclesList.find((c: any) => c.status === "ACTIVE");
        
        if (!active) {
          setError("No active performance cycle found. Please wait for HR to activate a cycle.");
          setLoading(false);
          return;
        }

        setActiveCycle(active);

        // Get appraisals for the active cycle
        const res = await api.get(
          `/performance/cycles/${active._id}/appraisals`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const appraisalsList = Array.isArray(res.data)
          ? res.data
          : res.data?.items || res.data?.data || [];

        setAppraisals(appraisalsList || []);
      } catch (err: any) {
        console.error("Failed to load appraisals:", err);
        setError(err.response?.data?.message || "Failed to load team appraisals");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      DRAFT: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      MANAGER_SUBMITTED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      HR_PUBLISHED: "bg-green-500/20 text-green-300 border-green-500/30",
      PUBLISHED: "bg-green-500/20 text-green-300 border-green-500/30",
    };

    const colorClass = statusColors[status] || "bg-white/10 text-white/70 border-white/20";
    
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
      >
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  const getEmployeeName = (employee: any) => {
    if (typeof employee === "object" && employee !== null) {
      return `${employee.firstName || ""} ${employee.lastName || ""}`.trim() || employee.employeeNumber || "Unknown";
    }
    return employee || "Unknown";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading team appraisals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                My Team Appraisals
              </h1>
              <p className="text-white/60">
                {activeCycle
                  ? `Viewing appraisals for: ${activeCycle.name}`
                  : "Manage and track employee performance evaluations"}
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="glass-btn px-5 py-2 flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
          </div>

          {activeCycle && (
            <div className="glass-card p-4 mb-6 bg-cyan-500/10 border-cyan-400/30">
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-white/60">Cycle:</span>{" "}
                  <span className="font-medium text-cyan-300">{activeCycle.name}</span>
                </div>
                {activeCycle.startDate && (
                  <div>
                    <span className="text-white/60">Start:</span>{" "}
                    <span className="text-white/90">
                      {new Date(activeCycle.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {activeCycle.endDate && (
                  <div>
                    <span className="text-white/60">End:</span>{" "}
                    <span className="text-white/90">
                      {new Date(activeCycle.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card p-6 mb-6 bg-red-500/10 border-red-400/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium text-red-300 mb-1">Error</p>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Appraisals Table */}
        <div className="glass-card p-6">
          {appraisals.length === 0 && !error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                No Appraisals Yet
              </h2>
              <p className="text-white/60 mb-6">
                {activeCycle
                  ? "You haven't created any appraisals for this cycle. Start by creating an appraisal for a team member."
                  : "No active performance cycle. Please wait for HR to activate a cycle."}
              </p>
              {activeCycle && (
                <button
                  onClick={() => router.push("/performance/appraisals/create")}
                  className="glow-btn px-6 py-3 text-sm"
                >
                  Create New Appraisal
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Team Appraisals ({appraisals.length})
                </h2>
                {activeCycle && (
                  <button
                    onClick={() => router.push("/performance/appraisals/create")}
                    className="glow-btn px-5 py-2 text-sm flex items-center gap-2"
                  >
                    <span>+</span>
                    <span>Create New Appraisal</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/20 text-white/80">
                      <th className="p-4 text-left font-semibold">Employee</th>
                      <th className="p-4 text-left font-semibold">Employee #</th>
                      <th className="p-4 text-center font-semibold">Status</th>
                      <th className="p-4 text-center font-semibold">Total Score</th>
                      <th className="p-4 text-center font-semibold">Rating</th>
                      <th className="p-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appraisals.map((a) => (
                      <tr
                        key={a._id}
                        className="border-t border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 font-medium">
                          {getEmployeeName(a.employeeProfileId)}
                        </td>
                        <td className="p-4 text-white/70 text-xs">
                          {typeof a.employeeProfileId === "object" && a.employeeProfileId?.employeeNumber
                            ? a.employeeProfileId.employeeNumber
                            : "—"}
                        </td>
                        <td className="p-4 text-center">
                          {getStatusBadge(a.status)}
                        </td>
                        <td className="p-4 text-center text-white/90">
                          {a.totalScore !== undefined && a.totalScore !== null
                            ? a.totalScore.toFixed(1)
                            : "—"}
                        </td>
                        <td className="p-4 text-center">
                          {a.overallRatingLabel ? (
                            <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {a.overallRatingLabel}
                            </span>
                          ) : (
                            <span className="text-white/50">—</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() =>
                              router.push(`/performance/appraisals/${a._id}`)
                            }
                            className="cyan-glow-btn px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                          >
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
