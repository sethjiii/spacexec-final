import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const InvestReviewAndPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructuring with defaults to prevent undefined errors
  const {
    propertyData = {},
    shares = 0,
    investmentAmount = 0,
    investorName = "N/A",
    email = "N/A",
    userId = "N/A",
    propertyId = "N/A",
  } = location.state || {};

  // Redirect to the first step if required data is missing
  useEffect(() => {
    if (!propertyData?.name || !shares || !investmentAmount) {
      navigate("/invest"); // Redirect back to the first step
    }
  }, [propertyData, shares, investmentAmount, navigate]);

  const handleNext = (paymentMethod) => {
    navigate("/invest/checkout", {
      state: { propertyData, shares, investmentAmount, paymentMethod, investorName, email,propertyId,userId },
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Review and Payment</h1>

      {/* Review Section */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Investment Details</h2>
        <p><strong>Property:</strong> {propertyData?.name}</p>
        <p><strong>Shares to Buy:</strong> {shares}</p>
        <p><strong>Total Amount:</strong> ₹{investmentAmount}</p>
        <p><strong>Investor Name:</strong> {investorName}</p>
        <p><strong>Email:</strong> {email}</p>
      </div>

      {/* Payment Section */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Choose Payment Method</h2>
        <Button onClick={() => handleNext("UPI")} className="w-full bg-blue-600 hover:bg-blue-700 mt-2">
          Pay via UPI
        </Button>
        <Button onClick={() => handleNext("Card")} className="w-full bg-blue-600 hover:bg-blue-700 mt-2">
          Pay via Card
        </Button>
      </div>
    </div>
  );
};

export default InvestReviewAndPayment;
