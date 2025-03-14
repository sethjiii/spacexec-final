const Property = require("../models/propertyModels");
const Token = require("../models/NftTokenModel");
const User = require("../models/usersModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateNftToken");
const verifyTokenSignature = require("../utils/verifyTokenSignature");


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Utility function to verify NFT ownership
const verifyNFTOwnership = async (userId, propertyId) => {
  const token = await Token.findOne({ owner: userId, property: propertyId });
  return !!token;
};

const buyShares = async (req, res) => {
    try {
        const { userId, propertyId, sharesToBuy } = req.body;

        // Validate input
        if (!isValidObjectId(userId) || !isValidObjectId(propertyId)) {
            return res.status(400).json({ error: "Invalid user or property ID" });
        }
        if (sharesToBuy <= 0) {
            return res.status(400).json({ error: "Shares to buy must be greater than 0" });
        }

        // Verify property existence
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        if (property.availableShares < sharesToBuy) {
            return res.status(400).json({ error: "Not enough shares available for purchase" });
        }

        // Deduct shares from availableShares
        property.availableShares -= sharesToBuy;
        await property.save();

        // Check if user already owns shares in this property
        let existingToken = await Token.findOne({ owner: userId, property: propertyId });

        if (existingToken) {
            // Update existing token (DO NOT generate a new one)
            existingToken.sharesOwned += sharesToBuy;
            await existingToken.save();

            // Generate a new signature using the same token ID
            const { signature } = generateToken(existingToken.tokenId,userId, propertyId);

            return res.status(200).json({
                message: "Shares added to existing token successfully!",
                tokenId: existingToken.tokenId,
                issuedAt: existingToken.issuedAt,
                signature, // Send updated signature
            });
        } else {
            // Generate token metadata for new ownership
            const issuedAt = Date.now();
            const { tokenId, signature } = generateToken(null, userId, propertyId);

            // Mint a new NFT token
            const newToken = await Token.create({
                tokenId,
                owner: userId,
                property: propertyId,
                sharesOwned: sharesToBuy,
                issuedAt,
            });

            return res.status(201).json({
                message: "Shares purchased successfully!",
                tokenId: newToken.tokenId,
                issuedAt: newToken.issuedAt,
                signature, // Send signature for verification
            });
        }
    } catch (error) {
        console.error("Buy Shares Error:", error);
        res.status(500).json({ error: "Failed to buy shares" });
    }
};

const sellShares = async (req, res) => {
    try {
        const { sellerId, propertyId, sharesToSell, buyerId, signature } = req.body;

        // Validate input
        if (!isValidObjectId(sellerId) || !isValidObjectId(propertyId)) {
            return res.status(400).json({ error: "Invalid seller or property ID" });
        }
        if (sharesToSell <= 0) {
            return res.status(400).json({ error: "Shares to sell must be greater than 0" });
        }

        // Fetch property details
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ error: "Property not found" });

        // Calculate purchase price dynamically
        const purchasePrice = sharesToSell * property.pricePerShare;

        // Fetch seller's token
        const sellerToken = await Token.findOne({ owner: sellerId, property: propertyId });
        if (!sellerToken || sellerToken.sharesOwned < sharesToSell) {
            return res.status(400).json({ error: "Seller does not have enough shares to sell" });
        }

        // Validate seller's signature
        const isValidSignature = verifyTokenSignature({
            tokenId: sellerToken.tokenId,
            userId: sellerId,
            propertyId,
            issuedAt: sellerToken.issuedAt,
            signature
        });

        if (!isValidSignature) {
            return res.status(403).json({ error: "Invalid token signature" });
        }

        let newSignature = null;

        if (buyerId) {
            // Buyer case
            if (!isValidObjectId(buyerId)) {
                return res.status(400).json({ error: "Invalid buyer ID" });
            }

            let buyerToken = await Token.findOne({ owner: buyerId, property: propertyId });

            if (buyerToken) {
                // Buyer already owns shares, update existing token
                buyerToken.sharesOwned += sharesToSell;
                buyerToken.purchasePrice += purchasePrice; // Update total purchase price
                await buyerToken.save();

                // Generate a new signature for buyer's updated token
                newSignature = generateToken(buyerToken.tokenId, buyerId, propertyId).signature;
            } else {
                // Generate a new token for the buyer
                const issuedAt = Date.now();
                const newTokenData = generateToken(null, buyerId, propertyId);
                newSignature = newTokenData.signature;

                await Token.create({
                    tokenId: newTokenData.tokenId,
                    owner: buyerId,
                    property: propertyId,
                    sharesOwned: sharesToSell,
                    purchasePrice,
                    issuedAt
                });
            }
        } else {
            // Selling back to property
            property.availableShares += sharesToSell;
            await property.save();
        }

        // Reduce seller's shares
        sellerToken.sharesOwned -= sharesToSell;

        if (sellerToken.sharesOwned === 0) {
            await Token.deleteOne({ _id: sellerToken._id });
        } else {
            await sellerToken.save();
        }

        res.status(200).json({ 
            message: "Shares sold successfully!", 
            purchasePrice,  // Send calculated price in response
            newSignature  // Only for buyer verification (not stored)
        });
    } catch (error) {
        console.error("Sell Shares Error:", error);
        res.status(500).json({ error: "Failed to sell shares" });
    }
};



