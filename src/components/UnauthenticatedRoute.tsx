import { useEffect, useState, type JSX } from "react";
import { isAuthenticated } from "../lib/auth";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";

export default function UnauthenticatedRoute(): JSX.Element | null {
  const { auth, setAuth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const user = await isAuthenticated();
      setAuth(user);
    }

    checkAuth();
  }, []);

  if (auth) {
    navigate("/dashboard");
  }

  return <Outlet />;
}
