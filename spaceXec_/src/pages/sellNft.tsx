import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  CheckCircle,
  Copy,
  AlertTriangle,
  Send,
  ArrowLeft,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  image: string;
  location: string;
  investedAmount: number;
  ownership: number;
  returns: number;
  purchaseDate: string;
  nftToken: string;
  signature?: string;
  lastValuation?: number;
  blockchain?: string;
}

const SellNFTPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = (location.state as Property | undefined) || {
    id: "prop123",
    title: "Luxury Villa in Goa",
    image: "/api/placeholder/800/600",
    location: "North Goa, Anjuna Beach",
    investedAmount: 2500000,
    ownership: 15,
    returns: 325000,
    purchaseDate: "2024-10-15",
    nftToken:
      "0xf7c3bc1d808e04732a131f8b45f84ca49e83d8f0800000000a403a800000000",
    blockchain: "Polygon",
    lastValuation: 3100000,
  };

  const [enteredToken, setEnteredToken] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [step, setStep] = useState<"token" | "signature" | "review">("token");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);
  const [sharePercentage, setSharePercentage] = useState<number>(10);

  useEffect(() => {
    if (location.state === undefined && !property) {
      toast.error("No property data found. Redirecting...");
      navigate("/");
    }
    setToken(localStorage.getItem('token'));
    setUserId(localStorage.getItem('_id'));
  }, [property, navigate, location]);

  // done
  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(property.nftToken);
    setCopied(true);
    toast.success("Token copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
  // done
  const handleConfirmToken = () => {
    if (enteredToken === property.nftToken) {
      toast.success("Token verified successfully!");
      setStep("signature");
    } else {
      toast.error(
        "Token verification failed. Please copy and paste the correct token."
      );
    }
  };
  // done
  const handleSignature = async () => {
    if (signature && signature.length > 10) {
      const baseUrl =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_BACKEND_URL
          : "http://localhost:5000";

      const res = await fetch(`${baseUrl}/api/properties/verifysignature`, {
        method: "POST", // PATCH for disabling
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tokenId: enteredToken,
          signature,
          propertyId: property.id,  // assuming property._id should be property.id
          userId,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Signature verified!");
        setStep("review");
      } else {
        toast.error("Invalid Signature");
      }
    } else {
      toast.warn("Please enter a valid signature or request one via email.");
    }
  };

  const handleListForSale = async () => {
    if (!price || parseFloat(price) <= 0) {
      toast.error("Please enter a valid listing price");
      return;
    }

    // console.log(sharePercentage)
    if (
      sharePercentage % 10 !== 0 ||
      sharePercentage <= 0
    ) {
      toast.error("Select a valid share percentage (multiples of 10)");
      return;
    }
    const baseUrl =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:5000";

    const res = await fetch(`${baseUrl}/api/properties/listnft`, {
      method: "POST", // PATCH for disabling
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sellerId: userId,
        propertyId: property.id,
        nftTokenId: enteredToken,
        sharePercentage,
        listingPrice: price,
        pricePerShare: price,
      }),
      credentials: "include",
    });
    const data = await res.json();
    console.log(data)
    if (res.ok) {
      toast.success("NFT listed successfully on marketplace!");
      setTimeout(() => {
        navigate("/marketplace");
      }, 3000);

    } else {

      toast.error(data.message)

    }

  };

  const renderStepContent = () => {
    switch (step) {
      case "token":
        return (
          <div className="space-y-6 mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Step 1: Verify NFT Ownership
              </h3>
              <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                Required
              </span>
            </div>

            <div className="bg-gray-100 text-green-400 p-4 rounded-lg font-mono text-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-200 to-yellow-200"></div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">NFT Token ID:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-gray-600 hover:text-white"
                  onClick={copyTokenToClipboard}
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </Button>
              </div>
              <span className="block break-all text-yellow-600">
                {property.nftToken}
              </span>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span>Verified on {property.blockchain}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Paste your NFT Token to confirm ownership:
              </label>
              <Input
                placeholder="Paste your complete NFT Token here"
                value={enteredToken}
                onChange={(e) => setEnteredToken(e.target.value)}
                className="font-mono text-sm"
              />
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleConfirmToken}
              >
                Verify Token
              </Button>
            </div>
          </div>
        );

      case "signature":
        return (
          <div className="space-y-6 mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Step 2: Provide Digital Signature
              </h3>
              <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                Required
              </span>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-700 rounded-r-md">
              <div className="flex">
                <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                <p>
                  Your digital signature is required to authorize this NFT
                  transaction. This is a security measure to protect your asset.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Enter your digital signature:
              </label>
              <Input
                placeholder="Enter your signature (min. 10 characters)"
                value={signature ?? ""}
                onChange={(e) => setSignature(e.target.value)}
                className="font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={handleSignature}
                >
                  Verify Signature
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    toast.info(
                      "Signature request sent to your registered email address"
                    );
                  }}
                >
                  <Send size={16} />
                  Email Me My Signature
                </Button>
              </div>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6 mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Step 3: Set Price & Review
              </h3>
              <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                Final Step
              </span>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Select the percentage of shares to sell:
              </label>

              <select
                value={sharePercentage}
                onChange={(e) => setSharePercentage(Number(e.target.value))}
                className="w-full p-2 rounded border border-gray-300 bg-white text-sm"
              >
                {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map(
                  (percent) => (
                    <option key={percent} value={percent}>
                      {percent}%
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Set your listing price (₹):
                </label>
                <Input
                  type="number"
                  placeholder="Enter listing price in INR"
                  value={price}
                  onChange={(e) => {
                    const inputVal = Number(e.target.value);
                    const maxAllowedPrice =
                      (property.investedAmount * 5 * sharePercentage) / 100;
                    if (inputVal < maxAllowedPrice) {
                      setPrice(e.target.value);
                    } else {
                      setPrice(String(maxAllowedPrice));
                      toast.error(
                        `You cannot list above ₹${maxAllowedPrice.toLocaleString()}`
                      );
                    }
                  }}
                  className="text-lg"
                />
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Listing Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property:</span>
                    <span className="font-medium">{property.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ownership Percentage:</span>
                    <span className="font-medium">{property.ownership}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Value:</span>
                    <span className="font-medium">
                      ₹{property.investedAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-800 font-medium">
                      Listing Price:
                    </span>
                    <span className="font-bold text-blue-600">
                      {price ? `₹${parseInt(price).toLocaleString()}` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Platform Fee (2%):</span>
                    <span>
                      {price
                        ? `₹${(parseInt(price) * 0.02).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={handleListForSale}
                >
                  List NFT for Sale
                </Button>
                <Button
                  variant="outline"
                  className="flex-shrink-0"
                  onClick={() => setStep("signature")}
                >
                  <ArrowLeft size={16} />
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By listing this NFT, you agree to our marketplace terms and
                conditions. Once listed, your NFT will be visible to all
                potential buyers.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto mt-6 mb-10"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,242,255,0.9) 100%)",
        borderRadius: "16px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
      }}
    >
      {/* Header with breadcrumb */}
      <div className="p-4 flex items-center text-sm text-gray-600">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft size={16} />
        </Button>
        <span>Portfolio</span>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-900">Sell NFT</span>
      </div>

      <div className="p-6 flex flex-col lg:flex-row gap-8">
        {/* Left Side - Image & Property Details */}
        <div className="w-full lg:w-2/5 space-y-6">
          <div
            className="relative rounded-2xl overflow-hidden border-8 border-white shadow-xl"
            style={{ aspectRatio: "2/1" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm py-1 px-3 rounded-full">
              <span className="text-white text-xs font-medium">
                NFT #{property.id}
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {property.title}
            </h1>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {property.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Investment
              </span>
              <div className="text-xl font-bold mt-1">
                ₹{property.investedAmount.toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Ownership
              </span>
              <div className="text-xl font-bold mt-1">
                {property.ownership}%
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Annual Returns
              </span>
              <div className="text-xl font-bold mt-1 text-green-600">
                ₹{property.returns.toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Purchased On
              </span>
              <div className="text-lg font-bold mt-1">
                {new Date(property.purchaseDate).toLocaleDateString("en-GB")}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Token & Actions */}
        <div className="w-full lg:w-3/5">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Sell Your Property NFT</h2>
            <p className="text-gray-600 mt-1">
              Complete the following steps to list your property token on our
              marketplace.
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex mb-4">
            <div
              className={`flex-1 text-center ${step === "token"
                ? "text-blue-600"
                : step === "signature" || step === "review"
                  ? "text-green-600"
                  : "text-gray-400"
                }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${step === "token"
                  ? "border-blue-600 bg-blue-50"
                  : step === "signature" || step === "review"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300"
                  }`}
              >
                {step === "signature" || step === "review" ? (
                  <CheckCircle size={16} />
                ) : (
                  "1"
                )}
              </div>
              <span className="text-xs mt-1 block">Verify Token</span>
            </div>
            <div
              className={`flex-1 text-center ${step === "signature"
                ? "text-blue-600"
                : step === "review"
                  ? "text-green-600"
                  : "text-gray-400"
                }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${step === "signature"
                  ? "border-blue-600 bg-blue-50"
                  : step === "review"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300"
                  }`}
              >
                {step === "review" ? <CheckCircle size={16} /> : "2"}
              </div>
              <span className="text-xs mt-1 block">Signature</span>
            </div>
            <div
              className={`flex-1 text-center ${step === "review" ? "text-blue-600" : "text-gray-400"
                }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${step === "review"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
                  }`}
              >
                3
              </div>
              <span className="text-xs mt-1 block">List NFT</span>
            </div>
          </div>

          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default SellNFTPage;
