import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token || !email) {
      setError("Invalid or missing token/email");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccessMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-6">
        <h2 className="font-mono text-[#D4AF37] mt-6 text-center text-3xl font-extrabold">
          Set New Password
        </h2>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {successMessage && <div className="text-green-500 text-sm mt-2">{successMessage}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleReset}>
          <div>
            <input
              type="password"
              required
              placeholder="New Password"
              className="font-mono w-full px-3 py-2 border border-[#D4AF37] rounded-md bg-transparent text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              required
              placeholder="Confirm New Password"
              className="font-mono w-full px-3 py-2 border border-[#D4AF37] rounded-md bg-transparent text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#D4AF37] text-black rounded-md hover:bg-black hover:text-[#D4AF37]"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="font-mono text-sm text-gray-400 hover:text-[#D4AF37]"
          >
            Remembered your password? <span className="text-[#D4AF37]">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
