const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");

const { auth, isAdmin, isVendor, isVendorOrAdmin } = require("../middlewares/verifyAuth");

// ========================
// Vendor application routes
// ========================

// ✅ Any authenticated user can apply to become a vendor
router.post("/apply", auth, vendorController.applyForVendor);

// ✅ Get vendor profile (public? or require auth — here we require auth for safety)
router.get("/:vendorId", auth, vendorController.getVendorProfile);

// ✅ Get vendor by userId (admins or the vendor themselves)
router.get("/user/:userId", auth, isVendorOrAdmin, vendorController.getVendorByUserId);

// ✅ Vendors can update their own profile
router.put("/:vendorId", auth, isVendor, vendorController.updateVendorProfile);

// ✅ Vendors can upload their own documents
router.post("/:vendorId/documents", auth, isVendor, vendorController.uploadVendorDocuments);

// ========================
// Admin-only routes
// ========================

// ✅ Admins can review all vendor applications
router.get("/admin/applications", auth, isAdmin, vendorController.getAllVendorApplications);

// ✅ Admins approve / reject / suspend / reactivate vendors
router.put("/admin/approve/:vendorId", auth, isAdmin, vendorController.approveVendor);
router.put("/admin/reject/:vendorId", auth, isAdmin, vendorController.rejectVendor);
router.put("/admin/suspend/:vendorId", auth, isAdmin, vendorController.suspendVendor);
router.put("/admin/reactivate/:vendorId", auth, isAdmin, vendorController.reactivateVendor);

// ✅ Admins can add internal notes to vendor profiles
router.post("/admin/note/:vendorId", auth, isAdmin, vendorController.addVendorNote);

// ✅ Admins can see vendor stats & search vendors
router.get("/admin/stats", auth, isAdmin, vendorController.getVendorStats);
router.get("/admin/search", auth, isAdmin, vendorController.searchVendors);

module.exports = router;
