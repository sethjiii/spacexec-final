import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Copy } from "lucide-react";

const InvestStep4 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting data from location state
  const {
    userId,
    propertyData,
    shares,
    investmentAmount,
    paymentMethod,
    investorName,
    email,
    propertyId,
  } = location.state || {};

  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleComplete = async () => {
    if (!userId) {
      setError("User not authenticated. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_BACKEND_URL
          : "http://localhost:5000";

      const token = localStorage.getItem("token"); // JWT stored after login

      const response = await fetch(`${baseUrl}/api/properties/buyShares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ send JWT
        },
        body: JSON.stringify({
          userId,
          propertyId,
          sharesToBuy: shares,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Something went wrong!");

      setTransactionData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (transactionData?.signature) {
      navigator.clipboard.writeText(transactionData.signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10 border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Confirm Your Investment
      </h1>

      {/* Investment Details */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Investment Summary
        </h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Property:</strong>
          </p>
          <p className="text-right">{propertyData?.name || "N/A"}</p>

          <p>
            <strong>Property ID:</strong>
          </p>
          <p className="text-right">{propertyId}</p>

          <p>
            <strong>Investor:</strong>
          </p>
          <p className="text-right">{investorName}</p>

          <p>
            <strong>Investor ID:</strong>
          </p>
          <p className="text-right">{userId}</p>

          <p>
            <strong>Email:</strong>
          </p>
          <p className="text-right">{email}</p>

          <p>
            <strong>Shares:</strong>
          </p>
          <p className="text-right">{shares}</p>

          <p>
            <strong>Investment Amount:</strong>
          </p>
          <p className="text-right">₹{investmentAmount}</p>

          <p>
            <strong>Payment Method:</strong>
          </p>
          <p className="text-right">{paymentMethod}</p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-4">
          <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
        </div>
      )}

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {!transactionData ? (
        <Button
          onClick={handleComplete}
          className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
        >
          Complete Checkout
        </Button>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm mt-6">
          <div className="flex items-center justify-center">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-semibold text-green-700 text-center mt-4">
            Payment Successful!
          </h2>

          <div className="bg-gray-50 p-4 rounded-md mt-4 text-gray-700 text-sm">
            <p>
              <strong>Transaction ID:</strong> {transactionData.transactionId}
            </p>
            <p>
              <strong>Token ID:</strong> {transactionData.tokenId}
            </p>
            <p>
              <strong>Issued At:</strong>{" "}
              {new Date(transactionData.issuedAt).toLocaleString()}
            </p>
            <div className="flex justify-between items-center">
              <p>
                <strong>Signature:</strong> {transactionData.signature}
              </p>
              <button
                onClick={handleCopy}
                className="ml-2 p-1 text-gray-500 hover:text-gray-800 transition"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-xs mt-1">Signature copied!</p>
            )}
          </div>

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3 mt-6"
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvestStep4;
