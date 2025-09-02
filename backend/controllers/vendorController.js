const Vendor = require("../models/vendorModel");
const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { sendVendorApprovalEmail, sendVendorRejectionEmail, sendVendorWelcomeEmail } = require("../middlewares/emailServiceVendor");

// Apply to become a vendor
const applyForVendor = async (req, res) => {
    try {
        console.log("🔍 Vendor application request body:", JSON.stringify(req.body, null, 2));
        
        const {
            userId,
            businessName,
            businessType,
            businessLicense,
            taxId,
            businessAddress,
            businessPhone,
            businessEmail,
            website,
            yearsInBusiness,
            specialties,
            serviceAreas,
            annualRevenue,
            creditScore,
            bankInfo
        } = req.body;

        // Validate required fields
        if (!userId || !businessName || !businessType || !businessLicense || !taxId || !businessAddress || !businessPhone || !businessEmail) {
            console.log("❌ Missing required fields:", { userId, businessName, businessType, businessLicense, taxId, businessAddress, businessPhone, businessEmail });
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is already a vendor
        const existingVendor = await Vendor.findOne({ userId });
        if (existingVendor) {
            return res.status(400).json({ message: "User is already a vendor or has a pending application" });
        }

        // Check if business license or tax ID already exists
        const existingLicense = await Vendor.findOne({ businessLicense });
        if (existingLicense) {
            return res.status(400).json({ message: "Business license already registered" });
        }

        const existingTaxId = await Vendor.findOne({ taxId });
        if (existingTaxId) {
            return res.status(400).json({ message: "Tax ID already registered" });
        }

        // Create new vendor application
        // Ensure data types are correct
        const vendorData = {
            userId,
            businessName,
            businessType,
            businessLicense,
            taxId,
            businessAddress,
            businessPhone,
            businessEmail,
            website: website || "",
            yearsInBusiness: parseInt(yearsInBusiness) || 0,
            specialties: specialties || [],
            serviceAreas: serviceAreas || [],
            annualRevenue: parseInt(annualRevenue) || 0,
            creditScore: parseInt(creditScore) || 750,
            bankInfo: bankInfo || {}
        };
        
        console.log("📝 Creating vendor with data:", vendorData);
        
        const vendor = new Vendor({
            ...vendorData,
            status: 'pending'
        });

        console.log("💾 Saving vendor to database...");
        await vendor.save();
        console.log("✅ Vendor saved successfully:", vendor._id);

        res.status(201).json({
            message: "Vendor application submitted successfully",
            vendor: vendor
        });

    } catch (error) {
        console.error("❌ Error applying for vendor:", error);
        console.error("❌ Error stack:", error.stack);
        console.error("❌ Error details:", {
            name: error.name,
            message: error.message,
            code: error.code
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get vendor profile
const getVendorProfile = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const vendor = await Vendor.findById(vendorId)
            .populate('userId', 'name email profile_pic phone')
            .populate('verifiedBy', 'name');

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.status(200).json(vendor);

    } catch (error) {
        console.error("Error fetching vendor profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get vendor by user ID
const getVendorByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const vendor = await Vendor.findOne({ userId })
            .populate('userId', 'name email profile_pic phone')
            .populate('verifiedBy', 'name');

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.status(200).json(vendor);

    } catch (error) {
        console.error("Error fetching vendor by user ID:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update vendor profile
const updateVendorProfile = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData.status;
        delete updateData.isVerified;
        delete updateData.verificationDate;
        delete updateData.verifiedBy;
        delete updateData.applicationDate;
        delete updateData.approvedDate;

        const vendor = await Vendor.findByIdAndUpdate(
            vendorId,
            updateData,
            { new: true, runValidators: true }
        ).populate('userId', 'name email profile_pic phone');

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.status(200).json({
            message: "Vendor profile updated successfully",
            vendor: vendor
        });

    } catch (error) {
        console.error("Error updating vendor profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Upload vendor documents
const uploadVendorDocuments = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { documents } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Add new documents to existing ones
        vendor.documents = [...vendor.documents, ...documents];
        await vendor.save();

        res.status(200).json({
            message: "Documents uploaded successfully",
            vendor: vendor
        });

    } catch (error) {
        console.error("Error uploading vendor documents:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Get all vendor applications
const getAllVendorApplications = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        const query = {};
        if (status) {
            query.status = status;
        }

        const vendors = await Vendor.find(query)
            .populate('userId', 'name email profile_pic phone')
            .populate('verifiedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Vendor.countDocuments(query);

        res.status(200).json({
            vendors,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error("Error fetching vendor applications:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Approve vendor application
const approveVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { adminId, notes } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.status !== 'pending') {
            return res.status(400).json({ message: "Vendor application is not pending" });
        }

        // Update vendor status
        vendor.status = 'active';
        vendor.isVerified = true;
        vendor.verificationDate = new Date();
        vendor.verifiedBy = adminId;
        vendor.approvedDate = new Date();

        // Add admin note if provided
        if (notes) {
            vendor.adminNotes.push({
                note: notes,
                addedBy: adminId
            });
        }

        await vendor.save();

        // Update user role to vendor
        await User.findByIdAndUpdate(vendor.userId, { role: 'vendor' });

        // Send approval email
        const user = await User.findById(vendor.userId);
        if (user) {
            await sendVendorApprovalEmail(user.name, user.email, vendor.businessName);
        }

        res.status(200).json({
            message: "Vendor approved successfully",
            vendor: vendor
        });

    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Reject vendor application
const rejectVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { adminId, reason, notes } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.status !== 'pending') {
            return res.status(400).json({ message: "Vendor application is not pending" });
        }

        // Update vendor status
        vendor.status = 'rejected';

        // Add admin notes
        vendor.adminNotes.push({
            note: `Rejected: ${reason}. ${notes || ''}`,
            addedBy: adminId
        });

        await vendor.save();

        // Send rejection email
        const user = await User.findById(vendor.userId);
        if (user) {
            await sendVendorRejectionEmail(user.name, user.email, vendor.businessName, reason);
        }

        res.status(200).json({
            message: "Vendor application rejected",
            vendor: vendor
        });

    } catch (error) {
        console.error("Error rejecting vendor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Suspend vendor
const suspendVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { adminId, reason, notes } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = 'suspended';

        // Add admin notes
        vendor.adminNotes.push({
            note: `Suspended: ${reason}. ${notes || ''}`,
            addedBy: adminId
        });

        await vendor.save();

        res.status(200).json({
            message: "Vendor suspended successfully",
            vendor: vendor
        });

    } catch (error) {
        console.error("Error suspending vendor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Reactivate vendor
const reactivateVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { adminId, notes } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = 'active';

        // Add admin notes
        if (notes) {
            vendor.adminNotes.push({
                note: `Reactivated: ${notes}`,
                addedBy: adminId
            });
        }

        await vendor.save();

        res.status(200).json({
            message: "Vendor reactivated successfully",
            vendor: vendor
        });

    } catch (error) {
        console.error("Error reactivating vendor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Add note to vendor
const addVendorNote = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { adminId, note } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.adminNotes.push({
            note,
            addedBy: adminId
        });

        await vendor.save();

        res.status(200).json({
            message: "Note added successfully",
            vendor: vendor
        });

    } catch (error) {
        console.error("Error adding vendor note:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get vendor statistics
const getVendorStats = async (req, res) => {
    try {
        const stats = await Vendor.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalVendors = await Vendor.countDocuments();
        const activeVendors = await Vendor.countDocuments({ status: 'active' });
        const pendingVendors = await Vendor.countDocuments({ status: 'pending' });

        res.status(200).json({
            totalVendors,
            activeVendors,
            pendingVendors,
            statusBreakdown: stats
        });

    } catch (error) {
        console.error("Error fetching vendor stats:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Search vendors
const searchVendors = async (req, res) => {
    try {
        const { query, status, businessType, page = 1, limit = 10 } = req.query;

        const searchQuery = {};

        if (query) {
            searchQuery.$or = [
                { businessName: { $regex: query, $options: 'i' } },
                { 'businessAddress.city': { $regex: query, $options: 'i' } },
                { 'businessAddress.state': { $regex: query, $options: 'i' } }
            ];
        }

        if (status) {
            searchQuery.status = status;
        }

        if (businessType) {
            searchQuery.businessType = businessType;
        }

        const vendors = await Vendor.find(searchQuery)
            .populate('userId', 'name email profile_pic phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Vendor.countDocuments(searchQuery);

        res.status(200).json({
            vendors,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error("Error searching vendors:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    applyForVendor,
    getVendorProfile,
    getVendorByUserId,
    updateVendorProfile,
    uploadVendorDocuments,
    getAllVendorApplications,
    approveVendor,
    rejectVendor,
    suspendVendor,
    reactivateVendor,
    addVendorNote,
    getVendorStats,
    searchVendors
};
