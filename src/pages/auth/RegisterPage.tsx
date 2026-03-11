import eg_logo from "@/assets/images/eg_logo.png";
import { useState, type FormEvent } from "react";
import { api } from "../../lib/api";
import { useNavigate, Link } from "react-router";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    passwordConfirmation: string;
    firstName: string;
    middleName: string;
    lastName: string;
  }>({
    email: "",
    password: "",
    passwordConfirmation: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
      });

      if (res.status === 200) navigate("/login");

      setFormData({
        email: "",
        password: "",
        passwordConfirmation: "",
        firstName: "",
        middleName: "",
        lastName: "",
      });
    } catch (err) {
      const e = err as { response?: { data?: string } };
      setError(e?.response?.data || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#142e67] p-4">
      {/* Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-blue-500 via-blue-700 to-[#142e67]" />

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
            <p className="text-sm text-gray-400 mt-0.5">Create an account</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-5">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* Left column */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  type="email"
                  placeholder="you@example.com"
                  className="w-full"
                />
              </div>

              <div>
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  First name
                </Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  type="text"
                  placeholder="First name"
                  className="w-full"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
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

              <div>
                <Label
                  htmlFor="middleName"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Middle name{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) =>
                    setFormData({ ...formData, middleName: e.target.value })
                  }
                  type="text"
                  placeholder="Middle name"
                  className="w-full"
                />
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    required
                    minLength={8}
                    value={formData.passwordConfirmation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passwordConfirmation: e.target.value,
                      })
                    }
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Last name
                </Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  type="text"
                  placeholder="Last name"
                  className="w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-lg border bg-[#142e67] text-white py-2 font-semibold hover:bg-[#0f1f4a] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account…" : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2 w-fit mx-auto">
              Already have an account?
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
