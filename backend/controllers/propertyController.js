const Property = require("../models/propertyModels");
const Token = require("../models/NftTokenModel");
const User = require("../models/usersModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateNftToken");
const verifyTokenSignature = require("../utils/verifyTokenSignature");
const Transaction=require("../models/TransactionModel")


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Utility function to verify NFT ownership
const verifyNFTOwnership = async (userId, propertyId) => {
  const token = await Token.findOne({ owner: userId, property: propertyId });
  return !!token;
};

const { v4: uuidv4 } = require("uuid");


const buyShares = async (req, res) => {
    try {
        const { userId, propertyId, sharesToBuy, paymentMethod, referenceId } = req.body;

        // Validate input
        if (!isValidObjectId(userId) || !isValidObjectId(propertyId)) {
            return res.status(400).json({ error: "Invalid user or property ID" });
        }
        if (sharesToBuy <= 0) {
            return res.status(400).json({ error: "Shares to buy must be greater than 0" });
        }
        if (!paymentMethod || !["bank_transfer", "credit_card", "UPI", "crypto"].includes(paymentMethod)) {
            return res.status(400).json({ error: "Invalid payment method" });
        }

        // Verify property existence
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        if (property.availableShares < sharesToBuy) {
            return res.status(400).json({ error: "Not enough shares available for purchase" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Calculate total purchase price
        const totalPrice = sharesToBuy * property.pricePerShare;

        // Deduct shares from availableShares
        property.availableShares -= sharesToBuy;
        await property.save();

        let existingToken = await Token.findOne({ owner: userId, property: propertyId });

        let signature;
        if (existingToken) {
            // Update existing token (DO NOT generate a new one)
            existingToken.sharesOwned += sharesToBuy;
            existingToken.purchasePrice += totalPrice;  // ✅ Update purchase price
            await existingToken.save();

            if (!user.ownedTokens.some(tokenId => tokenId.equals(existingToken._id))) {
                user.ownedTokens.push(existingToken._id);
            }

            // Generate a new signature using the same token ID
            signature = generateToken(existingToken.tokenId, userId, propertyId).signature;
        } else {
            // Generate token metadata for new ownership
            const issuedAt = Date.now();
            const newTokenData = generateToken(null, userId, propertyId);
            signature = newTokenData.signature;

            // Mint a new NFT token
            existingToken = await Token.create({
                tokenId: newTokenData.tokenId,
                owner: userId,
                property: propertyId,
                sharesOwned: sharesToBuy,
                purchasePrice: totalPrice,  // ✅ Save purchase price
                issuedAt,
            });

            // Add token to user's `ownedTokens`
            user.ownedTokens.push(existingToken._id);
        }



        // ✅ Update user's `investedProperties`
        const propertyIndex = user.investedProperties.findIndex(p => p.propertyId.equals(propertyId));
        if (propertyIndex > -1) {
            user.investedProperties[propertyIndex].sharePercentage += (sharesToBuy / property.totalShares) * 100;
        } else {
            user.investedProperties.push({
                propertyId: propertyId,
                sharePercentage: (sharesToBuy / property.totalShares) * 100
            });
        }

        // ✅ Log the transaction
        const transactionId = uuidv4();
        const transaction = await Transaction.create({
            transactionId,
            tokenId: existingToken._id,
            buyer: userId,
            seller: null, // No seller as this is a primary purchase
            propertyId,
            amount: totalPrice,
            sharePercentage: (sharesToBuy / property.totalShares) * 100,
            type: "buy",
            status: "completed",
            paymentDetails: {
                method: paymentMethod,
                referenceId: referenceId || uuidv4(), // If no referenceId, auto-generate one
            },
        });

        // ✅ Push the transaction ID to `transactions` array in Property
        property.transactions.push(transaction._id);

        const transaction_ = {
          transaction_id: transactionId,
          date: Date.now(),
          amount: totalPrice,
          type: "investment", // 'investment' or 'return'
          propertyId: propertyId,
          nftToken: {
            tokenId:existingToken.tokenId
          }, // NFT token information
        };

        console.log(transaction_)

        user.transactions.push(transaction_)

        // ✅ Update property owners (Add user if not already in the list)
        const ownerIndex = property.owners.findIndex(owner => owner.userId.equals(userId));
        if (ownerIndex > -1) {
            property.owners[ownerIndex].sharePercentage += (sharesToBuy / property.totalShares) * 100;
        } else {
            property.owners.push({
                userId: userId,
                sharePercentage: (sharesToBuy / property.totalShares) * 100
            });
        }

        await property.save();
        await user.save();

        return res.status(201).json({
            message: "Shares purchased successfully!",
            transactionId,
            tokenId: existingToken.tokenId,
            issuedAt: existingToken.issuedAt,
            signature
        });
    } catch (error) {
        console.error("Buy Shares Error:", error);
        res.status(500).json({ error: "Failed to buy shares" });
    }
};


const sellShares = async (req, res) => {
    try {
        const { sellerId, propertyId, sharesToSell, buyerId, signature, paymentMethod, referenceId } = req.body;

        // Validate input
        if (!isValidObjectId(sellerId) || !isValidObjectId(propertyId)) {
            return res.status(400).json({ error: "Invalid seller or property ID" });
        }
        if (sharesToSell <= 0) {
            return res.status(400).json({ error: "Shares to sell must be greater than 0" });
        }
        if (!paymentMethod || !["bank_transfer", "credit_card", "UPI", "crypto"].includes(paymentMethod)) {
            return res.status(400).json({ error: "Invalid payment method" });
        }

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

        // Fetch Property Details
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        // ✅ Calculate Sale Price
        const totalPrice = sharesToSell * property.pricePerShare;
        let newSignature = null;

        if (buyerId) {
            // Buyer case
            if (!isValidObjectId(buyerId)) {
                return res.status(400).json({ error: "Invalid buyer ID" });
            }

            let buyerToken = await Token.findOne({ owner: buyerId, property: propertyId });

            if (buyerToken) {
                // ✅ Buyer already owns shares, update existing token
                buyerToken.sharesOwned += sharesToSell;
                buyerToken.purchasePrice += totalPrice;  // ✅ Update purchase price
                await buyerToken.save();

                // Generate a new signature for buyer's updated token
                newSignature = generateToken(buyerToken.tokenId, buyerId, propertyId).signature;
            } else {
                // ✅ Generate a new token for the buyer
                const issuedAt = Date.now();
                const newTokenData = generateToken(null, buyerId, propertyId);
                newSignature = newTokenData.signature;

                buyerToken = await Token.create({
                    tokenId: newTokenData.tokenId,
                    owner: buyerId,
                    property: propertyId,
                    sharesOwned: sharesToSell,
                    purchasePrice: totalPrice,  // ✅ Save purchase price
                    issuedAt
                });
            }

            // ✅ Update Buyer's Owned Tokens
            const buyer = await User.findById(buyerId);
            if (buyer) {
                if (!buyer.ownedTokens.some(tokenId => tokenId.equals(buyerToken._id))) {
                    buyer.ownedTokens.push(buyerToken._id);
                }

                // ✅ Update Buyer's Invested Properties
                const propertyIndex = buyer.investedProperties.findIndex(p => p.propertyId.equals(propertyId));
                if (propertyIndex > -1) {
                    buyer.investedProperties[propertyIndex].sharePercentage += (sharesToSell / property.totalShares) * 100;
                } else {
                    buyer.investedProperties.push({
                        propertyId: propertyId,
                        sharePercentage: (sharesToSell / property.totalShares) * 100
                    });
                }

                await buyer.save();
            }
        } else {
            // ✅ Selling back to property
            property.availableShares += sharesToSell;
            await property.save();
        }

        // ✅ Reduce Seller's Shares
        sellerToken.sharesOwned -= sharesToSell;
        sellerToken.purchasePrice -= totalPrice;  // ✅ Deduct purchase price proportionally

        if (sellerToken.sharesOwned === 0) {
            await Token.deleteOne({ _id: sellerToken._id });

            // ✅ Remove Token from Seller’s Owned Tokens
            const seller = await User.findById(sellerId);
            if (seller) {
                seller.ownedTokens = seller.ownedTokens.filter(tokenId => !tokenId.equals(sellerToken._id));
                await seller.save();
            }
        } else {
            await sellerToken.save();
        }

        // ✅ Log the Transaction
        const transactionId = uuidv4();
        const transaction = await Transaction.create({
            transactionId,
            tokenId: sellerToken._id,
            buyer: buyerId || null, // If no buyer, it's a sell-back transaction
            seller: sellerId,
            propertyId,
            amount: totalPrice,
            sharePercentage: (sharesToSell / property.totalShares) * 100,
            type: "sell",
            status: "completed",
            paymentDetails: {
                method: paymentMethod,
                referenceId: referenceId || uuidv4(), // If no referenceId, auto-generate one
            },
        });

        // ✅ Push Transaction ID to Property Transactions
        property.transactions.push(transaction._id);

        // ✅ Update Property Ownership (Remove Seller, Add Buyer)
        const sellerIndex = property.owners.findIndex(owner => owner.userId.equals(sellerId));
        if (sellerIndex > -1) {
            property.owners[sellerIndex].sharePercentage -= (sharesToSell / property.totalShares) * 100;
            if (property.owners[sellerIndex].sharePercentage <= 0) {
                property.owners.splice(sellerIndex, 1);
            }
        }

        if (buyerId) {
            const buyerIndex = property.owners.findIndex(owner => owner.userId.equals(buyerId));
            if (buyerIndex > -1) {
                property.owners[buyerIndex].sharePercentage += (sharesToSell / property.totalShares) * 100;
            } else {
                property.owners.push({
                    userId: buyerId,
                    sharePercentage: (sharesToSell / property.totalShares) * 100
                });
            }
        }

        await property.save();

        res.status(200).json({ 
            message: "Shares sold successfully!", 
            transactionId,
            newSignature  // Only for buyer verification (not stored)
        });
    } catch (error) {
        console.error("Sell Shares Error:", error);
        res.status(500).json({ error: "Failed to sell shares" });
    }
};





const addProperty = async (req, res) => {
  try {
    const {
      name,
      title,
      location,
      description,
      type,
      price,
      yield: propertyYield,
      totalShares,
      availableShares,
      pricePerShare,
      totalValue,
      images,
      documents,
      bedrooms,
      bathrooms,
      area,
      amenities,
      fundingGoal,
      fundingRaised,
      vendorInfo,
      legalInfo,
      riskFactors,
      return: returnData,
      financials,
      offeringDetails
    } = req.body;

    // Check for missing required fields
    if (
      !name || !title || !location || !description || !type || !price ||
      !propertyYield || !totalShares || !availableShares || !pricePerShare ||
      !totalValue || !images || !bedrooms || !bathrooms || !area || !fundingGoal ||
      !fundingRaised || !vendorInfo || !legalInfo || !returnData || !financials || !offeringDetails
    ) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    // Create the property
    const newProperty = new Property({
      name,
      title,
      location,
      description,
      type,
      price,
      yield: propertyYield,
      totalShares,
      availableShares,
      pricePerShare,
      totalValue,
      images,
      documents,
      bedrooms,
      bathrooms,
      area,
      amenities,
      fundingGoal,
      fundingRaised,
      vendorInfo,
      legalInfo,
      riskFactors,
      return: returnData,
      financials,
      offeringDetails
    });

    await newProperty.save();
    res.status(201).json({ message: "Property added successfully!", property: newProperty });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};




const addPropertyByAdmin = async (req, res) => {
  try {
    // Extract JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const adminId = decoded.userId; // Extract user ID from token

    // Check if the user is an admin
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Only admins can add properties" });
    }

    // Extract property details from request body
    const {
      name,
      title,
      location,
      description,
      type,
      price,
      yield: propertyYield,
      totalShares,
      availableShares,
      pricePerShare,
      totalValue,
      images,
      documents = [],
      bedrooms,
      bathrooms,
      area,
      amenities = [],
      fundingGoal,
      fundingRaised,
      vendorInfo,
      legalInfo,
      riskFactors = [],
      return: returnData,
      financials,
      offeringDetails
    } = req.body;

    // Validate required fields
    if (
      !name || !title || !location || !description || !type || price === undefined ||
      propertyYield === undefined || totalShares === undefined || availableShares === undefined ||
      pricePerShare === undefined || totalValue === undefined || !images?.length ||
      bedrooms === undefined || bathrooms === undefined || area === undefined ||
      fundingGoal === undefined || fundingRaised === undefined ||
      !vendorInfo?.name || !vendorInfo?.phone || !vendorInfo?.email ||
      !legalInfo || !returnData || !financials || !offeringDetails
    ) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    // Ensure availableShares does not exceed totalShares
    if (availableShares > totalShares) {
      return res.status(400).json({ message: "Available shares cannot exceed total shares." });
    }

    // Ensure fundingRaised does not exceed fundingGoal
    if (fundingRaised > fundingGoal) {
      return res.status(400).json({ message: "Funding raised cannot exceed funding goal." });
    }

    // Create new property
    const newProperty = new Property({
      name,
      title,
      location,
      description,
      type,
      price,
      yield: propertyYield,
      totalShares,
      availableShares,
      pricePerShare,
      totalValue,
      images,
      documents,
      bedrooms,
      bathrooms,
      area,
      amenities,
      fundingGoal,
      fundingRaised,
      vendorInfo,
      legalInfo,
      riskFactors,
      return: returnData,
      financials,
      offeringDetails,
      owners: [], // No initial ownership assigned
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newProperty.save();
    res.status(201).json({
      message: "Property added by admin successfully!",
      property: newProperty,
    });
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



const toggleWishList = async (req, res) => {
  try {
    const { userId } = req.body;
    const { propertyId } = req.params;

    // Validate propertyId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid Property ID" });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if property is already in the wishlist
    const isInWishlist = user.wishlist.includes(propertyId);

    if (isInWishlist) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter((id) => id.toString() !== propertyId);
      await user.save();
      return res.status(200).json({ message: "Property removed from wishlist", wishlist: user.wishlist });
    } else {
      // Add to wishlist
      user.wishlist.push(propertyId);
      await user.save();
      return res.status(200).json({ message: "Property added to wishlist", wishlist: user.wishlist });
    }
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
  toggleWishList
};
