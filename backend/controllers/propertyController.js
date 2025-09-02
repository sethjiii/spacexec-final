const Property = require("../models/propertyModels");
const Token = require("../models/NftTokenModel");
const User = require("../models/usersModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateNftToken");
const verifyTokenSignature = require("../utils/verifyTokenSignature");
const Transaction = require("../models/TransactionModel");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { v2: cloudinary } = require("cloudinary");
const SalesModel = require("../models/SalesModel");
const propertyModels = require("../models/propertyModels");
const MarketplaceListing=require("../models/MarketPlaceModel")
const crypto = require('crypto');
const NftTokenModel = require("../models/NftTokenModel");
const MarketPlaceModel = require("../models/MarketPlaceModel");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Utility function to verify NFT ownership
const verifyNFTOwnership = async (userId, propertyId) => {
  const token = await Token.findOne({ owner: userId, property: propertyId });
  return !!token;
};

const buyShares = async (req, res) => {
  try {
    const { userId, propertyId, sharesToBuy, paymentMethod, referenceId } =
      req.body;

    // Validate input
    if (!isValidObjectId(userId) || !isValidObjectId(propertyId)) {
      return res.status(400).json({ error: "Invalid user or property ID" });
    }
    if (sharesToBuy <= 0) {
      return res
        .status(400)
        .json({ error: "Shares to buy must be greater than 0" });
    }
    if (
      !paymentMethod ||
      !["bank_transfer", "credit_card", "UPI", "crypto"].includes(paymentMethod)
    ) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // Verify property existence
    const property = await Property.findById(propertyId);
    const primary_lister = property.primary_lister;

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    if (property.availableShares < sharesToBuy) {
      return res
        .status(400)
        .json({ error: "Not enough shares available for purchase" });
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

    let existingToken = await Token.findOne({
      owner: userId,
      property: propertyId,
    });

    let signature;
    if (existingToken) {
      // Update existing token (DO NOT generate a new one)
      existingToken.sharesOwned += sharesToBuy;
      existingToken.purchasePrice += totalPrice; // ✅ Update purchase price
      await existingToken.save();

      if (
        !user.ownedTokens.some((tokenId) => tokenId.equals(existingToken._id))
      ) {
        user.ownedTokens.push(existingToken._id);
      }

      // Generate a new signature using the same token ID
      signature = generateToken(
        existingToken.tokenId,
        userId,
        propertyId
      ).signature;
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
        purchasePrice: totalPrice, // ✅ Save purchase price
        issuedAt,
      });

      // Add token to user's `ownedTokens`
      user.ownedTokens.push(existingToken._id);
    }

    // ✅ Update user's `investedProperties`
    const propertyIndex = user.investedProperties.findIndex((p) =>
      p.propertyId.equals(propertyId)
    );
    if (propertyIndex > -1) {
      user.investedProperties[propertyIndex].sharePercentage +=
        (sharesToBuy / property.totalShares) * 100;
    } else {
      user.investedProperties.push({
        propertyId: propertyId,
        sharePercentage: (sharesToBuy / property.totalShares) * 100,
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
        tokenId: existingToken.tokenId,
      }, // NFT token information
    };

    console.log(transaction_);

    user.transactions.push(transaction_);

    // ✅ Update property owners (Add user if not already in the list)
    const ownerIndex = property.owners.findIndex((owner) =>
      owner.userId.equals(userId)
    );
    if (ownerIndex > -1) {
      property.owners[ownerIndex].sharePercentage +=
        (sharesToBuy / property.totalShares) * 100;
    } else {
      property.owners.push({
        userId: userId,
        sharePercentage: (sharesToBuy / property.totalShares) * 100,
      });
    }

    await property.save();
    await user.save();

    // add the sales data to sales table
    // total income total revenue month
    const currentMonth = moment().format("MM-YYYY");
    let salesDoc = await SalesModel.findOne({ user: primary_lister });

    // console.log(salesDoc)
    if (!salesDoc) {
      salesDoc = await SalesModel.create({
        user: primary_lister,
        role: "vendor",
        monthlyData: {
          [currentMonth]: {
            totalIncome: totalPrice,
            totalRevenue: totalPrice,
            salesCount: 1,
            transactions: [transaction._id],
          },
        },
      });
    } else {
      // console.log(currentMonth)
      const currentMonthData = salesDoc.monthlyData.get("04-2025");
      // console.log(salesDoc)
      if (currentMonthData) {
        currentMonthData.totalIncome += totalPrice;
        currentMonthData.totalRevenue += totalPrice;
        currentMonthData.salesCount += 1;
        currentMonthData.transactions.push(transaction._id);
      } else {
        salesDoc.monthlyData[currentMonth] = {
          totalIncome: totalPrice,
          totalRevenue: totalPrice,
          salesCount: 1,
          transactions: [transaction._id],
        };
      }

      await salesDoc.save();
    }

    return res.status(201).json({
      message: "Shares purchased successfully!",
      transactionId,
      tokenId: existingToken.tokenId,
      issuedAt: existingToken.issuedAt,
      signature,
    });
  } catch (error) {
    console.error("Buy Shares Error:", error);
    res.status(500).json({ error: "Failed to buy shares" });
  }
};


