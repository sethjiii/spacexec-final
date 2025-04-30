const propertyModels = require("../models/propertyModels");
const usersModel = require("../models/usersModel");
const User = require("../models/usersModel");
const TicketModel = require("../models/TicketsModel");

const addComplaint = async (req, res) => {
    try {
      const { subject, message,userId} = req.body;
  
      // Generate a unique support ID (you can customize this logic)
      const supportId = `SUPPORT-${Date.now()}`;
  
      const ticket = new TicketModel({
        support_id: supportId,
        complainer: userId,
        subject,
        chats:  [`customer: ${message}`]
      });
  
      await ticket.save();
  
      res.status(201).json({ message: "Complaint registered successfully", ticket });
    } catch (error) {
      console.error("Error registering complaint:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  const addChatToTicket = async (req, res) => {
    try {
      const { ticketId, message} = req.body;
  
      // Find the existing ticket by support ID (or ticketId)
      const ticket = await TicketModel.findOne({ support_id: ticketId });
  
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
  
      // Append the new message to the chats array
      ticket.chats.push(`customer: ${message}`);
  
      // Save the updated ticket
      await ticket.save();
  
      res.status(200).json({ message: "Chat added successfully", ticket });
    } catch (error) {
      console.error("Error adding chat:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

  const findTicketBySupportId = async (req, res) => {
    try {
      const { supportId } = req.params;
  
      const ticket = await TicketModel.findOne({ support_id: supportId }).populate('complainer');
  
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      const chats=ticket.chats
  
      res.status(200).json({ chats });
    } catch (error) {
      console.error("Error finding ticket:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  const saveChatToTicket = async (req, res) => {
    try {
      const { ticketId, message, sender } = req.body;
  
      if (!ticketId || !message || !sender) {
        return res.status(400).json({ message: "Ticket ID, message, and sender are required" });
      }
  
      const ticket = await TicketModel.findById(ticketId);
  
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
  
      // Append sender info
      let formattedMessage;
      if (sender === "customer") {
        formattedMessage = `customer: ${message}`;
      } else if (sender === "support") {
        formattedMessage = `support: ${message}`;
      } else {
        return res.status(400).json({ message: "Invalid sender type" });
      }
  
      ticket.chats.push(formattedMessage);
      await ticket.save();
  
      res.status(200).json({ message: "Message added successfully", ticket });
    } catch (error) {
      console.error("Error saving chat message:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const getActiveSupportTickets = async (req, res) => {
    try {
      const { userId } = req.params; // Assuming you're sending userId in URL params
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      // Find all tickets where:
      // - complainer = userId
      // - status is not 'resolved'
      const tickets = await TicketModel.find({
        complainer: userId,
        status: { $ne: 'resolved' } // $ne = not equal
      }).sort({ updatedAt: -1 }); // Recent first
  
      res.status(200).json({ tickets });
    } catch (error) {
      console.error("Error fetching active support tickets:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

module.exports = { addComplaint,getActiveSupportTickets,findTicketBySupportId,saveChatToTicket,addChatToTicket};
