import eg_logo from "@/assets/images/eg_logo.png";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../lib/api";
import { useLocation, useNavigate, Link } from "react-router";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { AlertCircle } from "lucide-react";

type VerificationLocationState = {
  email?: string;
};

export default function VerifyRegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as VerificationLocationState) || {};

  const [email, setEmail] = useState(locationState.email || "");
  const [verification_token, setVerificationToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!locationState.email?.trim()) {
      navigate("/login", { replace: true });
    }
  }, [locationState.email, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/verify-registration", {
        email,
        verification_token,
      });

      if (res.data?.status === 200 || res.status === 200) {
        setSuccess("Email verified successfully. You can now log in.");
        await new Promise((resolve) => setTimeout(resolve, 1200));
        navigate("/login");
        return;
      }

      setError("Invalid or expired verification code.");
    } catch (e) {
      console.log(e);
      setError("Invalid or expired verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#142e67] p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 mb-4 rounded-full ring-4 ring-blue-100 overflow-hidden flex items-center justify-center bg-white">
              <img
                src={eg_logo}
                alt="EduGuide+ Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#142e67] tracking-tight">
              Verify Email
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Enter the code sent to your email
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-5">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 mb-5">
              <AlertCircle size={15} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1.5 block"
              >
                Email address
              </Label>
              <Input
                disabled
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="verificationCode"
                className="text-sm font-medium text-gray-700 mb-1.5 block"
              >
                Verification code
              </Label>
              <Input
                id="verificationCode"
                required
                value={verification_token}
                onChange={(e) => setVerificationToken(e.target.value)}
                placeholder="Enter your code"
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg border bg-[#142e67] text-white py-2 font-semibold hover:bg-[#0f1f4a] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify account"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            Back to{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
