const express = require('express');
const {
    mintToken,
    transferToken,
    burnToken,
    getTokenById,
    getTokensByUser,
    getTokensByProperty,
    getAllTokens
} = require('../controllers/nftController');

const nftRouter = express.Router();

// NFT Token Routes
nftRouter.post('/mint', mintToken);  // Mint a new NFT token
nftRouter.post('/transfer', transferToken);  // Transfer NFT token ownership
nftRouter.delete('/burn', burnToken);  // Burn (destroy) an NFT token
nftRouter.get('/:tokenId', getTokenById);  // Get details of a specific NFT token
nftRouter.get('/user/:userId', getTokensByUser);  // Get all NFT tokens owned by a user
nftRouter.get('/property/:propertyId', getTokensByProperty);  // Get all NFT tokens linked to a property
nftRouter.get('/all', getAllTokens);  // Get all NFT tokens in the system

module.exports = nftRouter;
