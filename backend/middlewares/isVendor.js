const Vendor = require('../models/vendorModel');
const User = require('../models/usersModel');

const isVendor = async (req, res, next) => {
    try {
        
        const userId = req.user?.userId || req.body.userId || req.params.userId;

        if (!userId) {
            return res.status(401).json({ message: "User ID required" });
        }

        // Check if user exists and has vendor role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== 'vendor') {
            return res.status(403).json({ message: "Access denied. Vendor role required" });
        }

        // Check if vendor profile exists and is active
        const vendor = await Vendor.findOne({ userId });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        if (vendor.status !== 'active') {
            return res.status(403).json({ 
                message: "Vendor account is not active", 
                status: vendor.status 
            });
        }

        if (!vendor.isVerified) {
            return res.status(403).json({ message: "Vendor account not verified" });
        }

        // Add vendor info to request
        req.vendor = vendor;
        req.user = user;
        next();

    } catch (error) {
        console.error("Error in isVendor middleware:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const isVendorOrAdmin = async (req, res, next) => {
    try {
        const userId = req.user?.userId || req.body.userId || req.params.userId;

        if (!userId) {
            return res.status(401).json({ message: "User ID required" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Allow admin access
        if (user.role === 'admin') {
            req.user = user;
            return next();
        }

        // Check vendor access
        if (user.role !== 'vendor') {
            return res.status(403).json({ message: "Access denied. Vendor or admin role required" });
        }

        // Check if vendor profile exists and is active
        const vendor = await Vendor.findOne({ userId });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        if (vendor.status !== 'active') {
            return res.status(403).json({ 
                message: "Vendor account is not active", 
                status: vendor.status 
            });
        }

        if (!vendor.isVerified) {
            return res.status(403).json({ message: "Vendor account not verified" });
        }

        // Add vendor info to request
        req.vendor = vendor;
        req.user = user;
        next();

    } catch (error) {
        console.error("Error in isVendorOrAdmin middleware:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { isVendor, isVendorOrAdmin };
