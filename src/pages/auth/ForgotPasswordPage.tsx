import eg_logo from "@/assets/images/eg_logo.png";
import { AlertCircle } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { api } from "../../lib/api";

type Step = "request" | "reset";
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;
const PASSWORD_STRENGTH_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitLabel = useMemo(() => {
    if (isLoading && step === "request") return "Sending token...";
    if (isLoading && step === "reset") return "Resetting password...";
    if (step === "request") return "Send reset token";
    return "Reset password";
  }, [isLoading, step]);

  const handleRequestReset = async () => {
    await api.post("/auth/forgot-password/request", { email });
    setSuccess(
      "If this account exists, a reset token has been sent to your email.",
    );
    setError("");
    setStep("reset");
  };

  const handleResetPassword = async () => {
    const trimmedNewPassword = newPassword.trim();
    const trimmedPasswordConfirmation = newPasswordConfirmation.trim();

    if (
      trimmedNewPassword.length < PASSWORD_MIN_LENGTH ||
      trimmedNewPassword.length > PASSWORD_MAX_LENGTH
    ) {
      setError(
        `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`,
      );
      return;
    }

    if (!PASSWORD_STRENGTH_REGEX.test(trimmedNewPassword)) {
      setError(
        "Password must include at least one lowercase letter, one uppercase letter, and one symbol",
      );
      return;
    }

    if (trimmedNewPassword !== trimmedPasswordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    await api.post("/auth/forgot-password/reset", {
      email,
      verificationToken,
      newPassword: trimmedNewPassword,
    });

    setError("");
    setSuccess("Password reset successful. Redirecting to login...");
    setTimeout(() => navigate("/login"), 1200);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (step === "request") {
        await handleRequestReset();
      } else {
        await handleResetPassword();
      }
    } catch (e) {
      const err = e as {
        response?: {
          data?:
            | string
            | {
                message?: string;
              };
        };
      };

      if (typeof err?.response?.data === "string") {
        setError(err.response.data);
      } else {
        setError(
          err?.response?.data?.message ||
            "Unable to process forgot password request.",
        );
      }
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
              Forgot password
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Admin Portal</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-5">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 mb-5">
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
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                required
                className="w-full"
              />
            </div>

            {step === "reset" && (
              <>
                <div>
                  <Label
                    htmlFor="verificationToken"
                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                  >
                    Verification token
                  </Label>
                  <Input
                    id="verificationToken"
                    value={verificationToken}
                    onChange={(e) => setVerificationToken(e.target.value)}
                    type="text"
                    placeholder="Enter token from your email"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                  >
                    New password
                  </Label>
                  <Input
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="8+ characters"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    maxLength={PASSWORD_MAX_LENGTH}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="newPasswordConfirmation"
                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                  >
                    Confirm new password
                  </Label>
                  <Input
                    id="newPasswordConfirmation"
                    value={newPasswordConfirmation}
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                    type="password"
                    placeholder="Re-enter new password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    maxLength={PASSWORD_MAX_LENGTH}
                    className="w-full"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg border bg-[#142e67] text-white py-2 font-semibold hover:bg-[#0f1f4a] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitLabel}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-5">
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
