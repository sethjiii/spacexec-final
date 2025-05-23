const mongoose=require("mongoose")

const MarketplaceListingSchema = new mongoose.Schema({
  sellerId: {
     type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
  }, // User ID of the seller

  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required:true
  }, // Link to the actual property

  nftTokenId: {
    type: String,
    required: true,
  }, 

  sharePercentage: {
    type: Number,
    required: true,
  }, // Percentage of ownership listed for sale

  listingPrice: {
    type: Number,
    required: true,
  }, // Total price the seller wants

  pricePerShare: {
    type: Number,
    
  }, // Price per share

  shareCount: {
    type: Number,
    
  },
  //   minPurchasePercentage: {
  //     type: Number,
  //     default: 10
  //   }, // Minimum percentage a buyer can purchase

  //   maxPurchasePercentage: {
  //     type: Number,
  //     default: 100
  //   }, // Maximum percentage a buyer can purchase

  royalties: {
    type: Number,
    default: 0.02,
  }, // Platform royalty fee (e.g., 2%)

  status: {
    type: String,
    enum: ["listed", "sold", "cancelled"],
    default: "listed",
  }, // Listing status

  //   metadataURI: {
  //     type: String
  //   }, // URI pointing to the NFT metadata

  createdAt: {
    type: Date,
    default: Date.now,
  }, // Listing creation timestamp

  updatedAt: {
    type: Date,
    default: Date.now,
  }, // Last update timestamp
});

module.exports=mongoose.model("MarketplaceListing", MarketplaceListingSchema)

