import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MarketPlaceCheckout1 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    shareCount,
    listingPrice,
    investorName,
    email,
    propertyId,
  } = location.state.property || {};

  console.log(location.state)

  const propertyData=propertyId;
  const shares=shareCount;
  const investmentAmount=listingPrice;
  const sellerDetails=location.state.property.sellerId;

//   console.log(location.state.property)
//   console.log(investmentAmount)

  const listing = propertyData; // Full listing object
  const property = propertyData; // Actual property details
  const marketplaceId=location.state.property._id
  const nftTokenId=location.state.property.nftTokenId

  useEffect(() => {
    if (!property || !shares || !investmentAmount) {
      navigate("/invest");
    }
  }, [property, shares, investmentAmount, navigate]);

  const handleNext = (paymentMethod: string) => {
    navigate("/marketplace/checkout", {
      state: {
        propertyData,
        shares,
        investmentAmount,
        paymentMethod,
        propertyId,
        sellerDetails,
        marketplaceId,
        nftTokenId        
      },
    });
  };

  if (!property) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-medium">
          Missing property data. Please return to the investment page.
        </p>
        <Button onClick={() => navigate("/invest")} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Summary */}
        <div className="space-y-4">
          <img
            src={property?.images?.[0]}
            alt="Property"
            className="w-full h-64 object-cover rounded-md border"
          />

          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-2">{property.name}</h2>
            <p className="text-gray-600 mb-2">{property.description}</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Location:</strong> {property.location}</p>
              <p><strong>Total Value:</strong> ₹{listing?.listingPrice}</p>
              <p><strong>Available Shares:</strong> {listing?.availableShares}</p>
              <p><strong>Investment Term:</strong> {property?.offeringDetails?.investmentTerm} yrs</p>
              <p><strong>Yield:</strong> {property?.return?.rental}%</p>
              <p><strong>Appreciation:</strong> {property?.return?.appreciation}%</p>
            </div>
          </div>
        </div>

        {/* Investment + Payment Info */}
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-bold mb-2">Investment Summary</h3>
            <p><strong>Shares to Purchase:</strong> {shares}</p>
            <p><strong>Total Investment:</strong> ₹{investmentAmount}</p>
            <p><strong>Investor Name:</strong> {investorName}</p>
            <p><strong>Email:</strong> {email}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-bold mb-2">Choose Payment Method</h3>
            <Button onClick={() => handleNext("UPI")} className="w-full bg-blue-600 hover:bg-blue-700 mt-2">
              Pay via UPI
            </Button>
            <Button onClick={() => handleNext("Card")} className="w-full bg-blue-600 hover:bg-blue-700 mt-2">
              Pay via Card
            </Button>
          </div>

          <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
            <strong>Note:</strong> Real estate investments through NFTs involve risk. Please read all terms before confirming.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceCheckout1;
