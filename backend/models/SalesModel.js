const mongoose = require('mongoose');

const monthlyRecordSchema = new mongoose.Schema({
    totalIncome: {
        type: Number,
        required: true,
        min: 0
    },
    totalRevenue: {
        type: Number,
        required: true,
        min: 0
    },
    salesCount: {
        type: Number,
        default: 0,
        min: 0
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
}, { _id: false }); // Prevent automatic _id for each month

const salesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Admin or Vendor who made the sales

    role: {
        type: String,
        enum: ['admin', 'vendor'],
        required: true
    }, // Role of the user

    monthlyData: {
        type: Map,
        of: monthlyRecordSchema,
        default: {}
    } // Keys are "MM-YYYY", values are monthly records
}, {
    timestamps: true
});

module.exports = mongoose.model('Sales', salesSchema);
