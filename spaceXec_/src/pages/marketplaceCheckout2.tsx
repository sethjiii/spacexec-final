import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Download, Mail, User, CalendarDays, MapPin, FileText, Banknote, Landmark, ShieldCheck } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MarketPlaceCheckout2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [investorName, setInvestorName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [sellerDetails, setSellerDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [transactionData, setTransactionData] = useState({
    transactionId: "",
    tokenId: "",
    signature: "",
    issuedAt: "",
  });

  const {
    propertyData,
    shares,
    investmentAmount,
    paymentMethod,
    marketplaceId,
    nftTokenId,
  } = location.state || {};

  console.log(location.state.investmentAmount)

  useEffect(() => {
    const iName = localStorage.getItem("name");
    const iEmail = localStorage.getItem("email");
    const iUserId = localStorage.getItem("_id");

    setInvestorName(iName);
    setEmail(iEmail);
    setUserId(iUserId);
    setSellerDetails(location.state?.sellerDetails || {});

    if (!propertyData || !shares || !investmentAmount) {
      navigate("/marketplace");
    }
  }, [propertyData, shares, investmentAmount, navigate, location.state]);

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionData.signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("investment-receipt.pdf");
    }
  };

  const buyShares = async () => {
    setIsLoading(true);
    try {
      const sellerId = sellerDetails._id;
      const propertyId = propertyData._id;
      const sharesToSell = shares;
      const buyerId = userId;

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const res = await fetch(`${baseUrl}/api/properties/sellshares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerId,
          propertyId,
          sharesToSell,
          buyerId,
          paymentMethod,
          marketplaceId,
          investmentAmount
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to buy shares");
      }

      const data = await res.json();

      setTransactionData((prev) => ({
        ...prev,
        transactionId: data.transactionId,
        signature: data.newSignature,
        issuedAt: new Date().toISOString(),
      }));
    } catch (err) {
      console.error("Buy Shares Error:", err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = transactionData.issuedAt
    ? new Date(transactionData.issuedAt).toLocaleDateString()
    : "--";
  const formattedTime = transactionData.issuedAt
    ? new Date(transactionData.issuedAt).toLocaleTimeString()
    : "--";

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white border border-gray-400 rounded shadow font-mono text-black">
      <div ref={receiptRef} className="p-4">
        {/* Header */}
        <div className="text-center border-b border-black pb-4 mb-6">
          <h2 className="text-3xl font-extrabold mb-2">
            Space<span className="text-red-600">X</span>ec P2P Investment Receipt
          </h2>
          <p className="text-sm text-gray-600">Empowering Property Ownership via Blockchain</p>
          <p className="text-sm text-gray-600">GSTIN: 06AABCU9603R1Z2 | CIN: U74999HR2020PTC123456</p>
          <p className="text-sm text-gray-600">www.spacexec.com | support@spacexec.com</p>
        </div>

        {/* Investor Info */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <User className="w-5 h-5 mr-2" /> Investor Details
          </h3>
          <p><strong>Name:</strong> {investorName}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>

        {/* Property Info */}
        <div className="mb-6 border-t border-gray-400 pt-4">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Landmark className="w-5 h-5 mr-2" /> Property Details
          </h3>
          <p><strong>Property Name:</strong> {propertyData?.name}</p>
          <p><strong>Location:</strong> <MapPin className="inline-block w-4 h-4 mr-1" /> {propertyData?.location}</p>
          <p><strong>Investment Amount:</strong> ₹{investmentAmount}</p>
          <p><strong>NFT Token ID:</strong> {nftTokenId}</p>
        </div>

        {/* Payment Info */}
        <div className="mb-6 border-t border-gray-400 pt-4">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Banknote className="w-5 h-5 mr-2" /> Payment Details
          </h3>
          <p><strong>Shares Purchased:</strong> {shares}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
        </div>

        {/* Transaction Info */}
        <div className="mb-6 border-t border-gray-400 pt-4">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <FileText className="w-5 h-5 mr-2" /> Transaction Details
          </h3>
          <p><strong>Transaction ID:</strong> {transactionData.transactionId || <span className="text-gray-500">Pending</span>}</p>
          <div className="flex items-center">
            <p className="mr-2"><strong>Signature:</strong> {transactionData.signature || <span className="text-gray-500">Pending</span>}</p>
            {transactionData.signature && (
              <button onClick={handleCopy} className="text-black hover:text-gray-600">
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
          {copied && <p className="text-green-600 text-xs mt-1">Signature copied!</p>}
          <p><strong>Issued Date:</strong> {formattedDate}</p>
          <p><strong>Issued Time:</strong> {formattedTime}</p>
        </div>

        {/* Note */}
        <div className="text-xs text-gray-700 border-t border-gray-300 pt-3">
          <ShieldCheck className="inline-block w-4 h-4 mr-1" />
          Signature has been sent to your registered email ({email.slice(0, 3) + "***@gmail.com"}) for future reference. Please keep it safe to verify your ownership.
        </div>
      </div>

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6 border-t border-gray-300 pt-4">
        <Button onClick={handleDownload} className="bg-black text-white hover:bg-gray-800 px-4 py-2">
          <Download className="w-4 h-4 mr-1" /> Download Receipt
        </Button>
        <Button
          onClick={buyShares}
          className="bg-black text-white hover:bg-gray-800 px-4 py-2"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Confirm Checkout"}
        </Button>
      </div>
    </div>
  );
};

export default MarketPlaceCheckout2;
