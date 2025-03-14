const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: { 
        type: String, 
        unique: true, 
        required: true 
    }, // Unique transaction reference  

    tokenId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Token', 
        required: true 
    }, // Reference to the tokenized asset  

    buyer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // User who bought the token  

    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null  // ✅ Can be `null` for primary purchases
    }, // User who sold the token  

    propertyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property', 
        required: true 
    }, // Property associated with the transaction  

    amount: { 
        type: Number, 
        required: true, 
        min: 0 
    }, // Transaction value  

    currency: { 
        type: String, 
        enum: ['USD', 'INR', 'EUR', 'GBP', 'BTC', 'ETH'], 
        default: 'USD' 
    }, // ✅ Added currency support  

    sharePercentage: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100 
    }, // Fraction of ownership transferred  

    type: { 
        type: String, 
        enum: ['buy', 'sell', 'transfer'], 
        required: true 
    }, // Type of transaction  

    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
    }, // Transaction state  

    paymentDetails: { 
        method: { 
            type: String, 
            enum: ['bank_transfer', 'credit_card', 'UPI', 'crypto'], 
            required: true 
        }, 
        referenceId: { 
            type: String, 
            unique: true, 
            sparse: true // ✅ Prevents errors if missing
        } 
    }, // Payment method & reference  

    timestamp: { 
        type: Date, 
        default: Date.now, 
        immutable: true 
    } // Transaction time  
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Transaction', transactionSchema);
