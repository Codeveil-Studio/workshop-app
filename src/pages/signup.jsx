import { Link } from "react-router-dom";
import { useState } from "react";
import showPasswordIcon from "../assets/showpassword.png";
import hidePasswordIcon from "../assets/hidepassword.png";

import logo from "../assets/logo.png";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-[350px] p-6 rounded-xl shadow-md">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-6 h-16"
        />

        <h2 className="text-center text-xl font-semibold text-gray-800">
          Sign Up
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Welcome back, Sign in to continue
        </p>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pr-10 pl-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <img
                src={showPassword ? hidePasswordIcon : showPasswordIcon}
                alt={showPassword ? "Hide password" : "Show password"}
                className="h-5 w-5 opacity-80"
              />
            </button>
          </div>

          <label className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="mr-2" />
            I agree with our{" "}
            <span className="text-green-600 ml-1">Terms and Conditions</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
