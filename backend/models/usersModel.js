const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },

    email: { 
        type: String, 
        unique: true, 
        required: true,
        trim: true,
        lowercase: true
    },

    password: { 
        type: String, 
        required: function () { return !this.google_uid; } // Required only for non-Google users
    },

    google_uid: { 
        type: String, 
        unique: true, 
        sparse: true // Allows users without Google Sign-In
    },

    phone: {
        type: String,
        unique: true,
        sparse: true // Ensures it's optional
    },

    profile_pic: {
        type: String,
        default: "default.jpg"
    },

    company: {
        type: String,
        trim: true
    },

    role: { 
        type: String, 
        enum: ['user', 'admin', 'vendor', 'channel-partner'], 
        default: 'user' 
    },

    isActive: {
        type: Boolean,
        default: true
    },

    lastLogin: {
        type: Date,
        default: null
    },

    ownedTokens: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Token' 
    }],

    investedProperties: [{ 
        propertyId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Property' // Reference to the Property model
        }, 
        sharePercentage: { 
            type: Number, 
            min: 0, 
            max: 100 
        } 
    }],

    isVerified: { 
        type: Boolean, 
        default: function () { return !!this.google_uid; } // Auto-verify Google users
    },

    subscriptionPlan: {
        type: String,
        enum: ['free', 'premium', 'enterprise'],
        default: 'free'
    },

    preferences: {
        notifications: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: false }
    },

    notifications: [{ 
        message: String, 
        date: { type: Date, default: Date.now }, 
        read: { type: Boolean, default: false } 
    }],

    // New fields
    totalInvestments: {
        type: Number,
        default: 0
    },

    totalInvested: {
        type: Number,
        default: 0
    },

    totalReturns: {
        type: Number,
        default: 0
    },


    wishlist: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property' // Reference to the Property model
    }],
    

    transactions: [{
        transaction_id: { 
            type: String, 
            required: true // Make sure transaction_id is required
        },
        date: { 
            type: Date, 
            default: Date.now // Ensures the current date is set by default
        },
        amount: { 
            type: Number, 
            required: true // Make sure amount is required
        },
        type: { 
            type: String, 
            enum: ['investment', 'return'], // Only allows 'investment' or 'return'
            required: true 
        },
        propertyId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Property', // Reference to the Property model
            required: true // Ensures propertyId is required
        },
        nftToken: { // NFT Token Information
            tokenId: { 
                type: String, 
                required: true // Ensures tokenId is required
            },
            // Add any additional NFT-related fields here if needed, like contract address or metadata URI.
        }
    }],
    

    monthlyRecords: [{
        month: { 
            type: String, 
            required: true // e.g., '2025-04'
        },
        investedAmount: { 
            type: Number, 
            default: 0 
        },
        returns: { 
            type: Number, 
            default: 0 
        },
        portfolioValue: { 
            type: Number, 
            default: 0 
        }
    }]
}, { 
    timestamps: true // Automatically manages createdAt & updatedAt
});

module.exports = mongoose.model('User', userSchema);
