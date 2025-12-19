import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { normalizeRole, hasRoutePermission, SystemRole } from "./routePermissions";

/**
 * Hook to protect routes based on user role
 * Redirects unauthorized users to appropriate page
 */
export function useRouteGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      setIsChecking(false);
      setIsAuthorized(true); // Allow SSR to proceed, check on client
      return;
    }

    const checkAccess = () => {
      const path = router.pathname;
      
      // Public routes - always allow
      if (path === "/login" || path === "/register" || path === "/") {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // Check authentication
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        setIsChecking(false);
        return;
      }

      // Get user role
      const role = localStorage.getItem("role");
      const normalizedRole = normalizeRole(role) as SystemRole | null;

      if (!normalizedRole) {
        // Invalid role - redirect to login
        localStorage.clear();
        router.push("/login");
        setIsChecking(false);
        return;
      }

      // Check route permission
      const hasPermission = hasRoutePermission(path, normalizedRole);

      if (!hasPermission) {
        // User doesn't have permission - redirect to dashboard
        console.warn(`Access denied: User with role ${normalizedRole} tried to access ${path}`);
        router.push("/dashboard");
        setIsChecking(false);
        return;
      }

      // Authorized
      setIsAuthorized(true);
      setIsChecking(false);
    };

    // Small delay to ensure router is ready
    const timer = setTimeout(checkAccess, 0);
    return () => clearTimeout(timer);
  }, [router.pathname, router]);

  return { isChecking, isAuthorized };
}

