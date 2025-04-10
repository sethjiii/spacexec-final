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
        chats: [message]
      });
  
      await ticket.save();
  
      res.status(201).json({ message: "Complaint registered successfully", ticket });
    } catch (error) {
      console.error("Error registering complaint:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

module.exports = { addComplaint };
