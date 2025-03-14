const mongoose = require('mongoose');

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
        required: true
    },  // Hashed password  

    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }, // Default role is 'user'  

    // Properties and Ownership  
    ownedTokens: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Token' 
    }], // List of owned tokenized property shares  

    investedProperties: [{ 
        propertyId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Property' 
        }, 
        sharePercentage: { 
            type: Number, 
            min: 0, 
            max: 100 
        } 
    }], // User's share percentage in different properties  

    // Verification & Security  
    isVerified: { 
        type: Boolean, 
        default: false 
    }, // Email or identity verification status  

    // Notifications & Preferences  
    notifications: [{ 
        message: String, 
        date: { 
            type: Date, 
            default: Date.now 
        }, 
        read: { 
            type: Boolean, 
            default: false 
        } 
    }], // Alerts about transactions, property updates, etc.  

    createdAt: { 
        type: Date, 
        default: Date.now, 
        immutable: true 
    }  
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
