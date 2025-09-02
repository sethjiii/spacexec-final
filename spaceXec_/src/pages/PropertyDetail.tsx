import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  Share2,
  MapPin,
  ArrowRight,
  Calendar,
  Phone,
  DollarSign,
  BarChart3,
  Home,
  User,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// TypeScript interface for Property Data
interface PropertyData {
  _id: string;
  name: string;
  title: string;
  description: string;
  location: string;
  price: number;
  yield: number;
  minInvestment: number;
  images: string[];
  type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  return: {
    rental: number;
    appreciation: number;
    total: number;
  };
  financials: {
    propertyPrice: number;
    stampDuty: number;
    registrationFee: number;
    legalFee: number;
    totalInvestment: number;
    expectedRentalYield?: number;
    expectedAppreciation?: number;
    projectedReturn?: number;
  };
  documents: string[];
  fundingGoal: number;
  fundingRaised: number;
  vendorInfo: {
    name: string;
    phone: string;
    email: string;
  };
  legalInfo: string;
  riskFactors: string[];
  offeringDetails: {
    minInvestment: number;
    maxInvestment: number;
    investmentTerm: number;
    exitOptions: string[];
  };
}

const PropertyDetail = () => {
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(0);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : "http://localhost:5000";

        console.log(
          "Fetching property data from:",
          `${baseUrl}/api/properties/${id}`
        );

        const response = await fetch(`${baseUrl}/api/properties/${id}`);

        console.log("Fetch response status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch property data");
        }

        const data: PropertyData = await response.json();

        console.log("Fetched property data:", data);

        setPropertyData(data);

        // Set initial investment amount to minimum investment
        setInvestmentAmount(data.minInvestment);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching property data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const shareProperty = () => {
    // Share functionality would go here
    if (navigator.share) {
      navigator
        .share({
          title: propertyData?.title,
          text: `Check out this amazing property: ${propertyData?.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Property link copied to clipboard!");
      });
    }
  };

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!propertyData) return;

    const value = parseInt(e.target.value);
    if (
      value >= propertyData.minInvestment &&
      value <= propertyData.offeringDetails.maxInvestment
    ) {
      setInvestmentAmount(value);
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div className="text-center">
          <p className="text-2xl mb-4">Error Loading Property</p>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No property found</p>
      </div>
    );
  }

  const expectedReturns = (investmentAmount * propertyData.yield) / 100;

  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}

      {/* Property Header */}
      <div className="pt-24 pb-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-0"
                >
                  {propertyData.type}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-600 border-0"
                >
                  {propertyData.yield}% Yield
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {propertyData.title}
              </h1>
              <div className="mt-2 flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{propertyData.location}</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="text-right">
                <p className="text-sm text-gray-500">Property Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{propertyData.price}
                </p>
              </div>
              <div className="mt-4 flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFavorite}
                  className="flex items-center gap-1"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {/* {isFavorite ? 'Saved' : 'Save'} */}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareProperty}
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Gallery */}
      <div className="bg-gray-50 border-y border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <img
                  src={propertyData.images[activeImageIndex]}
                  alt={propertyData.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {propertyData.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`relative h-[190px] rounded-lg overflow-hidden cursor-pointer transition-opacity ${
                    index === activeImageIndex
                      ? "ring-2 ring-primary"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Property view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 3 && propertyData.images.length > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-white font-medium">
                        +{propertyData.images.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs
              defaultValue="overview"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Property Description
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {propertyData.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Property Details
                    </h3>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="flex flex-col rounded-md bg-gray-50 p-3">
                        <span className="text-sm text-gray-500">Area</span>
                        <div className="flex items-center mt-1">
                          <Home className="h-4 w-4 text-primary mr-1" />
                          <span className="font-medium">
                            {propertyData.area} sq.ft
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col rounded-md bg-gray-50 p-3">
                        <span className="text-sm text-gray-500">Bedrooms</span>
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 text-primary mr-1" />
                          <span className="font-medium">
                            {propertyData.bedrooms}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col rounded-md bg-gray-50 p-3">
                        <span className="text-sm text-gray-500">Bathrooms</span>
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 text-primary mr-1" />
                          <span className="font-medium">
                            {propertyData.bathrooms}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col rounded-md bg-gray-50 p-3">
                        <span className="text-sm text-gray-500">Type</span>
                        <div className="flex items-center mt-1">
                          <Home className="h-4 w-4 text-primary mr-1" />
                          <span className="font-medium">
                            {propertyData.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Amenities
                    </h3>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                      {propertyData.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h5 className="font-semibold mb-2 text-sm text-gray-700">
                      Property Location
                    </h5>
                    <div className=" overflow-hidden shadow border border-gray-700 h-72">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          propertyData.name + propertyData.location
                        )}&output=embed`}
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Investment Returns
                    </h3>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="rounded-md bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              Rental Yield
                            </p>
                            <p className="text-xl font-semibold text-gray-900">
                              {propertyData.return.rental}%
                            </p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              Appreciation
                            </p>
                            <p className="text-xl font-semibold text-gray-900">
                              {propertyData.return.appreciation}%
                            </p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md bg-primary/10 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              Total Returns
                            </p>
                            <p className="text-xl font-semibold text-primary">
                              {propertyData.return.total}%
                            </p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Financial Breakdown
                    </h3>
                    <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Property Price
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              ₹
                              {propertyData.financials.propertyPrice}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Stamp Duty
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              ₹
                              {propertyData.financials.stampDuty}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Registration Fee
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              ₹
                              {propertyData.financials.registrationFee}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Legal Fee
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              ₹
                              {propertyData.financials.legalFee}
                            </td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Total Investment
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              ₹
                              {propertyData.financials.totalInvestment}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Investment Projections
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div className="h-[250px] rounded-lg bg-gray-50 p-4 flex items-center justify-center">
                        <span className="text-gray-500">
                          Return projection chart would be displayed here
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        * These projections are based on historical data and
                        market analysis. Actual returns may vary.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Property Documents
                    </h3>
                    <p className="mt-2 text-gray-600">
                      All property documents have been verified by our legal
                      team. You can view or download them below.
                    </p>
                    <div className="mt-4 space-y-3">
                      {propertyData.documents.map((document, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-white"
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-700">{document}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary"
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="legal" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Legal Information
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {propertyData.legalInfo}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Risk Factors
                    </h3>
                    <div className="mt-4 space-y-3">
                      {propertyData.riskFactors.map((risk, index) => (
                        <div
                          key={index}
                          className="flex items-start p-3 rounded-md bg-gray-50"
                        >
                          <div className="h-5 w-5 text-red-500 mr-3">•</div>
                          <span className="text-gray-700">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Offering Details
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex flex-col rounded-md bg-gray-50 p-3">
                        <span className="text-sm text-gray-500">
                          Minimum Investment
                        </span>
                        <span className="font-medium">
                          ₹
                          {propertyData.offeringDetails.minInvestment}
                        </span>
                      </div>
                      <div className="flex flex-col rounded-md bg-gray-50 p-3">
                        <span className="text-sm text-gray-500">
                          Maximum Investment
                        </span>
                        <span className="font-medium">
                          ₹
                          {propertyData.offeringDetails.maxInvestment}
                        </span>
                      </div>
                      <div className="flex flex-col rounded-md bg-gray-50 p-3">
                        <span className="text-sm text-gray-500">
                          Investment Term
                        </span>
                        <span className="font-medium">
                          {propertyData.offeringDetails.investmentTerm} years
                        </span>
                      </div>
                      <div className="flex flex-col rounded-md bg-gray-50 p-3">
                        <span className="text-sm text-gray-500">
                          Exit Options
                        </span>
                        <span className="font-medium">
                          {propertyData.offeringDetails.exitOptions.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Investment Card */}
          <div>
  <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    
    {/* Simple descriptive text */}
    <p className="text-sm text-gray-600 mb-4">
      Explore this investment opportunity and take a step toward financial growth.
    </p>

    {/* Contact & Invest Buttons */}
    <div className="space-y-3">
      <Link
        to={`/invest/${propertyData._id}`}
        className="w-full justify-center gap-2 flex items-center px-4 py-2 text-gray-800 bg-yellow-200 hover:bg-gray-100"
      >
        Invest Now
      </Link>
      {/* <Link
        to={`tel:${propertyData.vendorInfo.phone}`}
        className="w-full justify-center gap-2 flex items-center px-4 py-2 text-gray-800 bg-yellow-200 hover:bg-gray-100"
      >
        <Phone className="h-4 w-4" />
        Contact vendor
      </Link> */}
    </div>
  </div>
</div>

        </div>
      </div>

      {/* Investment Dialog */}
      {/* <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invest in {propertyData.title}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Investment Amount (₹)
              </label>
              <input
                type="number"
                id="investmentAmount"
                value={investmentAmount}
                onChange={handleInvestmentChange}
                min={propertyData.minInvestment}
                max={propertyData.offeringDetails.maxInvestment}
                step={1000}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              <div className="mt-2 text-xs text-gray-500">
                Min: ₹{propertyData.minInvestment.toLocaleString()} | Max: ₹{propertyData.offeringDetails.maxInvestment.toLocaleString()}
              </div>
            </div>
            
            <div className="mt-6 rounded-md bg-gray-50 p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Investment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Investment Amount</span>
                  <span className="font-medium">₹{investmentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ownership Percentage</span>
                  <span className="font-medium">
                    {((investmentAmount / propertyData.price) * 100).toFixed(4)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                  <span className="text-gray-600">Expected Annual Returns</span>
                  <span className="font-medium text-primary">₹{expectedReturns.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-4">
                By proceeding, you agree to our Terms of Service and Privacy Policy.
              </p>
              
              <div className="space-y-3">
                <Button className="w-full">
                  Proceed to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setIsInvestDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* <Footer /> */}
    </div>
  );
};

export default PropertyDetail;
