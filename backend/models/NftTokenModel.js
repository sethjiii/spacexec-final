const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenId: { 
        type: String, 
        unique: true, 
        required: true, 
        index: true, 
        trim: true 
    },  // Unique Token ID  

    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },  // Current owner of the token  

    property: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property', 
        required: true 
    },  // Property associated with this token  

    sharesOwned: { 
        type: Number, 
        required: true, 
        min: 1 
    },  // Number of ownership shares this token represents  

    purchasePrice: { 
        type: Number, 
        required: true, 
        min: 0 
    },  // total Price paid for the tokenized shares  
    
    previousOwners: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        transferredAt: { type: Date, default: Date.now } 
    }], // History of previous owners  

    transactionHistory: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaction' 
    }], // List of transactions related to this token  

    status: { 
        type: String, 
        enum: ['active', 'transferred', 'revoked'], 
        default: 'active' 
    },  // Status of the token  

    issuedAt: { 
        type: Date, 
        default: Date.now, 
        immutable: true 
    },  // Timestamp when the token was issued  

    // signature: { 
    //     type: String, 
    //     required: true, 
    //     unique: true, 
    //     trim: true 
    // }  // Cryptographic hash ensuring authenticity  
}, { 
    timestamps: true 
});

tokenSchema.virtual('calculatedReturn').get(function () {
    const returnPercentage = 10; // You can change this value based on your business logic
    return (this.purchasePrice * returnPercentage) / 100;
  });

module.exports = mongoose.model('Token', tokenSchema);
