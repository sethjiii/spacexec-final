const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // Business Information
    businessName: {
        type: String,
        required: true,
        trim: true
    },

    businessType: {
        type: String,
        enum: ['individual', 'company', 'partnership', 'llc', 'corporation'],
        required: true
    },

    businessLicense: {
        type: String,
        required: true,
        unique: true
    },

    taxId: {
        type: String,
        required: true,
        unique: true
    },

    // Contact Information
    businessAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: 'USA' }
    },

    businessPhone: {
        type: String,
        required: true
    },

    businessEmail: {
        type: String,
        required: true,
        unique: true
    },

    website: {
        type: String,
        trim: true
    },

    // Business Details
    yearsInBusiness: {
        type: Number,
        required: true,
        min: 0
    },

    specialties: [{
        type: String,
        enum: ['residential', 'commercial', 'industrial', 'land', 'luxury', 'investment', 'development']
    }],

    serviceAreas: [{
        city: String,
        state: String,
        zipCode: String
    }],

    // Financial Information
    annualRevenue: {
        type: Number,
        min: 0
    },

    creditScore: {
        type: Number,
        min: 300,
        max: 850
    },

    // Documents
    documents: [{
        type: {
            type: String,
            enum: ['license', 'insurance', 'certification', 'contract', 'other']
        },
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false }
    }],

    // Verification & Status
    isVerified: {
        type: Boolean,
        default: false
    },

    verificationDate: {
        type: Date
    },

    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    status: {
        type: String,
        enum: ['pending', 'active', 'suspended', 'rejected'],
        default: 'pending'
    },

    // Performance Metrics
    totalPropertiesListed: {
        type: Number,
        default: 0
    },

    totalPropertiesSold: {
        type: Number,
        default: 0
    },

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    totalReviews: {
        type: Number,
        default: 0
    },

    // Commission & Fees
    commissionRate: {
        type: Number,
        default: 5.0, // Default 5%
        min: 0,
        max: 100
    },

    // Bank Information for payments
    bankInfo: {
        accountHolder: String,
        accountNumber: String,
        routingNumber: String,
        bankName: String
    },

    // Notes & Comments
    adminNotes: [{
        note: String,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedAt: { type: Date, default: Date.now }
    }],

    // Timestamps
    applicationDate: {
        type: Date,
        default: Date.now
    },

    approvedDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for better query performance
vendorSchema.index({ userId: 1 });
vendorSchema.index({ businessLicense: 1 });
vendorSchema.index({ taxId: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ isVerified: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
