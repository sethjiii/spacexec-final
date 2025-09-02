import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send password reset email.");
      }

      setSuccessMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send password reset email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-6">
        <h2 className="font-mono text-[#D4AF37] mt-6 text-center text-3xl font-extrabold">
          Reset Your Password
        </h2>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {successMessage && (
          <div className="text-green-500 text-sm mt-2">{successMessage}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div>
            <input
              type="email"
              required
              placeholder="Email Address"
              className="font-mono w-full px-3 py-2 border border-[#D4AF37] rounded-md bg-transparent text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#D4AF37] text-black rounded-md hover:bg-black hover:text-[#D4AF37]"
          >
            Send Reset Email
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="font-mono text-sm text-gray-400 hover:text-[#D4AF37]"
          >
            Remembered your password?{" "}
            <span className="text-[#D4AF37]">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
