import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../../api/axios";

export default function CreateEmployeePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [loadingManagers, setLoadingManagers] = useState(false);

  const [form, setForm] = useState<any>({
    firstName: "",
    lastName: "",
    nationalId: "",
    employeeNumber: "",
    password: "",
    phone: "",
    personalEmail: "",
    dateOfHire: "",
    role: "",
    contractType: undefined,
    workType: undefined,
    status: "ACTIVE",
    primaryDepartmentId: "",
    primaryPositionId: "",
    address: {
      street: "",
      city: "",
      country: "",
    },
  });

  // ===============================
  // LOAD DEPARTMENTS & POSITIONS
  // ===============================
  useEffect(() => {
    async function loadBaseData() {
      const token = localStorage.getItem("token");

      try {
        const [d, p] = await Promise.all([
          api.get("/organization-structure/departments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/organization-structure/positions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDepartments(d.data?.items || d.data || []);
        setPositions(p.data?.items || p.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load departments or positions");
      }
    }

    loadBaseData();
  }, []);

  // ===============================
  // LOAD MANAGERS BY DEPARTMENT
  // ===============================
  async function loadManagersByDepartment(departmentId: string) {
    const token = localStorage.getItem("token");
    if (!departmentId) {
      setManagers([]);
      setSelectedManagerId("");
      return;
    }

    try {
      setLoadingManagers(true);
      const res = await api.get(
        `/employee-profile/department/${departmentId}/managers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let managersData = res.data || [];
      
      // If managers don't have full details, fetch them individually to get employee numbers
      if (managersData.length > 0 && !managersData[0].employeeNumber) {
        const fullManagerPromises = managersData.map(async (manager: any) => {
          try {
            const fullManager = await api.get(
              `/employee-profile/${manager._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return fullManager.data;
          } catch {
            return manager; // Return original if fetch fails
          }
        });
        managersData = await Promise.all(fullManagerPromises);
      }

      setManagers(managersData);
      setSelectedManagerId("");
    } catch (err) {
      console.error("Failed to load managers", err);
      setManagers([]);
    } finally {
      setLoadingManagers(false);
    }
  }

  // ===============================
  // GENERATE EMPLOYEE NUMBER FROM MANAGER
  // ===============================
  function generateEmployeeNumberFromManager(managerEmployeeNumber: string): string {
    if (!managerEmployeeNumber || !managerEmployeeNumber.trim()) return "";
    
    const managerNum = managerEmployeeNumber.trim();
    
    // Pattern: Use manager's employee number as base and append sequence
    // Examples:
    // - Manager: "HRM1002" → Employee: "HRM1002-001"
    // - Manager: "EMP001" → Employee: "EMP001-001"
    // - Manager: "MGR123" → Employee: "MGR123-001"
    
    // Check if it already has a suffix pattern (e.g., "HRM1002-001")
    if (managerNum.includes('-')) {
      // If manager already has suffix, increment it
      const parts = managerNum.split('-');
      const base = parts[0];
      const lastSuffix = parts[parts.length - 1];
      const suffixNum = parseInt(lastSuffix) || 0;
      const newSuffix = String(suffixNum + 1).padStart(3, '0');
      return `${base}-${newSuffix}`;
    }
    
    // If no suffix exists, add "-001"
    return `${managerNum}-001`;
  }

  // ===============================
  // HANDLE MANAGER SELECTION
  // ===============================
  function handleManagerSelection(managerId: string) {
    setSelectedManagerId(managerId);
    
    // If manager is selected, generate employee number from manager's employee number
    if (managerId) {
      const selectedManager = managers.find((m: any) => m._id === managerId);
      if (selectedManager && selectedManager.employeeNumber) {
        const generatedNumber = generateEmployeeNumberFromManager(selectedManager.employeeNumber);
        updateField("employeeNumber", generatedNumber);
      }
    }
  }

  // ===============================
  // HELPERS
  // ===============================
  function updateField(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function updateAddress(field: string, value: string) {
    setForm((prev: any) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  }

  // Fill form with sample data for testing
  function fillSampleData() {
    const today = new Date();
    const hireDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const formattedDate = hireDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Generate unique National ID using timestamp + random number
    const uniqueNationalId = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-14);
    
    // Generate unique employee number
    const uniqueEmployeeNumber = `EMP${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
    
    // Generate unique email
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;

    setForm({
      firstName: "John",
      lastName: "Doe",
      nationalId: uniqueNationalId,
      employeeNumber: uniqueEmployeeNumber,
      password: "Password123!",
      phone: `+1${String(Math.floor(Math.random() * 10000000000)).padStart(10, '0')}`,
      personalEmail: uniqueEmail,
      dateOfHire: formattedDate,
      role: "DEPARTMENT_EMPLOYEE",
      contractType: undefined,
      workType: undefined,
      status: "ACTIVE",
      primaryDepartmentId: "",
      primaryPositionId: "",
      address: {
        street: "123 Main Street",
        city: "New York",
        country: "USA",
      },
    });
    setError(null);
  }

  function cleanPayload(data: any) {
    const cleaned = JSON.parse(JSON.stringify(data));

    Object.keys(cleaned).forEach((k) => {
      if (cleaned[k] === "") cleaned[k] = undefined;

      if (
        typeof cleaned[k] === "object" &&
        cleaned[k] !== null
      ) {
        Object.keys(cleaned[k]).forEach((x) => {
          if (cleaned[k][x] === "") cleaned[k][x] = undefined;
        });
      }
    });

    return cleaned;
  }

  // ===============================
  // VALIDATION
  // ===============================
  function validateForm() {
    if (!form.firstName?.trim()) {
      setError("First name is required");
      return false;
    }
    if (!form.lastName?.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!form.nationalId?.trim()) {
      setError("National ID is required");
      return false;
    }
    if (!form.employeeNumber?.trim()) {
      setError("Employee number is required");
      return false;
    }
    if (!form.password?.trim() || form.password.length < 6) {
      setError("Password is required and must be at least 6 characters");
      return false;
    }
    if (!form.role) {
      setError("System role is required");
      return false;
    }
    if (!form.primaryDepartmentId) {
      setError("Department is required");
      return false;
    }
    if (!form.primaryPositionId) {
      setError("Position is required");
      return false;
    }
    if (!form.dateOfHire) {
      setError("Date of hire is required");
      return false;
    }
    return true;
  }

  // ===============================
  // SUBMIT
  // ===============================
  async function submit() {
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = cleanPayload(form);

      // 1️⃣ CREATE EMPLOYEE
      const res = await api.post("/employee-profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const employeeId = res.data._id;

      // 2️⃣ ASSIGN MANAGER (OPTIONAL)
      if (selectedManagerId) {
        try {
          await api.patch(
            "/employee-profile/assign-manager",
            {
              employeeId,
              managerId: selectedManagerId,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (managerErr) {
          console.warn("Manager assignment failed, but employee was created:", managerErr);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/hr/employees");
      }, 1500);
    } catch (e: any) {
      console.error(e?.response?.data || e);
      
      // Handle specific error cases
      let errorMessage = "Failed to create employee. Please check all required fields.";
      
      if (e?.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e?.response?.status === 400) {
        errorMessage = "Invalid data provided. Please check all fields.";
      } else if (e?.response?.status === 409 || e?.code === 11000 || e?.response?.data?.code === 11000) {
        // Duplicate key error (MongoDB error code 11000)
        const errorData = e?.response?.data || e;
        if (errorData?.message?.includes("nationalId") || 
            errorData?.errorResponse?.keyPattern?.nationalId ||
            errorData?.keyPattern?.nationalId ||
            errorData?.keyValue?.nationalId) {
          errorMessage = "❌ National ID already exists. Please use a different National ID.";
        } else if (errorData?.message?.includes("employeeNumber") ||
                   errorData?.errorResponse?.keyPattern?.employeeNumber ||
                   errorData?.keyPattern?.employeeNumber ||
                   errorData?.keyValue?.employeeNumber) {
          errorMessage = "❌ Employee Number already exists. Please use a different Employee Number.";
        } else {
          errorMessage = "❌ This record already exists. Please check for duplicates (National ID or Employee Number).";
        }
      } else if (e?.response?.status === 500) {
        errorMessage = "Server error. Please try again or contact support.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // ===============================
  // UI COMPONENTS
  // ===============================
  function Input({ label, required, icon, value, onChange, ...props }: any) {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-white/90 uppercase tracking-wide">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none z-10">
              {icon}
            </div>
          )}
          <input
            value={value || ""}
            onChange={onChange}
            {...props}
            className={`w-full px-4 ${icon ? 'pl-10' : ''} py-3 rounded-xl bg-white/5 border border-white/10 
                       text-white placeholder-white/40
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                       transition-all duration-200
                       hover:bg-white/8 hover:border-white/20
                       backdrop-blur-sm`}
          />
        </div>
      </div>
    );
  }

  function Select({ label, required, icon, children, value, onChange, ...props }: any) {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-white/90 uppercase tracking-wide">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none z-10">
              {icon}
            </div>
          )}
          <select
            value={value || ""}
            onChange={onChange}
            {...props}
            className={`w-full px-4 ${icon ? 'pl-10' : ''} py-3 rounded-xl bg-white/5 border border-white/10 
                       text-white
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                       transition-all duration-200
                       hover:bg-white/8 hover:border-white/20
                       backdrop-blur-sm
                       appearance-none cursor-pointer`}
          >
            {children}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  function SectionHeader({ icon, title, description }: { icon: string; title: string; description?: string }) {
    return (
      <div className="flex items-start gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
          {description && (
            <p className="text-xs text-white/60">{description}</p>
          )}
        </div>
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 sm:px-6 py-8 sm:py-12 text-white">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push("/hr/employees")}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-200"
              title="Back to employees"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Create Employee
            </h1>
            <button
              onClick={fillSampleData}
              className="ml-auto px-4 py-2 text-sm rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 transition-all duration-200"
              title="Fill form with sample data"
            >
              📝 Fill Sample Data
            </button>
          </div>
          <p className="text-sm text-white/60 ml-14">
            Add a new employee to the system
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/15 border border-green-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-200">Employee created successfully! Redirecting...</p>
            </div>
          </div>
        )}

        {/* MAIN FORM CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-10">
          
          {/* BASIC INFORMATION */}
          <section>
            <SectionHeader 
              icon="👤" 
              title="Basic Information" 
              description="Personal details and contact information"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Input 
                label="First Name" 
                required 
                icon="👤"
                value={form.firstName}
                onChange={(e: any) => updateField("firstName", e.target.value)}
                placeholder="Enter first name"
              />

              <Input 
                label="Last Name" 
                required 
                icon="👤"
                value={form.lastName}
                onChange={(e: any) => updateField("lastName", e.target.value)}
                placeholder="Enter last name"
              />

              <Input 
                label="National ID" 
                required 
                icon="🆔"
                value={form.nationalId}
                onChange={(e: any) => updateField("nationalId", e.target.value)}
                placeholder="Enter national ID"
              />

              <Input 
                label="Employee Number" 
                required 
                icon="🔢"
                value={form.employeeNumber}
                onChange={(e: any) => updateField("employeeNumber", e.target.value)}
                placeholder={selectedManagerId ? "Auto-generated from manager" : "e.g., EMP001"}
                title={selectedManagerId ? "Employee number is auto-generated from manager's employee number. You can edit it if needed." : ""}
              />

              <Input 
                label="Password" 
                type="password" 
                required 
                icon="🔒"
                value={form.password}
                onChange={(e: any) => updateField("password", e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
              />

              <Input 
                label="Phone" 
                icon="📞"
                value={form.phone}
                onChange={(e: any) => updateField("phone", e.target.value)}
                placeholder="e.g., +1234567890"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <Input 
                label="Personal Email" 
                type="email"
                icon="📧"
                value={form.personalEmail}
                onChange={(e: any) => updateField("personalEmail", e.target.value)}
                placeholder="email@example.com"
              />

              <Input 
                label="Date of Hire" 
                type="date" 
                required 
                icon="📅"
                value={form.dateOfHire}
                onChange={(e: any) => updateField("dateOfHire", e.target.value)}
              />
            </div>
          </section>

          {/* ROLE & ORGANIZATION */}
          <section>
            <SectionHeader 
              icon="🏢" 
              title="Role & Organization" 
              description="Assign role, department, position, and reporting manager"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Select 
                label="System Role" 
                required 
                icon="👔"
                value={form.role}
                onChange={(e: any) => updateField("role", e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="DEPARTMENT_EMPLOYEE">Department Employee</option>
                <option value="DEPARTMENT_HEAD">Department Head</option>
                <option value="HR_EMPLOYEE">HR Employee</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="HR_ADMIN">HR Admin</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
              </Select>

              <Select 
                label="Department" 
                required 
                icon="🏛️"
                value={form.primaryDepartmentId}
                onChange={(e: any) => {
                  updateField("primaryDepartmentId", e.target.value);
                  loadManagersByDepartment(e.target.value);
                }}
              >
                <option value="">Select Department</option>
                {departments
                  .filter((d: any) => d.isActive !== false)
                  .map((d: any) => (
                    <option key={d._id} value={d._id}>
                      {d.name} {d.code ? `(${d.code})` : ""}
                    </option>
                  ))}
              </Select>

              <Select 
                label="Position" 
                required 
                icon="💼"
                value={form.primaryPositionId}
                onChange={(e: any) => updateField("primaryPositionId", e.target.value)}
              >
                <option value="">Select Position</option>
                {positions
                  .filter((p: any) => p.isActive !== false)
                  .map((p: any) => (
                    <option key={p._id} value={p._id}>
                      {p.title || p.name} {p.code ? `(${p.code})` : ""}
                    </option>
                  ))}
              </Select>
            </div>

            <div className="mt-4 sm:mt-6">
              <Select 
                label="Manager (Optional)" 
                icon="👨‍💼"
                value={selectedManagerId}
                onChange={(e: any) => handleManagerSelection(e.target.value)}
                disabled={!form.primaryDepartmentId || loadingManagers}
              >
                <option value="">
                  {loadingManagers 
                    ? "Loading managers..." 
                    : !form.primaryDepartmentId 
                    ? "Select department first" 
                    : managers.length === 0 
                    ? "No managers available" 
                    : "Assign Manager"}
                </option>
                {managers.map((m: any) => (
                  <option key={m._id} value={m._id}>
                    {m.firstName} {m.lastName} 
                    {m.employeeNumber ? ` (${m.employeeNumber})` : ""}
                    {m.primaryPositionId && typeof m.primaryPositionId === "object" 
                      ? ` - ${m.primaryPositionId.title || m.primaryPositionId.name}` 
                      : ""}
                  </option>
                ))}
              </Select>
              {form.primaryDepartmentId && managers.length === 0 && !loadingManagers && (
                <p className="text-xs text-white/50 mt-2 ml-1">
                  No managers found in this department
                </p>
              )}
            </div>
          </section>

          {/* ADDRESS */}
          <section>
            <SectionHeader 
              icon="📍" 
              title="Address" 
              description="Employee address information (optional)"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Input 
                label="Street" 
                icon="🛣️"
                value={form.address.street}
                onChange={(e: any) => updateAddress("street", e.target.value)}
                placeholder="Street address"
              />

              <Input 
                label="City" 
                icon="🏙️"
                value={form.address.city}
                onChange={(e: any) => updateAddress("city", e.target.value)}
                placeholder="City"
              />

              <Input 
                label="Country" 
                icon="🌍"
                value={form.address.country}
                onChange={(e: any) => updateAddress("country", e.target.value)}
                placeholder="Country"
              />
            </div>
          </section>

          {/* ACTIONS */}
          <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => router.push("/hr/employees")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 font-medium"
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={loading || success}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 font-semibold shadow-lg shadow-cyan-500/20
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : success ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Created!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Employee
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
