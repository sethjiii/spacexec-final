const express = require('express');
const {
    addProperty,
    getPropertyById,
    getAllProperties,
    removeProperty,
    addPropertyByAdmin,
    buyShares,
    sellShares
} = require('../controllers/propertyController');

const propertyRouter = express.Router();

// Property Management Routes
propertyRouter.post('/add', addProperty);  // Add a new property (Only if the user owns NFT)
propertyRouter.post('/buyShares', buyShares);  // Add a new property (Only if the user owns NFT)
propertyRouter.post('/sellshares', sellShares);  // Add a new property (Only if the user owns NFT)
propertyRouter.post('/addbyadmin', addPropertyByAdmin);  // Add a new property (Only if the user owns NFT)
propertyRouter.get('/all', getAllProperties);  // Get all properties (Updated to prevent conflicts)
propertyRouter.get('/:propertyId', getPropertyById);  // Get a single property by ID
propertyRouter.delete('/remove/:propertyId', removeProperty);  // Remove a property (Only if the user owns all shares)

// Export the propertyRouter
module.exports = propertyRouter;
