"use client";

import { useState } from "react";
import ChatBox from "./ChatContainer";
import NewTicketForm from "./Addcomplaints"; // <-- Import this
import { FaHeadphones } from "react-icons/fa";

interface Ticket {
  _id: string;
  support_id: string;
  subject: string;
}

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [creatingTicket, setCreatingTicket] = useState(false);

  const toggleChat = async () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      setLoading(true);
      try {
        const userId = localStorage.getItem("_id");
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : "http://localhost:5000";

        const res = await fetch(
          `${baseUrl}/api/users/activetickets/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        setTickets(data.tickets || []);
      } catch (error) {
        console.error("Error fetching active tickets:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setCreatingTicket(false);
  };

  const handleCreateNewTicket = () => {
    setCreatingTicket(true);
    setSelectedTicketId(null);
  };

  const handleBack = () => {
    setCreatingTicket(false);
    setSelectedTicketId(null);
  };

  return (
    <>
      {/* Chat Icon */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
      >
        <FaHeadphones size={28} />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
          <div className="m-4 w-full max-w-md">
            <div className="bg-gray-900 rounded-xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={toggleChat}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>

              {selectedTicketId ? (
                <ChatBox ticketId={selectedTicketId} />
              ) : creatingTicket ? (
                <NewTicketForm onBack={handleBack} />
              ) : (
                <div className="p-4 space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Support Center
                  </h2>

                  {loading ? (
                    <p className="text-gray-400">Loading tickets...</p>
                  ) : tickets.length > 0 ? (
                    <div className="space-y-2">
                      {tickets.map((ticket) => (
                        <div
                          key={ticket._id}
                          className="p-3 bg-gray-800 rounded-lg text-white hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleSelectTicket(ticket.support_id)}
                        >
                          <div className="text-sm text-gray-400">
                            {ticket.support_id}
                          </div>
                          <div className="font-bold">{ticket.subject}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">
                      No active support tickets found.
                    </p>
                  )}

                  {/* Raise New Ticket Button */}
                  <button
                    onClick={handleCreateNewTicket}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold mt-4"
                  >
                    + Raise New Ticket
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