// Add a new property (Only if the user owns NFT)
const addProperty = async (req, res) => {
  try {
    const {
      userId,
      name,
      location,
      description,
      totalShares,
      pricePerShare,
      totalValue,
      images,
      documents,
    } = req.body;

    // Verify if user owns an NFT for the property
    const ownsNFT = await verifyNFTOwnership(userId, propertyId);
    if (!ownsNFT) {
      return res.status(403).json({
        message: "Unauthorized: You must own an NFT to list this property.",
      });
    }

    const newProperty = new Property({
      name,
      location,
      description,
      totalShares,
      availableShares: totalShares,
      pricePerShare,
      totalValue,
      images,
      documents,
      owners: [{ userId, sharePercentage: 100 }], // Initially full ownership
    });

    await newProperty.save();
    res
      .status(201)
      .json({ message: "Property added successfully!", property: newProperty });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const addPropertyByAdmin = async (req, res) => {
  try {
    // Extract JWT token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.userId; // Extracted user ID from token

    // Check if the user is an admin
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can add properties" });
    }

    const {
      name,
      location,
      description,
      totalShares,
      pricePerShare,
      totalValue,
      images,
      documents,
    } = req.body;

    const newProperty = new Property({
      name,
      location,
      description,
      totalShares,
      availableShares: totalShares,
      pricePerShare,
      totalValue,
      images,
      documents,
      owners: [], // No initial ownership assigned
    });

    await newProperty.save();
    res.status(201).json({
      message: "Property added by admin successfully!",
      property: newProperty,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a single property by ID
const getPropertyById = async (req, res) => {
  try {
    const { propertyId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid Property ID" });
    }

    const property = await Property.findById(propertyId).populate(
      "owners.userId",
      "name email"
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate(
      "owners.userId",
      "name email"
    );
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Remove a property (Only if the user owns all shares)
const removeProperty = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    // Verify if user owns all shares of the property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const userOwnership = property.owners.find(
      (owner) => owner.userId.toString() === userId
    );
    if (!userOwnership || userOwnership.sharePercentage < 100) {
      return res.status(403).json({
        message:
          "Unauthorized: You must own 100% shares to remove this property.",
      });
    }

    // Delete associated NFTs
    await Token.deleteMany({ property: propertyId });

    // Delete the property
    await Property.findByIdAndDelete(propertyId);

    res.status(200).json({ message: "Property removed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Export all functions
module.exports = {
  addProperty,
  sellShares,
  buyShares,
  addPropertyByAdmin, // ✅ Newly added function
  getPropertyById,
  getAllProperties,
  removeProperty,
};
