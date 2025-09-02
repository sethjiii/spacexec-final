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

const { auth, isAdmin, isVendor, isVendorOrAdmin } = require('../middlewares/verifyAuth');

const nftRouter = express.Router();

// ========================
// NFT Token Routes
// ========================

// ✅ Only admins or vendors can mint
nftRouter.post('/mint', auth, isVendorOrAdmin, mintToken);

// ✅ Only admins or vendors can transfer
nftRouter.post('/transfer', auth, isVendorOrAdmin, transferToken);

// ✅ Only admins can burn
nftRouter.delete('/burn', auth, isAdmin, burnToken);

// ✅ Authenticated users can view token details
nftRouter.get('/:tokenId', auth, getTokenById);

// ✅ Users can view their own tokens, or admins can view anyone’s
nftRouter.get('/user/:userId', auth, async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Check if logged-in user is the owner OR admin
        if (req.user._id.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        return getTokensByUser(req, res, next);
    } catch (err) {
        console.error("Error in /nft/user route:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Authenticated users can view tokens for a property
nftRouter.get('/property/:propertyId', auth, getTokensByProperty);

// ✅ Only admins can fetch all tokens
nftRouter.get('/all', auth, isAdmin, getAllTokens);

module.exports = nftRouter;
