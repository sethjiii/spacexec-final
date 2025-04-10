const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },  
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },  // Added missing title field
    location: { 
        type: String, 
        required: true, 
        trim: true 
    },  
    description: { 
        type: String, 
        trim: true 
    },  
    type: { 
        type: String, 
        required: true,
        trim: true
    },  // Added missing type field
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },  // Added missing price field
    yield: { 
        type: Number, 
        required: true 
    },  // Added missing yield field
    totalShares: { 
        type: Number, 
        required: true, 
        min: 1 
    },  
    availableShares: { 
        type: Number, 
        required: true, 
        min: 0 
    },  
    pricePerShare: { 
        type: Number, 
        required: true, 
        min: 0 
    },  
    totalValue: { 
        type: Number, 
        required: true, 
        min: 0 
    },  
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
    }],  
    transactions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaction' 
    }],  
    images: [{ 
        type: String, 
        required: true 
    }],  
    documents: [{ 
        type: String, 
        required: false 
    }],  
    metadataURI: { 
        type: String, 
        required: false, 
        trim: true 
    },  
    status: { 
        type: String, 
        enum: ['active','under_review', 'inactive'], 
        default: 'under_review'
    },  
    bedrooms: { 
        type: Number, 
        required: true 
    },  
    bathrooms: { 
        type: Number, 
        required: true 
    },  
    area: { 
        type: Number, 
        required: true,
        min: 0 
    },  // Added missing area field
    amenities: [{ 
        type: String 
    }],  
    return: {
        rental: { type: Number, required: true },
        appreciation: { type: Number, required: true },
        total: { type: Number, required: true },
    },  
    financials: {
        propertyPrice: { type: Number, required: true },
        stampDuty: { type: Number, required: true },
        registrationFee: { type: Number, required: true },
        legalFee: { type: Number, required: true },
        totalInvestment: { type: Number, required: true },
        expectedRentalYield: { type: Number, required: true },
        expectedAppreciation: { type: Number, required: true },
        projectedReturn: { type: Number, required: true },
    },  
    fundingGoal: { 
        type: Number, 
        required: true 
    },  
    fundingRaised: { 
        type: Number, 
        required: true 
    },  
    vendorInfo: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },  
    legalInfo: { 
        type: String, 
        required: true 
    },  
    riskFactors: [{ 
        type: String 
    }],  
    offeringDetails: {
        minInvestment: { type: Number, required: true },
        maxInvestment: { type: Number, required: true },
        investmentTerm: { type: Number, required: true },
        exitOptions: [{ type: String }]
    },  
    createdAt: { 
        type: Date, 
        default: Date.now, 
        immutable: true 
    },  
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }  // Added updatedAt field for tracking changes
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Property', propertySchema);
