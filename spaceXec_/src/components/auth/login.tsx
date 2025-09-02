import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firebaseConfig from "../../FirebaseConfig/FirebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 Handle Email & Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL
      : "http://localhost:5000";

  try {
    const res = await fetch(`${baseUrl}/api/users/loginwithemail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // important if you're using cookies for auth
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }
  
      // Optionally store token or user data in state/localStorage here
      console.log("Logged in user:", data);
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("_id", data._id);
      localStorage.setItem("name", data.name);
      localStorage.setItem("profile_pic", data.profile_pic);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);
      console.log("data")
      console.log(data)
      switch (data.role) {
        case "admin":
          navigate("/admindashboard", { replace: true });
          window.location.reload();
          break;
        case "vendor":
          navigate("/vendordashboard", { replace: true });
          window.location.reload();
          break;
        case "channel-partner":
          navigate("/dashboard/channelpartner", { replace: true });
          window.location.reload();
          break;
        default:
          navigate("/", { replace: true });
          window.location.reload();
          break;
      }
      
  
      // Redirect or update UI as needed
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  

  // 🔹 Handle Google Login
  const signInWithGoogle = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      await sendUserDataToBackend(token, {
        googleUser: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      });

    } catch (err) {
      setError(err.message || "Error signing in with Google.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Send User Data to Backend & Handle Response
  const sendUserDataToBackend = async (token, userData) => {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_URL
        : "http://localhost:5000";

    try {
      const res = await fetch(`${baseUrl}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed.");
      }

      const data = await res.json();
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("_id", data._id);
      localStorage.setItem("name", data.name);
      localStorage.setItem("profile_pic", data.profile_pic);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);

      switch (data.role) {
        case "admin":
          navigate("/admindashboard", { replace: true });
          window.location.reload();
          break;
        case "vendor":
          navigate("/vendordashboard", { replace: true });
          window.location.reload();
          break;
        case "channel-partner":
          navigate("/dashboard/channelpartner", { replace: true });
          window.location.reload();
          break;
        default:
          navigate("/", { replace: true });
          window.location.reload();
          break;
      }
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-4">
        <p className="flex text-3xl sm:text-sm md:text-3xl text-mono text-gray-600 typing-effect">
          Elevating Real Estate with SpaceXec
        </p>

        <style>{`
          .typing-effect {
            overflow: hidden;
            border-right: 0.15em solid #D4AF37;
            white-space: nowrap;
            letter-spacing: 0.20em;
            animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
          }
          @keyframes typing {
            from { width: 0 }
            to { width: 100% }
          }
          @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: #D4AF37 }
          }
        `}</style>

        <h2 className="font-mono text-[#D4AF37] mt-6 text-center text-2xl sm:text-3xl font-extrabold">
          Login to SpaceXec
        </h2>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only font-mono">Email address</label>
              <input
                type="email"
                required
                placeholder="Email address"
                className="font-mono appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:z-10 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                required
                placeholder="Password"
                className="font-mono appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-b-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:z-10 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            // onClick={handleSubmit}
            className="font-mono w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#D4AF37] hover:text-[#D4AF37] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="font-mono w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:text-[#D4AF37] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
          >
            {loading ? "Signing in..." : "Login with Google"}
          </button>
        </div>

        <div className="mt-4 text-center space-y-2 sm:space-y-0 sm:flex sm:justify-between">
          <Link to="/signup" className="font-mono text-sm text-gray-500 hover:text-[#D4AF37]">
            Don't have an account? <span className="text-[#D4AF37]">Signup</span>
          </Link>

          <Link to="/forgotpassword" className="font-mono text-sm text-white hover:text-[#D4AF37]">
            <span className="text-[#D4AF37]">Forgot Password</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