const verifySignature = async (req, res) => {
  try {
    const { tokenId, userId, propertyId, signature } = req.body;

    // Basic validation
    if (!tokenId || !userId || !propertyId || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const metadata = { tokenId, owner: userId, propertyId };
    const expectedSignature = crypto
      .createHash('sha256')
      .update(JSON.stringify(metadata))
      .digest('hex');

    console.log("Expected Signature:", expectedSignature);
    // console.log("Received Signature:", signature);

    if (expectedSignature === signature) {
      return res.status(200).json({ message: 'Signature verified successfully' });
    } else {
      return res.status(401).json({ error: 'Invalid signature' });
    }

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: 'Server error during signature verification' });
  }
};


const sellShares = async (req, res) => {
  try {
    const {
      sellerId,
      propertyId,
      sharesToSell,
      buyerId,
      paymentMethod,
      referenceId,
      marketplaceId,
      investmentAmount
    } = req.body;

    console.log(req.body);

    // Validate input
    if (!isValidObjectId(sellerId) || !isValidObjectId(propertyId)) {
      return res.status(400).json({ error: "Invalid seller or property ID" });
    }

    if (sharesToSell <= 0) {
      return res
        .status(400)
        .json({ error: "Shares to sell must be greater than 0" });
    }

    if (
      !paymentMethod ||
      !["bank_transfer", "credit_card", "UPI", "crypto"].includes(paymentMethod)
    ) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // ✅ Check if listing exists in the marketplace if marketplaceId is provided
    if (marketplaceId) {
      if (!isValidObjectId(marketplaceId)) {
        return res.status(400).json({ error: "Invalid marketplace ID" });
      }

      const listing = await MarketPlaceModel.findById(marketplaceId);
      if (!listing) {
        return res.status(404).json({ error: "Marketplace listing not found" });
      }
    }

    // ✅ Fetch seller's token
    const sellerToken = await Token.findOne({
      owner: sellerId,
      property: propertyId,
    });

    if (!sellerToken || sellerToken.sharesOwned < sharesToSell) {
      return res
        .status(400)
        .json({ error: "Seller does not have enough shares to sell" });
    }

    // ✅ Fetch property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const totalPrice = investmentAmount;
    let newSignature = null;

    if (buyerId) {
      if (!isValidObjectId(buyerId)) {
        return res.status(400).json({ error: "Invalid buyer ID" });
      }

      let buyerToken = await Token.findOne({
        owner: buyerId,
        property: propertyId,
      });

      if (buyerToken) {
        buyerToken.sharesOwned += sharesToSell;
        buyerToken.purchasePrice += totalPrice;
        await buyerToken.save();

        newSignature = generateToken(
          buyerToken.tokenId,
          buyerId,
          propertyId
        ).signature;
      } else {
        const issuedAt = Date.now();
        const newTokenData = generateToken(null, buyerId, propertyId);
        newSignature = newTokenData.signature;

        buyerToken = await Token.create({
          tokenId: newTokenData.tokenId,
          owner: buyerId,
          property: propertyId,
          sharesOwned: sharesToSell,
          purchasePrice: totalPrice,
          issuedAt,
        });
      }

      const buyer = await User.findById(buyerId);
      if (buyer) {
        if (
          !buyer.ownedTokens.some((tokenId) => tokenId.equals(buyerToken._id))
        ) {
          buyer.ownedTokens.push(buyerToken._id);
        }

        const propertyIndex = buyer.investedProperties.findIndex((p) =>
          p.propertyId.equals(propertyId)
        );

        if (propertyIndex > -1) {
          buyer.investedProperties[propertyIndex].sharePercentage +=
            (sharesToSell / property.totalShares) * 100;
        } else {
          buyer.investedProperties.push({
            propertyId: propertyId,
            sharePercentage: (sharesToSell / property.totalShares) * 100,
          });
        }

        await buyer.save();
      }
    } else {
      property.availableShares += sharesToSell;
      await property.save();
    }

    // ✅ Reduce Seller Shares
    sellerToken.sharesOwned -= sharesToSell;
    sellerToken.purchasePrice -= totalPrice;

    if (sellerToken.sharesOwned === 0) {
      await Token.deleteOne({ _id: sellerToken._id });

      const seller = await User.findById(sellerId);
      if (seller) {
        seller.ownedTokens = seller.ownedTokens.filter(
          (tokenId) => !tokenId.equals(sellerToken._id)
        );
        await seller.save();
      }
    } else {
      await sellerToken.save();
    }

    // ✅ Create transaction
    const transactionId = uuidv4();
    const transaction = await Transaction.create({
      transactionId,
      tokenId: sellerToken._id,
      buyer: buyerId || null,
      seller: sellerId,
      propertyId,
      amount: totalPrice,
      sharePercentage: (sharesToSell / property.totalShares) * 100,
      type: "sell",
      status: "completed",
      paymentDetails: {
        method: paymentMethod,
        referenceId: referenceId || uuidv4(),
      },
    });

    property.transactions.push(transaction._id);

    // ✅ Update property owners
    const sellerIndex = property.owners.findIndex((owner) =>
      owner.userId.equals(sellerId)
    );
    if (sellerIndex > -1) {
      property.owners[sellerIndex].sharePercentage -=
        (sharesToSell / property.totalShares) * 100;
      if (property.owners[sellerIndex].sharePercentage <= 0) {
        property.owners.splice(sellerIndex, 1);
      }
    }

    if (buyerId) {
      const buyerIndex = property.owners.findIndex((owner) =>
        owner.userId.equals(buyerId)
      );
      if (buyerIndex > -1) {
        property.owners[buyerIndex].sharePercentage +=
          (sharesToSell / property.totalShares) * 100;
      } else {
        property.owners.push({
          userId: buyerId,
          sharePercentage: (sharesToSell / property.totalShares) * 100,
        });
      }
    }

    await property.save();

    // ✅ Delete Marketplace listing if provided
    if (marketplaceId && isValidObjectId(marketplaceId)) {
      try {
        await MarketPlaceModel.deleteOne({ _id: marketplaceId });
        console.log(`Marketplace listing ${marketplaceId} deleted successfully.`);
      } catch (deleteErr) {
        console.error("Failed to delete marketplace listing:", deleteErr);
      }
    }

    res.status(200).json({
      message: "Shares sold successfully!",
      transactionId,
      newSignature,
    });
  } catch (error) {
    console.error("Sell Shares Error:", error);
    res.status(500).json({ error: "Failed to sell shares" });
  }
};


