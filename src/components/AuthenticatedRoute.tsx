import { useEffect, type JSX } from "react";
import { isAuthenticated } from "../lib/auth";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import HandbookProvider from "../providers/HandbookProvider";

export default function AuthenticatedRoute(): JSX.Element | null {
  const { auth, setAuth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const user = await isAuthenticated();
      setAuth(user);
    }

    checkAuth();
  }, []);

  if (!auth) {
    navigate("/login");
  }

  return (
    <HandbookProvider>
      <Outlet />
    </HandbookProvider>
  );
}
