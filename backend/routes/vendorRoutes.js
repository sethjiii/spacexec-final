const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");

// Vendor application routes
router.post("/apply", vendorController.applyForVendor);
router.get("/:vendorId", vendorController.getVendorProfile);
router.get("/user/:userId", vendorController.getVendorByUserId);
router.put("/:vendorId", vendorController.updateVendorProfile);
router.post("/:vendorId/documents", vendorController.uploadVendorDocuments);

// Admin routes
router.get("/admin/applications", vendorController.getAllVendorApplications);
router.put("/admin/approve/:vendorId", vendorController.approveVendor);
router.put("/admin/reject/:vendorId", vendorController.rejectVendor);
router.put("/admin/suspend/:vendorId", vendorController.suspendVendor);
router.put("/admin/reactivate/:vendorId", vendorController.reactivateVendor);
router.post("/admin/note/:vendorId", vendorController.addVendorNote);
router.get("/admin/stats", vendorController.getVendorStats);
router.get("/admin/search", vendorController.searchVendors);

module.exports = router;
