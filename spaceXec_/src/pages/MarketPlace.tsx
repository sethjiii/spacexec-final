import { useState, useEffect, useRef } from "react";
import { FaEye, FaRupeeSign } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function LuxuryPropertyMarketplace() {
  const catalogRef = useRef(null); // Create a ref
  const navigate = useNavigate();

  // State for properties data
  const [nfts, setNft] = useState([]);
  const [userId, setUserId] = useState("");
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [trendingProperties, setTrendingProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // State for UI controls
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const scrollToCatalog = () => {
    const element = catalogRef.current;
    if (!element) return;

    const yOffset = -100;
    const targetY =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const duration = 1000; // in ms
    const startTime = performance.now();

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easing = easeInOutQuad(progress);

      window.scrollTo(0, startY + distance * easing);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Fetch data from backend
  useEffect(() => {
    const id = localStorage.getItem("_id");
    setUserId(id);

    const fetchNft = async () => {
      setIsLoading(true);
      try {
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : "http://localhost:5000";

        const allRes = await fetch(`${baseUrl}/api/properties/getmarketplace`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!allRes.ok) {
          throw new Error("Failed to fetch all nfts");
        }

        const allData = await allRes.json();
        console.log(allData.listings);
        setNft(allData.listings);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
        const demo = getDemoProperties();
        setNft(demo);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNft();
  }, []);

  // Filter properties based on search and filter criteria
  const filteredProperties = nfts.filter((nft) => {
    // Check if `property` exists and has the necessary properties
    const name = nft.propertyId?.name ? nft.propertyId.name.toLowerCase() : "";
    const location = nft.propertyId?.location
      ? nft.propertyId.location.toLowerCase()
      : "";
    const type = nft.propertyId?.type;
    // console.log(nft.propertyId
    // );
    // console.log(name)
    // console.log(location)
    // console.log(type)

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase());

    const matchesType = filterType ? type === filterType : true;

    // console.log(matchesType)

    return matchesSearch && matchesType;
  });

  //   console.log(filteredProperties)

  // Get properties based on active tab
  const getDisplayProperties = () => {
    switch (activeTab) {
      case "featured":
        return featuredProperties;
      case "trending":
        return trendingProperties;
      case "all":
        console.log(filteredProperties);
      default:
        console.log("filteredProperties");
        return filteredProperties;
    }
  };

  // Format currency numbers
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // View property details
  const viewPropertyDetails = (property) => {
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  };

  // Demo data fallback function
  const getDemoProperties = () => {
    return [
      {
        id: "1",
        name: "Royal Terrace Residence",
        location: "Beverly Hills, CA",
        type: "Residential",
        price: 2500000,
        yield: 5.8,
        sharesAvailable: 85,
        pricePerShare: 25000,
        image: "/api/placeholder/400/300",
        description:
          "Exquisite mansion with panoramic views of the city and ocean.",
      },
      {
        id: "2",
        name: "Diamond Tower Office",
        location: "Manhattan, NY",
        type: "Commercial",
        price: 4200000,
        yield: 6.2,
        sharesAvailable: 120,
        pricePerShare: 35000,
        image: "/api/placeholder/400/300",
        description:
          "Premium office space in the heart of the financial district.",
      },
      {
        id: "3",
        name: "Sapphire Bay Resort",
        location: "Miami Beach, FL",
        type: "Vacation",
        price: 3800000,
        yield: 7.5,
        sharesAvailable: 95,
        pricePerShare: 40000,
        image: "/api/placeholder/400/300",
        description:
          "Beachfront luxury resort with private access and full amenities.",
      },
      {
        id: "4",
        name: "Emerald Heights Complex",
        location: "Seattle, WA",
        type: "Residential",
        price: 1800000,
        yield: 5.2,
        sharesAvailable: 60,
        pricePerShare: 30000,
        image: "/api/placeholder/400/300",
        description:
          "Modern apartment complex with sustainable features and city views.",
      },
      {
        id: "5",
        name: "Imperial Business Plaza",
        location: "Chicago, IL",
        type: "Commercial",
        price: 5600000,
        yield: 6.8,
        sharesAvailable: 140,
        pricePerShare: 40000,
        image: "/api/placeholder/400/300",
        description:
          "Prestigious commercial property in prime business district location.",
      },
      {
        id: "6",
        name: "Golden Sands Villa",
        location: "Maui, HI",
        type: "Vacation",
        price: 4500000,
        yield: 8.1,
        sharesAvailable: 110,
        pricePerShare: 45000,
        image: "/api/placeholder/400/300",
        description:
          "Exclusive beachfront villa with infinity pool and private gardens.",
      },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Elegant Header with Gold Accents */}

      {/* Hero Section */}
      <section className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 flex flex-col justify-between">
        <div className="max-w-7xl mx-auto px-4 flex-1">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-300 text-transparent bg-clip-text">
                Own Shares in Exclusive Properties
              </h2>
              <p className="text-lg mb-6">
                Invest in high-yield real estate assets through secure NFT
                ownership. Diversify your portfolio with premium properties
                worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-800 border border-yellow-500 rounded-lg p-4 flex-1">
                  <p className="text-yellow-300 text-sm">
                    Average Annual Yield
                  </p>
                  <p className="text-2xl font-bold">6.8%</p>
                </div>
                <div className="bg-gray-800 border border-yellow-500 rounded-lg p-4 flex-1">
                  <p className="text-yellow-300 text-sm">Properties Listed</p>
                  <p className="text-2xl font-bold">180+</p>
                </div>
                <div className="bg-gray-800 border border-yellow-500 rounded-lg p-4 flex-1">
                  <p className="text-yellow-300 text-sm">Investors</p>
                  <p className="text-2xl font-bold">5,400+</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 lg:pl-12">
              <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-yellow-500">
                <img
                  src="/image.png"
                  alt="Luxury Property"
                  className="w-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <p className="text-xl font-bold text-white">
                    Featured: Golden Gate Mansion
                  </p>
                  <p className="text-yellow-300">
                    San Francisco, CA • 8.2% Yield
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer inside section */}
        <header className="w-full bg-gradient-to-r from-yellow-800 via-yellow-700 to-yellow-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-3xl font-serif font-bold text-white">
                  <span className="text-gray-100">
                    Space<span className="text-red-600">X</span>ec
                  </span>{" "}
                  MarketPlace
                </h1>
                <p className="text-yellow-100 text-sm mt-1">
                  Premium Real Estate NFT Marketplace
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded border-2 border-yellow-300 shadow-md transition-all"
                  onClick={scrollToCatalog}
                >
                  Browse Catalog
                </button>
                <Link
                  to={`/dashboard/${userId}`}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-yellow-300 font-medium rounded border-2 border-yellow-500 shadow-md transition-all inline-block text-center"
                >
                  Investment Portfolio
                </Link>
              </div>
            </div>
          </div>
        </header>
      </section>

      {/* Main Marketplace Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Filtering Controls */}
        <div className="bg-white rounded-lg shadow-md mb-8 p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4 md:mb-0">
              Property Marketplace
            </h2>
            <div className="flex flex-wrap gap-2">
              {["all", "featured", "trending"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md font-medium ${
                    activeTab === tab
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={catalogRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Properties
              </label>
              <input
                type="text"
                placeholder="Name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">All Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Vacation">Vacation</option>
                <option value="type A">Type A</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="yield-desc">Yield: High to Low</option>
                <option value="newest">Newest Listings</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8   border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading premium properties...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            Failed to load properties.
          </div>
        ) : getDisplayProperties().length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">
              No properties found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {getDisplayProperties().map((nft) => (
              <div
                key={nft._id}
                className="overflow-hidden  shadow-lg transform transition duration-300 hover:scale-105 "
              >
                <div className="bg-white overflow-hidden ">
                  {/* Image Section */}
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={nft.propertyId.images?.[0]}
                      alt={nft.propertyId.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 font-medium text-xs rounded-bl-md">
                      {nft.propertyId.type || "NFT Type"}
                    </div>
                    <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-yellow-300 px-3 py-1 font-medium text-xs flex items-center">
                      <span>{nft.propertyId.return?.total}% Return</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    {/* Property Name */}
                    <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
                      {nft.propertyId.name}
                    </h3>

                    {/* Property Location */}
                    <p className="text-gray-600 mb-2 text-sm">
                      {nft.propertyId.location}
                    </p>

                    {/* NFT ID */}
                    <p className="text-sm text-gray-700 mb-3 italic font-mono">
                      NFT ID: {nft.nftTokenId.slice(0, 30)}...
                    </p>

                    {/* Pricing & Share Information */}
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                      <span className="flex items-center font-bold text-xl text-gray-800">
                        <FaRupeeSign className="mr-1" />
                        {nft.listingPrice}
                      </span>
                      <span className="flex items-center text-sm text-gray-600">
                        <FaRupeeSign className="mr-1" />
                        {parseFloat(nft.pricePerShare).toFixed(2)} / share
                      </span>
                    </div>

                    {/* Investment Details */}
                    <div className="mb-6 space-y-4 text-sm text-gray-600">
                      {/* Available Shares */}
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">
                          Available Shares:
                        </p>
                        <span className="text-gray-700 font-semibold">
                          {nft.shareCount || 3}
                        </span>
                      </div>

                      {/* Investment Term */}
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">
                          Investment Term:
                        </p>
                        <span className="text-gray-700 font-semibold">
                          {nft.propertyId.offeringDetails?.investmentTerm} yrs
                        </span>
                      </div>

                      {/* Expected Rental Yield */}
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">
                          Expected Rental Yield:
                        </p>
                        <span className="text-gray-700 font-semibold">
                          {nft.propertyId.return?.rental}%
                        </span>
                      </div>

                      {/* Appreciation */}
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">
                          Appreciation:
                        </p>
                        <span className="text-gray-700 font-semibold">
                          {nft.propertyId.return?.appreciation}%
                        </span>
                      </div>
                    </div>

                    {/* View NFT Button */}
                    <button
                      onClick={() => viewPropertyDetails(nft)}
                      className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium  shadow-2xl transition-all"
                    >
                      View NFT Investment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Investment Stats Section */}
      {/* <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-gray-800">
            Investment Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-800 text-white p-4">
                <h3 className="font-bold text-xl">
                  Historical Returns by Property Type
                </h3>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-100 flex items-center justify-center">
                  [Chart Placeholder: Historical Returns]
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-bold text-xl text-yellow-600">
                      8.2%
                    </div>
                    <div className="text-sm text-gray-600">Vacation</div>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-yellow-600">
                      6.5%
                    </div>
                    <div className="text-sm text-gray-600">Commercial</div>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-yellow-600">
                      5.8%
                    </div>
                    <div className="text-sm text-gray-600">Residential</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-800 text-white p-4">
                <h3 className="font-bold text-xl">Top Performing Regions</h3>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-100 flex items-center justify-center">
                  [Map Visualization Placeholder]
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Miami, FL</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">+9.2%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Austin, TX</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: "87%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">+8.7%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">San Diego, CA</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">+7.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-gray-800">
            How Space<span className="text-red-600">X</span>ec Property
            Investments Works?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10 4a1 1 0 011 1v4.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V5a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">1. Browse Properties</h3>
              <p className="text-gray-600">
                Explore our curated selection of high-value properties with
                detailed financial information and investment potential.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H6z"
                    clipRule="evenodd"
                  />
                  <path d="M8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">2. Purchase NFT Shares</h3>
              <p className="text-gray-600">
                Buy fractional ownership through secure, blockchain-based NFTs
                representing your stake in the property.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">3. Earn Returns</h3>
              <p className="text-gray-600">
                Receive regular rental income distributions and benefit from
                property value appreciation over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details Modal */}
      {isDetailsModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-70"
            onClick={() => setIsDetailsModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center p-4 z-10">
              <h3 className="text-2xl font-serif font-bold">
                NFT: {selectedProperty.propertyId.name}
              </h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Panel */}
                <div>
                  <div className="mb-6 rounded-lg overflow-hidden border-4 ">
                    <img
                      src={selectedProperty.propertyId.images[0]}
                      alt={selectedProperty.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-lg mb-2">NFT Overview</h4>
                    <p className="text-gray-700 mb-4 max-w-80">
                      {selectedProperty.propertyId.description}
                    </p>
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <div className="text-gray-500">Location</div>
                        <div className="font-medium">
                          {selectedProperty.propertyId.location}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Value</div>
                        <div className="flex items-center font-medium">
                          <FaRupeeSign />
                          {selectedProperty.listingPrice}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Shares Count</div>
                        <div className="flex items-center font-medium">
                          {selectedProperty.shareCount || 3}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500">Platform Fee</div>
                        <div className="flex items-center font-medium">
                          {selectedProperty.royalties || 3}%
                        </div>
                      </div>
                    </div>
                    <div className="pt-5">
                      <div className="text-gray-500">Token ID</div>
                      <div className="font-medium break-all">
                        {selectedProperty.nftTokenId}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-lg mb-2">
                      StakeHolders Overview
                    </h4>

                    <div className="grid grid-cols-2 gap-4 pr-4 text-sm">
                      <div>
                        <div className="text-gray-500">Seller Name</div>
                        <div className="font-medium">
                          {selectedProperty.sellerId.name}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Listed At</div>
                        <div className="flex items-center font-medium">
                          {new Date(
                            selectedProperty.updatedAt
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Vendor name</div>
                        <div className="flex items-center font-medium">
                          {selectedProperty.propertyId.vendorInfo.name || 3}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500">Vendor email</div>
                        <div className="flex items-center font-medium">
                          {selectedProperty.propertyId.vendorInfo.email || 3}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div>
                  <div className="bg-gray-800 text-white p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-lg mb-4">
                      Investment Details
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span>Share Price:</span>
                        <span className="font-bold">
                          {formatCurrency(selectedProperty.listingPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available Shares:</span>
                        <span className="font-bold">
                          {selectedProperty.shareCount || 3}
                        </span>
                      </div>
                    </div>
                    <button 
                    className="w-full mt-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold  shadow-md"
                    onClick={() => {
                      navigate('/marketplace/buy', { state: { property: selectedProperty} });
                    }}
                    >
                      Purchase NFT Shares
                    </button>
                  </div>

                  {/* <div className="bg-gray-100 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-4">
                      Performance Projection
                    </h4>
                    <div className="h-40 bg-white border border-gray-200 rounded mb-4 flex items-center justify-center text-gray-400">
                      [Performance Chart Placeholder]
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="text-gray-500">1 Year</div>
                        <div className="font-bold text-green-600">
                          +{(selectedProperty.yield - 0.2).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">3 Years</div>
                        <div className="font-bold text-green-600">
                          +{(selectedProperty.yield + 2.5).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">5 Years</div>
                        <div className="font-bold text-green-600">
                          +{(selectedProperty.yield + 8.7).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div> */}

                  <div className="mt-6">
                    <h5 className="font-semibold mb-2 text-sm text-gray-700">
                      Amenities
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {selectedProperty.propertyId.amenities?.length > 0 ? (
                        selectedProperty.propertyId.amenities.map(
                          (amenity, index) => (
                            <div
                              key={index}
                              className="bg-white border border-gray-200 p-2 rounded text-gray-700 shadow-sm"
                            >
                              {amenity}
                            </div>
                          )
                        )
                      ) : (
                        <div className="text-gray-500 text-sm">
                          No amenities listed.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h5 className="font-semibold mb-2 text-sm text-gray-700">
                      Current Owners
                    </h5>
                    <div className="space-y-3">
                      {selectedProperty.propertyId.owners?.length > 0 ? (
                        selectedProperty.propertyId.owners.map(
                          (owner, index) => (
                            <div
                              key={owner._id || index}
                              className="bg-white p-3 rounded shadow-sm text-sm border border-gray-200"
                            >
                              <div className="font-medium text-gray-800">
                                {owner.userId?.name || "Unnamed Owner"}
                              </div>
                              <div className="text-gray-600 text-xs">
                                {owner.userId?.email || "No email"}
                              </div>
                              <div className="text-gray-500 text-sm mt-1">
                                Share:{" "}
                                <span className="font-semibold">
                                  {owner.sharePercentage?.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="text-gray-500 text-sm">
                          No previous owners found.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h5 className="font-semibold mb-2 text-sm text-gray-700">
                      Property Location
                    </h5>
                    <div className="rounded-lg overflow-hidden shadow border border-gray-200 h-44">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          selectedProperty.propertyId.location
                        )}&output=embed`}
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h5 className="font-semibold mb-2 text-sm text-gray-700">
                      View Property Details
                    </h5>
                    <Link
                      to={`/property/${selectedProperty.propertyId._id}`}
                      className="flex items-center justify-center gap-2 w-full bg-gray-100 px-4 py-3 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-200 transition text-sm font-medium text-gray-700"
                    >
                      <FaEye className="text-gray-600" />
                      View Full Property Page
                    </Link>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">
                      Important Notice
                    </h4>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        NFT-based real estate investments carry risks including
                        market volatility, illiquidity, and no guaranteed
                        returns. Please review full terms before purchasing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 mr-4 hover:bg-gray-100"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-md shadow-md">
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
