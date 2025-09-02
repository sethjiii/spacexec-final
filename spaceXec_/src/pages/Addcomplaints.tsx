// components/NewTicketForm.tsx
"use client"

import { useState } from "react";
import { toast } from "react-toastify";

export default function NewTicketForm({ onBack }: { onBack: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem("_id");
      const baseUrl =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_BACKEND_URL
          : "http://localhost:5000";

      const res = await fetch(`${baseUrl}/api/users/addcomplaint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Ticket Raised successfully");
        onBack(); // Go back to the ticket list
      } else {
        toast.error("Failed to create ticket");
      }
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-white mb-4">Create New Ticket</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-400 block mb-1">Subject</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-gray-400 block mb-1">Message</label>
          <textarea
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows={4}
            placeholder="Describe your issue"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
