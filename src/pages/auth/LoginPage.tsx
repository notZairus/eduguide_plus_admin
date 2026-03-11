import eg_logo from "@/assets/images/eg_logo.png";
import { useState, type FormEvent } from "react";
import { api } from "../../lib/api";
import { useNavigate, Link } from "react-router";
import { useAuthContext } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({
    email: "zairusvillasisbermillo@gmail.com",
    password: "QZr8408o",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", loginData);
      setAuth(res.data.user);
      navigate("/dashboard");
    } catch (e) {
      const err = e as { response?: { data?: string } };
      setError(err?.response?.data || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }

    setLoginData({ email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#142e67] p-4">
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Logo + branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 mb-4 rounded-full ring-4 ring-blue-100 overflow-hidden flex items-center justify-center bg-white">
              <img
                src={eg_logo}
                alt="EduGuide+ Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#142e67] tracking-tight">
              EduGuide+
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Admin Portal</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-5">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1.5 block"
              >
                Email address
              </Label>
              <Input
                id="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                type="email"
                placeholder="you@example.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg border bg-[#142e67] text-white py-2 font-semibold hover:bg-[#0f1f4a] transition-colors cursor-pointer"
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2 w-fit mx-auto">
              New here?
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
