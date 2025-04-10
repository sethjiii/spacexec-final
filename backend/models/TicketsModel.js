const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    support_id: { 
        type: String, 
        required: true 
    }, // Unique support ticket ID

    complainer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // User raising the support ticket

    subject: {
        type: String,
        required: true
    },

    chats: [
        {
            type: String
        }
    ],

    status: { 
        type: String, 
        enum: ['open', 'in_progress', 'resolved'], 
        default: 'in_progress' 
    }

}, { 
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Ticket', ticketSchema);
