const Token = require("../models/NftTokenModel");
const generateToken = require("../utils/generateNftToken");
const Property = require("../models/propertyModels");
const mongoose = require("mongoose");

// Utility function to check if an ID is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);



const mintToken = async (req, res) => {
  try {
    const { userId, propertyId, sharesOwned } = req.body;

    // Validate input
    if (!isValidObjectId(userId) || !isValidObjectId(propertyId)) {
      return res.status(400).json({ error: "Invalid user or property ID" });
    }

    if (sharesOwned <= 0) {
      return res
        .status(400)
        .json({ error: "Shares owned must be greater than 0" });
    }

    // Verify property existence
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.availableShares < sharesOwned) {
      return res
        .status(400)
        .json({ error: "Not enough shares available for minting" });
    }

    // Generate and save NFT token
    const newToken = generateToken(userId, propertyId, sharesOwned);
    const savedToken = await Token.create(newToken);

    // Update property available shares
    property.availableShares -= sharesOwned;
    await property.save();

    res
      .status(201)
      .json({ message: "NFT Token Minted Successfully", token: savedToken });
  } catch (error) {
    console.error("Minting Error:", error);
    res.status(500).json({ error: "Token Minting Failed" });
  }
};

// Transfer NFT ownership
const transferToken = async (req, res) => {
  try {
    const { tokenId, newOwner, sharesTransferred } = req.body;

    if (!isValidObjectId(tokenId) || !isValidObjectId(newOwner)) {
      return res
        .status(400)
        .json({ error: "Invalid Token ID or new owner ID" });
    }

    // Fetch token
    const token = await Token.findOne({ tokenId });
    if (!token) return res.status(404).json({ error: "Token Not Found" });

    if (token.sharesOwned < sharesTransferred) {
      return res.status(400).json({ error: "Insufficient shares to transfer" });
    }

    // Reduce shares from current owner
    token.sharesOwned -= sharesTransferred;
    await token.save();

    // Create a new token for the new owner with the transferred shares
    const newToken = await Token.create({
      ...token.toObject(),
      owner: newOwner,
      sharesOwned: sharesTransferred,
      tokenId: generateToken(newOwner, token.property, sharesTransferred)
        .tokenId,
    });

    res.status(200).json({
      message: "Token Ownership Transferred",
      oldToken: token,
      newToken,
    });
  } catch (error) {
    console.error("Transfer Error:", error);
    res.status(500).json({ error: "Transfer Failed" });
  }
};

// Burn (Destroy) NFT Token (Only Owner Can Burn Their Token)
const burnToken = async (req, res) => {
  try {
    const { tokenId, userId } = req.body;

    if (!isValidObjectId(tokenId) || !isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid Token ID or User ID" });
    }

    // Find token
    const token = await Token.findOne({ tokenId, owner: userId });
    if (!token)
      return res.status(404).json({ error: "Token Not Found or Unauthorized" });

    // Remove token from database
    await Token.deleteOne({ tokenId });

    // Restore shares to property
    const property = await Property.findById(token.property);
    if (property) {
      property.availableShares += token.sharesOwned;
      await property.save();
    }

    res.status(200).json({ message: "NFT Token Burned Successfully" });
  } catch (error) {
    console.error("Burn Error:", error);
    res.status(500).json({ error: "Token Burn Failed" });
  }
};

// Get details of a specific NFT Token
const getTokenById = async (req, res) => {
  try {
    const { tokenId } = req.params;

    if (!isValidObjectId(tokenId)) {
      return res.status(400).json({ error: "Invalid Token ID" });
    }

    const token = await Token.findById(tokenId)
      .populate("owner", "name email")
      .populate("property", "name location");
    if (!token) return res.status(404).json({ error: "Token Not Found" });

    res.status(200).json(token);
  } catch (error) {
    console.error("Get Token Error:", error);
    res.status(500).json({ error: "Failed to Retrieve Token" });
  }
};

// Get all NFT Tokens owned by a user
const getTokensByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const tokens = await Token.find({ owner: userId }).populate(
      "property",
      "name location"
    );
    res.status(200).json(tokens);
  } catch (error) {
    console.error("Get User Tokens Error:", error);
    res.status(500).json({ error: "Failed to Retrieve Tokens" });
  }
};

// Get all tokens of a specific property
const getTokensByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ error: "Invalid Property ID" });
    }

    const tokens = await Token.find({ property: propertyId }).populate(
      "owner",
      "name email"
    );
    res.status(200).json(tokens);
  } catch (error) {
    console.error("Get Property Tokens Error:", error);
    res.status(500).json({ error: "Failed to Retrieve Tokens" });
  }
};

// Get all NFT Tokens
const getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find()
      .populate("owner", "name email")
      .populate("property", "name location");
    res.status(200).json(tokens);
  } catch (error) {
    console.error("Get All Tokens Error:", error);
    res.status(500).json({ error: "Failed to Retrieve Tokens" });
  }
};

// Common export
module.exports = {
  mintToken,
  transferToken,
  burnToken,
  getTokenById,
  getTokensByUser,
  getTokensByProperty,
  getAllTokens,
  
};
