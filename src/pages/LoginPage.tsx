import nc_logo from "@/assets/images/nc_logo.png";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // #TODO send request to backend

    setLoginData({ email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nc-blue">
      <div className="bg-white h-screen md:h-min w-full md:w-sm rounded shadow-lg p-8 hover:scale-102 transition duration-500">
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

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              value={loginData.email}
              onChange={(e) => {
                setLoginData({ ...loginData, email: e.target.value });
              }}
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              value={loginData.password}
              onChange={(e) => {
                setLoginData({ ...loginData, password: e.target.value });
              }}
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full mt-4 bg-[#2f6fb2] text-white py-2 rounded-md font-medium hover:bg-[#285f98] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
