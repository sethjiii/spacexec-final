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
const verifyTokenSignature = require('../utils/verifyTokenSignature');

const { auth, isAdmin, isVendor, isVendorOrAdmin } = require('../middlewares/verifyAuth');

const propertyRouter = express.Router();

// ========================
// Property Management Routes
// ========================

// ✅ Only vendors or admins can add properties
propertyRouter.post('/addproperty', auth, isVendorOrAdmin, addProperty);

// ✅ Toggle wishlist (any logged-in user)
propertyRouter.post('/togglewishlist/:propertyId', auth, toggleWishList);

// ✅ Buy / Sell shares (must own NFT, so require auth)
propertyRouter.post('/buyshares', auth, buyShares);
propertyRouter.post('/sellshares', auth, sellShares);

// ✅ Only admins can add property directly
propertyRouter.post('/addbyadmin', auth, isAdmin, addPropertyByAdmin);

// ✅ Anyone logged-in can view properties
propertyRouter.get('/all', auth, getAllProperties);
propertyRouter.get('/:propertyId', auth, getPropertyById);

// ✅ Only vendors or admins can remove (burns down to full ownership logic inside controller)
propertyRouter.delete('/remove/:propertyId', auth, isVendorOrAdmin, removeProperty);

// ========================
// Upload Files
// ========================
// ✅ Only vendors or admins can upload property assets
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
// ✅ NFT listing requires authentication
propertyRouter.post('/verifysignature', auth, verifySignature);
propertyRouter.post('/listnft', auth, createListing);
// ✅ Marketplace viewing can be open (or keep it auth if sensitive)
propertyRouter.post('/getmarketplace', auth, getAllMarketPlace);

module.exports = propertyRouter;
