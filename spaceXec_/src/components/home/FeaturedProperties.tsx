
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from '@/components/ui/PropertyCard';

// Sample property data
const sampleProperties = [
  {
    id: "1",
    title: "Luxury Apartment in South Delhi",
    location: "Green Park, Delhi",
    price: 15000000,
    yield: 14.5,
    minInvestment: 25000,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    type: "Residential",
    area: 1250,
    investors: 127,
    funded: 78,
  },
  {
    id: "2",
    title: "Commercial Space in Cyber City",
    location: "Gurugram, Haryana",
    price: 27500000,
    yield: 16.2,
    minInvestment: 50000,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
    type: "Commercial",
    area: 2100,
    investors: 89,
    funded: 62,
  },
  {
    id: "3",
    title: "Premium Villa in Koramangala",
    location: "Bengaluru, Karnataka",
    price: 35000000,
    yield: 12.8,
    minInvestment: 100000,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    type: "Residential",
    area: 3500,
    investors: 215,
    funded: 91,
  },
  {
    id: "4",
    title: "Retail Space in Phoenix Mall",
    location: "Mumbai, Maharashtra",
    price: 18900000,
    yield: 15.6,
    minInvestment: 40000,
    image: "https://images.unsplash.com/photo-1565402170291-8491f14678db?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    type: "Commercial",
    area: 1800,
    investors: 156,
    funded: 84,
  },
  {
    id: "5",
    title: "Vacation Home in Shimla",
    location: "Shimla, Himachal Pradesh",
    price: 12500000,
    yield: 13.2,
    minInvestment: 20000,
    image: "https://images.unsplash.com/photo-1559767949-0faa5c7e9992?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    type: "Vacation",
    area: 1650,
    investors: 98,
    funded: 45,
  },
  {
    id: "6",
    title: "Office Space in HiTech City",
    location: "Hyderabad, Telangana",
    price: 22800000,
    yield: 14.8,
    minInvestment: 35000,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    type: "Commercial",
    area: 2350,
    investors: 132,
    funded: 71,
  },
];

const FeaturedProperties = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;

  const filteredProperties = activeCategory === 'all' 
    ? sampleProperties 
    : sampleProperties.filter(property => property.type.toLowerCase() === activeCategory.toLowerCase());

  const displayedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const nextProperties = () => {
    if (startIndex + itemsPerPage < filteredProperties.length) {
      setStartIndex(startIndex + itemsPerPage);
    } else {
      setStartIndex(0);
    }
  };

  const prevProperties = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    } else {
      setStartIndex(Math.max(0, filteredProperties.length - itemsPerPage));
    }
  };

  const categories = [
    { id: 'all', label: 'All Properties' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'vacation', label: 'Vacation' },
  ];

  return (
    <section id="featured-properties" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            Discover curated investment opportunities across various property types and locations
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex justify-center gap-2 animate-fade-in animation-delay-100">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setStartIndex(0);
              }}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Property Grid with Navigation */}
        <div className="mt-12 animate-fade-in animation-delay-200">
          <div className="relative">
            {/* Navigation buttons */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={prevProperties}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
                disabled={filteredProperties.length <= itemsPerPage}
                aria-label="Previous properties"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  className="animate-scale-in"
                />
              ))}
            </div>
            
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={nextProperties}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
                disabled={filteredProperties.length <= itemsPerPage}
                aria-label="Next properties"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
        
        {/* View All Button */}
        <div className="mt-12 text-center animate-fade-in animation-delay-300">
          <a
            href="/properties"
            className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 border border-gray-200"
          >
            View All Properties
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
