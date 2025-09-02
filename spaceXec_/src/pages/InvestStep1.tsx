import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const InvestPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investorName, setInvestorName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [shares, setShares] = useState(1);
  const [investmentAmount, setInvestmentAmount] = useState(0);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.REACT_APP_BACKEND_URL
            : "http://localhost:5000";

        const token = localStorage.getItem("token"); // JWT stored after login

        const response = await fetch(
          `${baseUrl}/api/properties/${propertyId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ send JWT
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch property data");

        const data = await response.json();
        setPropertyData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Retrieve investor details from local storage
    setInvestorName(localStorage.getItem("name") || "");
    setEmail(localStorage.getItem("email") || "");
    setUserId(localStorage.getItem("_id"));

    fetchPropertyData();
  }, [propertyId]);

  useEffect(() => {
    // Calculate investment amount dynamically
    if (propertyData) {
      setInvestmentAmount(shares * (propertyData.pricePerShare || 0));
    }
  }, [shares, propertyData]);

  const handleInvest = () => {
    if (!investorName || !email || investmentAmount <= 0 || shares <= 0) {
      alert("Please fill out all fields correctly.");
      return;
    }

    navigate("/invest/review", {
      state: {
        propertyData,
        investorName,
        investmentAmount,
        email,
        shares,
        userId,
        propertyId,
      },
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading property details...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Hero Section */}
      {propertyData?.images?.length > 0 && (
        <div className="rounded-lg overflow-hidden shadow-md mb-8">
          <img
            src={propertyData.images[0]}
            alt={propertyData.name}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Property Details */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {propertyData.name}
      </h2>
      <p className="text-gray-600">{propertyData.location}</p>

      {/* Key Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Yield</h3>
          <p className="text-2xl font-bold text-green-500">
            {propertyData.yield}%
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Funding Goal</h3>
          <p className="text-2xl font-bold text-gray-800">
            ₹{propertyData.fundingGoal}
          </p>
        </div>
      </div>

      {/* Investment Form */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Investment Details
        </h3>
        <form>
          <div className="mb-4">
            <label htmlFor="investorName" className="block text-gray-700 mb-2">
              Investor Name
            </label>
            <input
              id="investorName"
              type="text"
              className="w-full p-2 border rounded-md"
              value={investorName}
              onChange={(e) => setInvestorName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="shares" className="block text-gray-700 mb-2">
              Number of Shares (Available: {propertyData.availableShares})
            </label>
            <input
              id="shares"
              type="number"
              className="w-full p-2 border rounded-md"
              min={1}
              max={propertyData.availableShares}
              value={shares}
              onChange={(e) => setShares(Math.max(1, Number(e.target.value)))}
              required
            />
          </div>

          <p className="text-gray-700 text-lg">
            <strong>Total Amount:</strong> ₹{investmentAmount}
          </p>

          <Button
            type="button"
            onClick={handleInvest}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Proceed to Invest
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InvestPage;
