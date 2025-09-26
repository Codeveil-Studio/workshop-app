import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import showPasswordIcon from "../assets/showpassword.png";
import hidePasswordIcon from "../assets/hidepassword.png";
import logo from "../assets/logo.png";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const showError = (message) => {
    setError(message);
    setShowToast(true);
    window.clearTimeout(window.__fp_toast_timeout);
    window.__fp_toast_timeout = window.setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email || !isValidEmail(email)) {
      showError("Please enter a valid email address.");
      return;
    }
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      showError("Please enter the 6-digit OTP.");
      return;
    }
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-3 bg-white border border-red-200 text-red-700 rounded-lg shadow-lg px-4 py-3 w-72">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <div className="flex-1 text-sm">{error}</div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="bg-white w-[350px] p-6 rounded-xl shadow-md">
        <img src={logo} alt="Logo" className="mx-auto mb-6 h-16" />

        <h2 className="text-center text-xl font-semibold text-gray-800">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          {step === 1 && "Enter your registered email to receive an OTP."}
          {step === 2 && "Enter the OTP sent to your email."}
          {step === 3 && "Create your new password."}
        </p>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Registered email"
              className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              Send OTP
            </button>
            <div className="text-center text-sm">
              <Link to="/login" className="text-gray-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(digits);
              }}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 tracking-widest"
              required
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="w-full pr-10 pl-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showNewPassword ? hidePasswordIcon : showPasswordIcon}
                  alt={showNewPassword ? "Hide password" : "Show password"}
                  className="h-5 w-5 opacity-80"
                />
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pr-10 pl-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showConfirmPassword ? hidePasswordIcon : showPasswordIcon}
                  alt={showConfirmPassword ? "Hide password" : "Show password"}
                  className="h-5 w-5 opacity-80"
                />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 border rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


