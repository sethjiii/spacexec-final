const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },  

    location: { 
        type: String, 
        required: true, 
        trim: true 
    },  

    description: { 
        type: String, 
        trim: true 
    },  // Detailed property description  

    totalShares: { 
        type: Number, 
        required: true, 
        min: 1 
    },  // Total available ownership shares  

    availableShares: { 
        type: Number, 
        required: true, 
        min: 0 
    }, // Shares still available for sale  

    pricePerShare: { 
        type: Number, 
        required: true, 
        min: 0 
    }, // Price per ownership share  

    totalValue: { 
        type: Number, 
        required: true, 
        min: 0 
    }, // Total estimated value of the property  

    owners: [{ 
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }, 
        sharePercentage: { 
            type: Number, 
            min: 0, 
            max: 100 
        } 
    }], // Users holding shares of the property  

    transactions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaction' 
    }], // List of all transactions associated with this property  

    images: [{ 
        type: String, 
        required: true 
    }], // Array of image URLs (stored in AWS S3, Firebase, IPFS, etc.)  

    documents: [{ 
        type: String, 
        required: false 
    }], // Array of document URLs (title deeds, agreements, etc.)  

    metadataURI: { 
        type: String, 
        required: false, 
        trim: true 
    }, // Link to additional metadata storage  

    status: { 
        type: String, 
        enum: ['active', 'sold', 'under_review', 'inactive'], 
        default: 'active' 
    }, // Property status  

    createdAt: { 
        type: Date, 
        default: Date.now, 
        immutable: true 
    }  
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Property', propertySchema);
