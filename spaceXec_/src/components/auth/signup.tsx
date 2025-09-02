import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import firebaseConfig from "../../FirebaseConfig/FirebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // 🔹 Added phone number field
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create user in Firebase Authentication
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;

      // Send Firebase Email Verification
      // await sendEmailVerification(user);

      // Save user in MongoDB after Firebase Verification
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }), // 🔹 Included phone number
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccessMessage("Registration successful! Verify your email before logging in.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-6">
        <h2 className="font-mono text-[#D4AF37] mt-6 text-center text-3xl font-extrabold">
          Join SpaceExec
        </h2>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {successMessage && <div className="text-green-500 text-sm mt-2">{successMessage}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div>
            <input
              type="text"
              required
              placeholder="Full Name"
              className="font-mono w-full px-3 py-2 border border-[#D4AF37] rounded-md bg-transparent text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div> 
            <input
              type="tel"
              required
              placeholder="Phone Number"
              className="font-mono w-full px-3 py-2 border border-[#D4AF37] rounded-md bg-transparent text-black"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              required
              placeholder="Password"
              className="font-mono w-full px-3 py-2 border border-[#D4AF37] rounded-md bg-transparent text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              required
              placeholder="Confirm Password"
              className="font-mono w-full px-3 py-2 border border-[#D4AF37] rounded-md bg-transparent text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full py-2 bg-[#D4AF37] text-black rounded-md hover:bg-black hover:text-[#D4AF37]">
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="font-mono text-sm text-gray-400 hover:text-[#D4AF37]">
            Already have an account? <span className="text-[#D4AF37]">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
