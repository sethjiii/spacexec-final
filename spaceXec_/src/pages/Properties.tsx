import LazyLoad from "react-lazyload";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/ui/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Comprehensive Property Type Definition
type Property = {
  propertyId: string;
  _id: string;
  name: string;
  title: string;
  location: string;
  description: string;
  type: string;
  price: number;
  yield: number;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  totalValue: number;

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
    expectedRentalYield: number;
    expectedAppreciation: number;
    projectedReturn: number;
  };
  vendorInfo: {
    name: string;
    phone: string;
    email: string;
  };
  offeringDetails: {
    minInvestment: number;
    maxInvestment: number;
    investmentTerm: number;
    exitOptions: string[];
  };

  owners: {
    userId: {
      _id: string;
      name: string;
      email: string;
    };
    sharePercentage: number;
    _id: string;
  }[];
  transactions: string[];
  images: string[];
  documents: string[];
  status: string;

  // Additional optional fields
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  fundingGoal?: number;
  fundingRaised?: number;
  legalInfo?: string;
  riskFactors?: string[];

  createdAt: string;
  updatedAt: string;
};

const Properties = () => {
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000000]); // 0 to 5cr
  const [yieldRange, setYieldRange] = useState([0, 20]); // 0 to 20%
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("latest");

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : "http://localhost:5000";
        const token = localStorage.getItem("token");

        const response = await fetch(`${baseUrl}/api/properties/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Parse query parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");

    if (typeParam) {
      setSelectedTypes([typeParam]);
      setActiveFilters([`Type: ${typeParam}`]);
    }
  }, [location.search]);

  // Apply filters and sorting
  useEffect(() => {
    let result = properties;

    // Search filter
    if (searchValue) {
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          property.location.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Price range filter
    result = result.filter(
      (property) =>
        property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Yield range filter
    result = result.filter(
      (property) =>
        property.yield >= yieldRange[0] && property.yield <= yieldRange[1]
    );

    // Property type filter
    if (selectedTypes.length > 0) {
      result = result.filter((property) =>
        selectedTypes.includes(property.type)
      );
    }

    // Sorting
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "yield-high-low":
        result.sort((a, b) => b.yield - a.yield);
        break;
      default: // latest
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setFilteredProperties(result);

    // Update active filters
    const newActiveFilters = [];
    if (priceRange[0] !== 0 || priceRange[1] !== 50000000) {
      newActiveFilters.push(
        `Price: ₹${(priceRange[0] / 1000).toFixed(1)}K - ₹${(
          priceRange[1] / 1000
        ).toFixed(1)}K`
      );
    }
    if (yieldRange[0] !== 0 || yieldRange[1] !== 20) {
      newActiveFilters.push(`Yield: ${yieldRange[0]}% - ${yieldRange[1]}%`);
    }
    if (selectedTypes.length > 0) {
      newActiveFilters.push(`Type: ${selectedTypes.join(", ")}`);
    }
    setActiveFilters(newActiveFilters);
  }, [
    searchValue,
    priceRange,
    yieldRange,
    selectedTypes,
    properties,
    sortOption,
  ]);

  const togglePropertyType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setSearchValue("");
    setPriceRange([0, 50000000]);
    setYieldRange([0, 20]);
    setSelectedTypes([]);
    setActiveFilters([]);
    setSortOption("latest");
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Type:")) {
      const type = filter.replace("Type: ", "");
      setSelectedTypes((prev) => prev.filter((t) => t !== type));
    } else if (filter.startsWith("Price:")) {
      setPriceRange([800000, 1200000]);
    } else if (filter.startsWith("Yield:")) {
      setYieldRange([6, 9]);
    }
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#B38F6F]/30 border-t-[#710014] rounded-full animate-spin mb-4"></div>
          <p className="text-[#B38F6F]">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#710014]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F1ED]">
      {/* Page header */}
      <div className="pt-16 pb-8 md:pt-20 md:pb-12 bg-[#F2F1ED]">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-light text-[#161616] mb-2">
            Global Property 
            <span className="block font-medium text-[#710014]">Investments</span>
          </h1>
          <p className="text-sm md:text-base text-[#B38F6F]">
            Discover premium investment properties across international markets
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white border-y border-[#B38F6F]/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-[#B38F6F]" />
              <input
                placeholder="Search by location or property name..."
                className="w-full pl-10 pr-4 py-2 md:py-2.5 border border-[#B38F6F]/30 rounded-md focus:ring-2 focus:ring-[#710014] focus:border-[#710014] text-sm text-[#161616]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            {/* Filter button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[#B38F6F]/30 text-[#161616] hover:bg-[#F2F1ED] rounded-md transition-colors text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-[#B38F6F]">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#710014]/10 text-[#710014] text-xs rounded border border-[#710014]/20"
                >
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-1 hover:bg-[#710014]/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="ml-2 text-sm text-[#710014] hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Expanded filter panel */}
          {isFilterOpen && (
            <div className="mt-4 rounded-lg border border-[#B38F6F]/20 bg-[#F2F1ED] p-4 md:p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price range */}
                <div>
                  <h3 className="font-medium text-[#161616] mb-3 text-sm">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="500000"
                      max="1500000"
                      step="50000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-[#B38F6F]/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-[#B38F6F]">
                      <span>₹{(priceRange[0] / 1000).toFixed(1)}K</span>
                      <span>₹{(priceRange[1] / 1000).toFixed(1)}K</span>
                    </div>
                  </div>
                </div>

                {/* Yield range */}
                <div>
                  <h3 className="font-medium text-[#161616] mb-3 text-sm">
                    Yield Range
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="5"
                      max="10"
                      step="0.5"
                      value={yieldRange[0]}
                      onChange={(e) => setYieldRange([parseFloat(e.target.value), yieldRange[1]])}
                      className="w-full h-2 bg-[#B38F6F]/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-[#B38F6F]">
                      <span>{yieldRange[0]}%</span>
                      <span>{yieldRange[1]}%</span>
                    </div>
                  </div>
                </div>

                {/* Property type */}
                <div>
                  <h3 className="font-medium text-[#161616] mb-3 text-sm">
                    Property Type
                  </h3>
                  <div className="space-y-2">
                    {["Residential", "Commercial", "Vacation Rental"].map(
                      (type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`filter-${type}`}
                            checked={selectedTypes.includes(type)}
                            onChange={() => togglePropertyType(type)}
                            className="rounded border-[#B38F6F]/30 text-[#710014] focus:ring-[#710014]"
                          />
                          <label htmlFor={`filter-${type}`} className="text-sm text-[#161616]">
                            {type}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm border border-[#B38F6F]/30 text-[#161616] hover:bg-white rounded transition-colors"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-4 py-2 text-sm bg-[#710014] text-[#F2F1ED] hover:bg-[#710014]/90 rounded transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[#B38F6F] text-sm">
            Showing{" "}
            <span className="font-medium text-[#161616]">{filteredProperties.length}</span>{" "}
            properties
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#B38F6F]">Sort by:</span>
            <select
              className="rounded-md border border-[#B38F6F]/30 text-sm focus:border-[#710014] focus:ring-[#710014] bg-white px-3 py-1 text-[#161616]"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="yield-high-low">Yield: High to Low</option>
            </select>
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              return (
                property.status === "active" && (
                  <LazyLoad
                    key={property._id}
                    height={200}
                    offset={100}
                    once
                    placeholder={
                      <div className="h-[300px] bg-[#B38F6F]/10 rounded-lg animate-pulse" />
                    }
                  >
                    <PropertyCard {...property} className="bg-white border border-[#B38F6F]/20 hover:border-[#710014]/30 transition-colors" />
                  </LazyLoad>
                )
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto mb-4 h-16 w-16 text-[#B38F6F]">
              <MapPin className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-[#161616] mb-2">
              No properties found
            </h3>
            <p className="text-[#B38F6F] mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 border border-[#B38F6F]/30 text-[#161616] hover:bg-white rounded transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;