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
    verifySignature
} = require('../controllers/propertyController');
const { isAdmin } = require('../middlewares/isAdmin');
const { verifyNFTOwnership } = require('../controllers/userController');
const verifyTokenSignature = require('../utils/verifyTokenSignature');

const propertyRouter = express.Router();
// Property Management Routes
propertyRouter.post('/addproperty',addProperty);  // Add a new property (Only if the user owns NFT)
propertyRouter.post('/togglewishlist/:propertyId', toggleWishList);  // Add a new property (Only if the user owns NFT)
propertyRouter.post('/buyShares', buyShares);  // Add a new property (Only if the user owns NFT)
propertyRouter.post('/sellshares', sellShares);  // Add a new property (Only if the user owns NFT)
propertyRouter.post('/addbyadmin', addPropertyByAdmin);  // Add a new property (Only if the user owns NFT)
propertyRouter.get('/all', getAllProperties);  // Get all properties (Updated to prevent conflicts)
propertyRouter.get('/:propertyId', getPropertyById);  // Get a single property by ID
propertyRouter.delete('/remove/:propertyId', removeProperty);  // Remove a property (Only if the user owns all shares)


// upload images
propertyRouter.post('/uploadimages',upload.array('files'),uploadImages)
propertyRouter.post('/uploadpdfs',upload.array('documents'),uploadPDFs)

propertyRouter.put("/disable/:propertyId", isAdmin, disableProperty);

// Approve Property Route
propertyRouter.put("/approve/:propertyId", isAdmin, approveProperty);

// Delete Property Route
propertyRouter.delete("/delete/:propertyId", isAdmin, deleteProperty);


// marketplace urls
propertyRouter.post("/verifysignature",verifySignature)

module.exports = propertyRouter;