const createListing = async (req, res) => {
  try {
    const {
      sellerId,
      propertyId,
      nftTokenId,
      sharePercentage,
      listingPrice,
      royalties,
    } = req.body;

    // Validate required fields
    if (
      !sellerId ||
      !propertyId ||
      !nftTokenId ||
      !sharePercentage ||
      !listingPrice
    ) {
      return res.status(401).json({ message: "Missing required fields" });
    }

    // Check if already listed
    const alreadyListed = await MarketplaceListing.findOne({
      nftTokenId,
      sellerId,
    });

    if (alreadyListed) {
      return res.status(401).json({
        message: "You already have a listing associated with this NFT",
      });
    }

    // Get token data
    const savedNftToken = await NftTokenModel.findOne({ tokenId: nftTokenId });

    if (!savedNftToken) {
      return res.status(404).json({ message: "NFT token not found" });
    }

    // Calculate price per share
    const shareCount=savedNftToken.sharesOwned*sharePercentage/100;
    const pricePerShare =
      listingPrice/shareCount;


    // Create listing
    const newListing = new MarketplaceListing({
      sellerId,
      propertyId,
      nftTokenId,
      sharePercentage,
      listingPrice,
      pricePerShare,
      royalties: royalties ?? 0.02,
      shareCount
    });

    const savedListing = await newListing.save();
    res.status(201).json({
      message: "Listing created successfully",
      listing: savedListing,
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    res
      .status(500)
      .json({ error: "Server error while creating listing" });
  }
};

const getAllMarketPlace = async (req, res) => {
  try {
    console.log("Fetching marketplace listings...");

    const listings = await MarketplaceListing.find({ status: "listed" })
    .populate("sellerId", "name email")
    .populate({
      path: "propertyId",
      populate: {
        path: "owners.userId", // populate userId inside each owner
        model: "User",
        select: "name email", // Optional: limit fields
      },
    });
  
    res.status(200).json({
      message: "Listings fetched successfully",
      count: listings.length,
      listings, // renamed from `listing` to plural for clarity
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({
      error: "Server error while fetching listings",
    });
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
    } = req.body;

    // Check for missing required fields
    if (
      !name ||
      !title ||
      !location ||
      !description ||
      !type ||
      !price ||
      !propertyYield ||
      !totalShares ||
      !availableShares ||
      !pricePerShare ||
      !totalValue ||
      !bedrooms ||
      !bathrooms ||
      !area ||
      !fundingGoal ||
      !fundingRaised ||
      !vendorInfo ||
      !legalInfo ||
      !returnData ||
      !financials ||
      !offeringDetails
    ) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    // Handle image uploads (Assuming images are sent as part of the 'images' field)
    const uploadedImages = [];
    if (req.files && req.files.images) {
      for (const image of req.files.images) {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "property-images", // Cloudinary folder for storing images
        });
        uploadedImages.push(result.secure_url); // Store the URL of the uploaded image
      }
    }

    // Handle document uploads (Assuming documents are sent as part of the 'documents' field)
    const uploadedDocuments = [];
    if (req.files && req.files.documents) {
      for (const doc of req.files.documents) {
        const result = await cloudinary.uploader.upload(doc.path, {
          folder: "property-documents", // Cloudinary folder for storing documents
          resource_type: "raw", // Store raw files like PDFs, Word, etc.
        });
        uploadedDocuments.push(result.secure_url); // Store the URL of the uploaded document
      }
    }

    // Create the property object
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
      images: uploadedImages,
      documents: uploadedDocuments,
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
    });

    // Save the property to the database
    await newProperty.save();
    res
      .status(201)
      .json({ message: "Property added successfully!", property: newProperty });
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const uploadImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedImages = [];

    for (const file of files) {
      const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      const result = await cloudinary.uploader.upload(base64String, {
        folder: 'realstate-packages',
      });

      uploadedImages.push(result.secure_url);
    }

    return res.status(200).json({ urls: uploadedImages });
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json({ error: 'Failed to upload images' });
  }
};

