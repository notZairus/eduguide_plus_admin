import { useEffect, useState, type JSX } from "react";
import { isAuthenticated } from "../lib/auth";
import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import HandbookProvider from "../providers/HandbookProvider";

export default function AuthenticatedRoute(): JSX.Element | null {
  const { auth, setAuth } = useAuthContext();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const user = await isAuthenticated();
      setAuth(user || null);
      setIsChecking(false);
    }

    checkAuth();
  }, [setAuth]);

  if (isChecking) {
    return null;
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <HandbookProvider>
      <Outlet />
    </HandbookProvider>
  );
}
