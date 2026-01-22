import { useEffect, useState, type JSX } from "react";
import { isAuthenticated } from "../lib/auth";
import { useNavigate } from "react-router";

export default function UnauthenticatedRoute({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element | null {
  const [auth, setAuth] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const user = await isAuthenticated();
      setAuth(user ? true : false);
    }

    checkAuth();
  }, []);

  if (auth === null) {
    return null;
  }

  if (auth) {
    navigate("/dashboard");
  }

  return <>{children}</>;
}
