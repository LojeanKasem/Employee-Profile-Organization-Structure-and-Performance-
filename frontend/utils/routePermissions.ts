/**
 * Route Permissions Configuration
 * Defines which roles can access which routes
 */

export type SystemRole = 
  | "SYSTEM_ADMIN"
  | "HR_MANAGER" 
  | "HR_EMPLOYEE" 
  | "HR_ADMIN"
  | "DEPARTMENT_HEAD"
  | "DEPARTMENT_EMPLOYEE";

/**
 * Normalize role from localStorage to SystemRole
 */
export function normalizeRole(role: string | null): SystemRole | null {
  if (!role) return null;
  
  const normalized = role.toUpperCase().replaceAll(" ", "_");
  
  // Map to SystemRole enum
  if (normalized === "SYSTEM_ADMIN") return "SYSTEM_ADMIN";
  if (normalized === "HR_MANAGER") return "HR_MANAGER";
  if (normalized === "HR_EMPLOYEE") return "HR_EMPLOYEE";
  if (normalized === "HR_ADMIN") return "HR_ADMIN";
  if (normalized === "DEPARTMENT_HEAD") return "DEPARTMENT_HEAD";
  if (normalized === "DEPARTMENT_EMPLOYEE") return "DEPARTMENT_EMPLOYEE";
  
  return null;
}

/**
 * Route permissions map
 * Key: route path (supports wildcards with *)
 * Value: array of allowed roles
 */
export const ROUTE_PERMISSIONS: Record<string, SystemRole[]> = {
  // Public routes (no auth required)
  "/login": [],
  "/register": [],
  
  // Dashboard - all authenticated users
  "/dashboard": [
    "SYSTEM_ADMIN",
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "DEPARTMENT_HEAD",
    "DEPARTMENT_EMPLOYEE",
  ],
  
  // HR routes - HR roles only
  "/hr/*": ["HR_MANAGER", "HR_EMPLOYEE", "HR_ADMIN", "SYSTEM_ADMIN"],
  
  // Manager routes - Department Heads only
  "/manager/*": ["DEPARTMENT_HEAD", "SYSTEM_ADMIN"],
  
  // Admin routes - System Admin only
  "/admin/*": ["SYSTEM_ADMIN"],
  
  // Performance - Main page: HR, Managers, and Employees
  "/performance": [
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "DEPARTMENT_HEAD",
    "DEPARTMENT_EMPLOYEE",
    "SYSTEM_ADMIN",
  ],
  
  // Performance templates - HR and Admin only (more specific, checked first)
  "/performance/templates/*": [
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "SYSTEM_ADMIN",
  ],
  
  // Performance cycles - HR and Admin only
  "/performance/cycles/*": [
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "SYSTEM_ADMIN",
  ],
  
  // My appraisals - All authenticated users (employees can view their own)
  "/performance/my-appraisals/*": [
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "DEPARTMENT_HEAD",
    "DEPARTMENT_EMPLOYEE",
    "SYSTEM_ADMIN",
  ],
  
  // Manager appraisals - Managers and HR only
  "/performance/appraisals/*": [
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "DEPARTMENT_HEAD",
    "SYSTEM_ADMIN",
  ],
  
  // Performance disputes - HR only
  "/performance/disputes/*": [
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "SYSTEM_ADMIN",
  ],
  
  // Other performance routes - HR, Managers, and Employees (fallback)
  "/performance/*": [
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "DEPARTMENT_HEAD",
    "DEPARTMENT_EMPLOYEE",
    "SYSTEM_ADMIN",
  ],
  
  // Employee Profile - all authenticated users
  "/employee-profile/*": [
    "SYSTEM_ADMIN",
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "DEPARTMENT_HEAD",
    "DEPARTMENT_EMPLOYEE",
  ],
  
  // Organization Structure - HR and Admin
  "/organization-structure/*": [
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "SYSTEM_ADMIN",
  ],
  
  // Subsystems - various roles (will be more specific per subsystem)
  "/subsystems/*": [
    "SYSTEM_ADMIN",
    "HR_MANAGER",
    "HR_EMPLOYEE",
    "HR_ADMIN",
    "DEPARTMENT_HEAD",
    "DEPARTMENT_EMPLOYEE",
  ],
};

/**
 * Check if a route matches a pattern (supports wildcards)
 */
function routeMatches(pattern: string, path: string): boolean {
  // Exact match
  if (pattern === path) return true;
  
  // Wildcard match
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -2);
    // Match if path starts with prefix followed by / or equals prefix
    return path.startsWith(prefix + "/") || path === prefix;
  }
  
  return false;
}

/**
 * Check if user has permission to access a route
 * More specific routes are checked first
 */
export function hasRoutePermission(path: string, userRole: SystemRole | null): boolean {
  if (!userRole) return false;
  
  // Sort patterns by specificity (more specific first)
  const patterns = Object.keys(ROUTE_PERMISSIONS).sort((a, b) => {
    // Exact matches first
    if (a === path) return -1;
    if (b === path) return 1;
    
    // Then by path depth (deeper paths are more specific)
    const aDepth = a.split("/").length;
    const bDepth = b.split("/").length;
    if (aDepth !== bDepth) return bDepth - aDepth;
    
    // Then by length (longer paths are more specific)
    return b.length - a.length;
  });
  
  // Check patterns in order (most specific first)
  for (const pattern of patterns) {
    if (routeMatches(pattern, path)) {
      return ROUTE_PERMISSIONS[pattern].includes(userRole);
    }
  }
  
  // Default: deny access if route not in permissions map
  return false;
}

/**
 * Get allowed roles for a route
 */
export function getAllowedRolesForRoute(path: string): SystemRole[] {
  // Check exact matches first
  if (ROUTE_PERMISSIONS[path]) {
    return ROUTE_PERMISSIONS[path];
  }
  
  // Check wildcard patterns
  for (const [pattern, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (routeMatches(pattern, path)) {
      return allowedRoles;
    }
  }
  
  // Default: no roles allowed
  return [];
}

