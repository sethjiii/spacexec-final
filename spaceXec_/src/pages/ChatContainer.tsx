"use client";

import { useEffect, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaHandsHelping,
  FaHeadphones,
  FaHeadSideCough,
  FaMale,
  FaRobot,
  FaTelegram,
} from "react-icons/fa";
import { Bot } from "lucide-react";
import { Users } from "lucide-react";
import { LifeBuoy } from "lucide-react";

import { ShieldCheck } from "lucide-react";

interface ChatBoxProps {
  ticketId: string;
}

export default function ChatBox({ ticketId }: ChatBoxProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [role, setRole] = useState("");


  const baseUrl =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchTicketChats = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/users/getchat/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data.chats);
        setMessages(data.chats || []);
      } else {
        console.error("Failed to load ticket chats.");
      }
    } catch (error) {
      console.error("Error loading ticket chats:", error);
    }
  };

  const handleSend = async () => {
    if (newMessage.trim() === "") {
      toast.error("Please enter a message.");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/users/addchat`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticketId, message: newMessage, role }), // Prefix customer:
      });

      if (res.ok) {

        setMessages((prev) => [...prev, `${role}: ${newMessage}`]);
        setNewMessage("");
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchTicketChats();
    const p = localStorage.getItem("profile_pic");
    const r = localStorage.getItem("role");
    setRole(r || "");
    setProfileImage(p);
  }, []);

  return (
    <div className="relative flex flex-col h-3/5 w-3/4 max-w-md mx-auto shadow-2xl rounded-sm bg-gray-800 text-white">
      {/* Chat Header */}
      <div className="bg-blue-500 text-white text-center py-3 font-mono font-extrabold">
        SpaceXec Support Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isCustomer = msg.startsWith("admin:");
            console.log(msg)
            const message = msg.split(":").slice(1).join(":").trim();

            return (
              <div
                key={index}
                className={`flex ${isCustomer ? "justify-end" : "justify-start"
                  }`}
              >
                {/* Profile Avatar Section */}
                <div
                  key={index}
                  className={`flex ${!isCustomer ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`flex items-center gap-2 ${isCustomer ? "flex-row-reverse" : "flex-row"
                      }`}
                  >
                    {/* Profile Avatar */}
                    {!isCustomer ? (
                      <img
                        src={profileImage} // Customer profile picture
                        alt="Customer"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <FaRobot className="w-8 h-8 rounded-full text-gray-400" /> // Bot Icon
                    )}

                    {/* Message Section */}
                    <div
                      className={`max-w-xs p-3 rounded-lg ${!isCustomer
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-white"
                        }`}
                    >
                      {message}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400">
            No messages yet. Start chatting!
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-600 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 p-2 rounded-full hover:bg-blue-700"
        >
          <SendHorizonal size={20} />
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}
