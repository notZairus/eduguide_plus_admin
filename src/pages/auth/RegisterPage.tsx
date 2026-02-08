import nc_logo from "@/assets/images/nc_logo.png";
import { useState, type FormEvent } from "react";
import { api } from "../../lib/api";
import { Separator } from "../../components/ui/separator";
import { useNavigate, Link } from "react-router";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

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
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

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
    } catch (err: any) {
      setError(err?.response?.data || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nc-blue">
      <div className="bg-white h-min rounded shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 mb-3 flex items-center justify-center rounded-full border">
            {/* Replace src with your actual logo */}
            <img
              src={nc_logo}
              alt="NC EduGuide+ Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">NC EduGuide+</h1>
        </div>

        <div className="text-center text-destructive">{error}</div>

        <Separator className="my-8"></Separator>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <Label className="mb-2">
                  Email <span className="text-nc-blue">*</span>
                </Label>
                <Input
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  type="email"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label className="mb-2">
                  Password <span className="text-nc-blue">*</span>
                </Label>
                <Input
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  type="password"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <Label className="mb-2">
                  Confirm Password <span className="text-nc-blue">*</span>
                </Label>
                <Input
                  required
                  minLength={8}
                  value={formData.passwordConfirmation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passwordConfirmation: e.target.value,
                    })
                  }
                  type="password"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <Separator orientation="vertical" />

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <Label className="mb-2">
                  First Name <span className="text-nc-blue">*</span>
                </Label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  type="text"
                  placeholder="First name"
                />
              </div>

              <div>
                <Label className="mb-2">Middle Name</Label>
                <Input
                  value={formData.middleName}
                  onChange={(e) =>
                    setFormData({ ...formData, middleName: e.target.value })
                  }
                  type="text"
                  placeholder="Middle name"
                />
              </div>

              <div>
                <Label className="mb-2">
                  Last Name <span className="text-nc-blue">*</span>
                </Label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  type="text"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-nc-blue text-white py-2 hover:bg-nc-blue/90 transition"
          >
            Register
          </button>

          <div className="text-center mt-4 text-sm">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
