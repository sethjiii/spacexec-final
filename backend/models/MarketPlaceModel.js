import mongoose from "mongoose";

const MarketplaceListingSchema = new mongoose.Schema({
    sellerId: { 
        type: String, 
        required: true 
      }, // User ID of the seller
    
  propertyId: { 
    type: String, 
    required: true 
  }, // Link to the actual property

  nftTokenId: { 
    type: String, 
    required: true 
  }, // Blockchain NFT token ID

 
  
  sharePercentage: { 
    type: Number, 
    required: true 
  }, // Percentage of ownership listed for sale

  listingPrice: { 
    type: Number, 
    required: true 
  }, // Total price the seller wants

  pricePerShare: { 
    type: Number, 
    required: true 
  }, // Price per share

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
    default: 0.02 
  }, // Platform royalty fee (e.g., 2%)

  status: { 
    type: String, 
    enum: ['listed', 'sold', 'cancelled'], 
    default: 'listed' 
  }, // Listing status

  
//   metadataURI: { 
//     type: String 
//   }, // URI pointing to the NFT metadata

  createdAt: { 
    type: Date, 
    default: Date.now 
  }, // Listing creation timestamp

  updatedAt: { 
    type: Date, 
    default: Date.now 
  } // Last update timestamp
});

export default mongoose.model("MarketplaceListing", MarketplaceListingSchema);
