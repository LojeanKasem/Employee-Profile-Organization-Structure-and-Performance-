import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouteGuard } from "../utils/useRouteGuard";

export default function App({ Component, pageProps }: AppProps) {
  const { isChecking, isAuthorized } = useRouteGuard();

  // Show loading while checking permissions
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Only render if authorized (or public route)
  if (!isAuthorized) {
    return null; // Will redirect via useRouteGuard
  }

  return <Component {...pageProps} />;
}