const uploadPDFs = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedPDFs = [];

    for (const file of files) {
      // If it's a PDF, use the same buffer-based upload but specify the resource_type
      const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      const result = await cloudinary.uploader.upload(base64String, {
        resource_type: 'auto', // This allows Cloudinary to automatically detect the type (image or pdf)
        folder: 'realstate-pdfs', // You can create a different folder for PDFs
      });

      uploadedPDFs.push(result.secure_url);
    }

    return res.status(200).json({ urls: uploadedPDFs });
  } catch (error) {
    console.error('Error uploading PDFs:', error);
    return res.status(500).json({ error: 'Failed to upload PDFs' });
  }
};



const addPropertyByAdmin = async (req, res) => {
  try {
    // Extract JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
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
    const primary_lister=adminId;

    // Check if the user is an admin
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can add properties" });
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
      offeringDetails,
    } = req.body;


console.log(req.body)
    if (
      !name ||
      !title ||
      !location ||
      !description ||
      !type ||
      price === undefined ||
      propertyYield === undefined ||
      totalShares === undefined ||
      availableShares === undefined ||
      pricePerShare === undefined ||
      totalValue === undefined ||
      !images?.length ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      area === undefined ||
      fundingGoal === undefined ||
      fundingRaised === undefined ||
      !vendorInfo?.name ||
      !vendorInfo?.phone ||
      !vendorInfo?.email ||
      !legalInfo ||
      !returnData ||
      !financials ||
      !offeringDetails ||
      !primary_lister
    ) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    if (availableShares > totalShares) {
      return res
        .status(400)
        .json({ message: "Available shares cannot exceed total shares." });
    }

    if (fundingRaised > fundingGoal) {
      return res
        .status(400)
        .json({ message: "Funding raised cannot exceed funding goal." });
    }

    // Create new property
    const newProperty = new Property({
      name,
      title,
      location,
      description,
      type,
      price,
      primary_lister,
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
      updatedAt: new Date(),
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
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== propertyId
      );
      await user.save();
      return res.status(200).json({
        message: "Property removed from wishlist",
        wishlist: user.wishlist,
      });
    } else {
      // Add to wishlist
      user.wishlist.push(propertyId);
      await user.save();
      return res.status(200).json({
        message: "Property added to wishlist",
        wishlist: user.wishlist,
      });
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


const disableProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;  // Property ID from the request params

    // Validate if the propertyId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid Property ID" });
    }

    // Check if the property exists in the database
    const property = await propertyModels.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Disable the property by updating its status
    property.status = "disabled";
    await property.save();

    return res.status(200).json({
      message: "Property disabled successfully.",
      property: property,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const approveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;  // Property ID from the request params

    // Validate if the propertyId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid Property ID" });
    }

    // Check if the property exists in the database
    const property = await propertyModels.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Approve the property by updating its status
    property.status = "active";
    await property.save();

    return res.status(200).json({
      message: "Property approved successfully.",
      property: property,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;  // Property ID from the request params

    // Validate if the propertyId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid Property ID" });
    }

    // Check if the property exists in the database
    const property = await propertyModels.findById(propertyId);
    if(property.availableShares==property.totalShares){
      await property.deleteOne();
    }else{
      return res.status(400).json({
        message: "Property has some Share Holders , You can not perform delete operation",
      });
    }
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }



    return res.status(200).json({
      message: "Property deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
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
  toggleWishList,
  uploadImages,
  uploadPDFs,
  deleteProperty,
  approveProperty,
  disableProperty,
  verifySignature,
  createListing,
  getAllMarketPlace
};
