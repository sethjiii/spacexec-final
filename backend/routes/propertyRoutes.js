const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  addProperty,
  getPropertyById,
  getAllProperties,
  removeProperty,
  addPropertyByAdmin,
  buyShares,
  sellShares,
  toggleWishList,
  uploadImages,
  uploadPDFs,
  disableProperty,
  approveProperty,
  deleteProperty,
  verifySignature,
  createListing,
  getAllMarketPlace
} = require('../controllers/propertyController');

const { verifyNFTOwnership } = require('../controllers/userController');
const { auth, isAdmin, isVendor, isVendorOrAdmin } = require('../middlewares/verifyAuth');

const propertyRouter = express.Router();

// ========================
// Property Management Routes
// ========================

// ✅ Only vendors or admins can add properties
propertyRouter.post('/addproperty', auth, isVendorOrAdmin, addProperty);

// ✅ Toggle wishlist (any logged-in user)
propertyRouter.post('/togglewishlist/:propertyId', auth, toggleWishList);

// ✅ Buy / Sell shares (must be logged-in)
propertyRouter.post('/buyshares', auth, buyShares);
propertyRouter.post('/sellshares', auth, sellShares);

// ✅ Only admins can add property directly
propertyRouter.post('/addbyadmin', auth, isAdmin, addPropertyByAdmin);

// ========================
// Public routes (no login required)
// ========================
propertyRouter.get('/all', getAllProperties);

// ✅ Public marketplace browsing (must come BEFORE :propertyId)
propertyRouter.get('/marketplace', getAllMarketPlace);

// ✅ Fetch single property by ID (keep this after marketplace)
propertyRouter.get('/:propertyId', getPropertyById);

// ✅ Only vendors or admins can remove properties
propertyRouter.delete('/remove/:propertyId', auth, isVendorOrAdmin, removeProperty);

// ========================
// Upload Files
// ========================
propertyRouter.post('/uploadimages', auth, isVendorOrAdmin, upload.array('files'), uploadImages);
propertyRouter.post('/uploadpdfs', auth, isVendorOrAdmin, upload.array('documents'), uploadPDFs);

// ========================
// Admin-only Actions
// ========================
propertyRouter.put('/disable/:propertyId', auth, isAdmin, disableProperty);
propertyRouter.put('/approve/:propertyId', auth, isAdmin, approveProperty);
propertyRouter.delete('/delete/:propertyId', auth, isAdmin, deleteProperty);

// ========================
// Marketplace
// ========================
// NFT listing requires authentication
propertyRouter.post('/verifysignature', auth, verifySignature);
propertyRouter.post('/listnft', auth, createListing);

module.exports = propertyRouter;
