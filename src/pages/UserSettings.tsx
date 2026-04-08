import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { useAuthContext } from "../contexts/AuthContext";
import { api } from "../lib/api";

type AlertState = { type: "success" | "error"; message: string } | null;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;
const PASSWORD_STRENGTH_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/;

const UserSettings = () => {
  const { auth, setAuth } = useAuthContext();

  const [profileData, setProfileData] = useState({
    first_name: auth?.firstName ?? "",
    middle_name: auth?.middleName ?? "",
    last_name: auth?.lastName ?? "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileAlert, setProfileAlert] = useState<AlertState>(null);
  const [passwordAlert, setPasswordAlert] = useState<AlertState>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileAlert(null);
    try {
      const { data } = await api.patch("/users/me", {
        first_name: profileData.first_name,
        middle_name: profileData.middle_name || undefined,
        last_name: profileData.last_name,
      });
      setAuth((prev: User | null) =>
        prev
          ? {
              ...prev,
              firstName: data.user.first_name ?? prev.firstName,
              middleName: data.user.middle_name ?? prev.middleName,
              lastName: data.user.last_name ?? prev.lastName,
            }
          : prev,
      );
      setProfileAlert({
        type: "success",
        message: "Profile updated successfully.",
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update profile.";
      setProfileAlert({ type: "error", message });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordAlert(null);

    const trimmedNewPassword = passwordData.new_password.trim();
    const trimmedConfirmPassword = passwordData.confirm_password.trim();

    if (
      trimmedNewPassword.length < PASSWORD_MIN_LENGTH ||
      trimmedNewPassword.length > PASSWORD_MAX_LENGTH
    ) {
      setPasswordAlert({
        type: "error",
        message: `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters.`,
      });
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordAlert({
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }

    if (!PASSWORD_STRENGTH_REGEX.test(trimmedNewPassword)) {
      setPasswordAlert({
        type: "error",
        message:
          "Password must include at least one lowercase letter, one uppercase letter, and one symbol.",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await api.patch("/users/me/password", {
        current_password: passwordData.current_password,
        new_password: trimmedNewPassword,
        confirm_password: trimmedConfirmPassword,
      });
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPasswordAlert({
        type: "success",
        message: "Password changed successfully.",
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to change password.";
      setPasswordAlert({ type: "error", message });
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials =
    `${auth?.firstName?.[0] ?? ""}${auth?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="size-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold select-none shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            {auth
              ? [auth.firstName, auth.middleName, auth.lastName]
                  .filter(Boolean)
                  .join(" ")
              : "User Settings"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and password.
          </p>
        </div>
      </div>

      <Separator />

      {/* ── Profile card ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-4" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your name and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  disabled
                  id="first_name"
                  name="first_name"
                  value={profileData.first_name}
                  onChange={handleProfileChange}
                  minLength={2}
                  required
                  placeholder="Juan"
                />
              </div>

              {/* Middle Name */}
              <div className="space-y-1.5">
                <Label htmlFor="middle_name">
                  Middle Name{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  disabled
                  id="middle_name"
                  name="middle_name"
                  value={profileData.middle_name}
                  onChange={handleProfileChange}
                  placeholder=""
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  disabled
                  id="last_name"
                  name="last_name"
                  value={profileData.last_name}
                  onChange={handleProfileChange}
                  minLength={2}
                  required
                  placeholder="dela Cruz"
                />
              </div>
            </div>

            {profileAlert && (
              <div
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  profileAlert.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {profileAlert.type === "success" ? (
                  <CheckCircle2 className="size-4 shrink-0" />
                ) : (
                  <AlertCircle className="size-4 shrink-0" />
                )}
                {profileAlert.message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* ── Password card ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-4" />
            Change Password
          </CardTitle>
          <CardDescription>
            Choose a strong password between 8 and 32 characters with lowercase,
            uppercase, and symbol.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current password */}
            <div className="space-y-1.5">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  name="current_password"
                  type={showCurrentPw ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showCurrentPw ? "Hide password" : "Show password"}
                >
                  {showCurrentPw ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Separator />

            {/* New password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    name="new_password"
                    type={showNewPw ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    minLength={PASSWORD_MIN_LENGTH}
                    maxLength={PASSWORD_MAX_LENGTH}
                    required
                    placeholder="Min. 8 characters"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showNewPw ? "Hide password" : "Show password"}
                  >
                    {showNewPw ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPw ? "text" : "password"}
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    minLength={PASSWORD_MIN_LENGTH}
                    maxLength={PASSWORD_MAX_LENGTH}
                    required
                    placeholder="Repeat new password"
                    className="pr-10"
                    aria-invalid={
                      passwordData.confirm_password.length > 0 &&
                      passwordData.confirm_password !==
                        passwordData.new_password
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showConfirmPw ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPw ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {passwordData.confirm_password.length > 0 &&
                  passwordData.confirm_password !==
                    passwordData.new_password && (
                    <p className="text-xs text-destructive">
                      Passwords do not match.
                    </p>
                  )}
              </div>
            </div>

            {passwordAlert && (
              <div
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  passwordAlert.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {passwordAlert.type === "success" ? (
                  <CheckCircle2 className="size-4 shrink-0" />
                ) : (
                  <AlertCircle className="size-4 shrink-0" />
                )}
                {passwordAlert.message}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? "Updating…" : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
