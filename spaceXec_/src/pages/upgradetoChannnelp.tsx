import { useEffect, useState } from "react";

export default function BecomeChannelPartner() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    company: "",
    location: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Your code here runs once when the component mounts
    setFormData((prevData) => ({
      ...prevData,
      name: localStorage.getItem("name") || "",
      email: localStorage.getItem("email") || "",
    }));
  }, []);
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const user = localStorage.getItem("_id"); // assume stored user info
    console.log(user);
    if (!user || !user) {
      setError("User not logged in");
      return;
    }

    try {
      const baseUrl =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_BACKEND_URL
          : "http://localhost:5000";

      const token = localStorage.getItem("token"); // JWT stored after login

      const response = await fetch(
        `${baseUrl}/api/users/channelpartner/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ attach JWT
          },
          body: JSON.stringify({
            ...formData,
            addedBy: user,
            user_identity: user,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create channel partner");
      }

      setMessage(
        "Your profile is being push for admin approval, you will be notified after approval. Stay tuned!!!"
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-black font-mono">
          Become a Channel Partner
        </h2>

        {message && <div className="text-green-500">{message}</div>}
        {error && <div className="text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            value={formData.name}
            disabled
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded font-mono"
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled
            className="w-full border px-3 py-2 rounded font-mono"
          />
          <input
            type="text"
            name="mobile"
            required
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded font-mono"
          />
          <input
            type="text"
            name="location"
            required
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded font-mono"
          />
          <input
            type="text"
            name="company"
            placeholder="Company (Optional)"
            value={formData.company}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded font-mono"
          />

          <button
            type="submit"
            className="w-full bg-[#D4AF37] hover:bg-black hover:text-[#D4AF37] text-black py-2 rounded font-mono"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
