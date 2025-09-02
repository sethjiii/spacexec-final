import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Share2, MapPin } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Owner {
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  sharePercentage: number;
}

interface PropertyCardProps {
  _id: string;
  name: string;
  location: string;
  description: string;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  totalValue: number;
  owners: Owner[];
  images: string[];
  status: string;
  className?: string;
  propertyId: string;
}

const PropertyCard = ({
  _id,
  name,
  location,
  totalShares,
  availableShares,
  pricePerShare,
  totalValue,
  owners,
  images,
  status,
  className = "",
  propertyId,
}: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const userId = localStorage.getItem("_id");
      if (!userId) {
        toast.warning("Please log in to manage your wishlist.");
        return;
      }

      const isAdding = !isFavorite; // Determine action
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const token = localStorage.getItem("token"); // JWT from login

      const response = await fetch(
        `${baseUrl}/api/properties/togglewishlist/${propertyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ add token
          },
          body: JSON.stringify({ userId, isAdding }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update wishlist");
      }

      setIsFavorite(isAdding); // Update UI state
      toast.success(
        isAdding ? "Added to Wishlist! 🎉" : "Removed from Wishlist. ❌"
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const shareProperty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Share functionality would go here
    if (navigator.share) {
      navigator
        .share({
          title: PropertyCard?.name,
          text: `Check out this amazing property: ${PropertyCard?.name}`,
          url: window.location.href + `/${_id}`,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Property link copied to clipboard!");
      });
    }
  };

  return (
    <Link to={`/property/${_id}`} className={`group block ${className}`}>
      <div className="overflow-hidden  w-auto bg-white shadow-md transition-all duration-300 hover:shadow-xl">
        {/* Property Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={images[0] || "https://via.placeholder.com/300"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={(e) => toggleFavorite(e, _id)}
              className={`flex h-8 w-8 items-center justify-center rounded-full 
    ${isFavorite ? "bg-white text-white" : "bg-white/90 text-gray-700"} 
    shadow-sm transition-colors hover:bg-red-600 hover:text-white`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>

            <button
              onClick={shareProperty}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
              aria-label="Share property"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Property Status Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className={`text-xs font-medium ${
                status === "active" ? "bg-green-500 text-white" : "bg-gray-400"
              }`}
            >
              {status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Property Info */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                {name}
              </h3>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <MapPin className="mr-1 h-3 w-3" />
                <span>{location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                ₹{totalValue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Value</p>
            </div>
          </div>

          {/* Property Details */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-gray-50 px-2 py-1.5">
              <p className="text-xs font-medium text-gray-900">
                ₹{pricePerShare.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Price Per Share</p>
            </div>
            <div className="rounded-md bg-gray-50 px-2 py-1.5">
              <p className="text-xs font-medium text-gray-900">{totalShares}</p>
              <p className="text-xs text-gray-500">Total Shares</p>
            </div>
            <div className="rounded-md bg-gray-50 px-2 py-1.5">
              <p className="text-xs font-medium text-gray-900">
                {availableShares}
              </p>
              <p className="text-xs text-gray-500">Available Shares</p>
            </div>
          </div>
        </div>
        <Link
          to={`/property/${_id}`}
          className="w-full mt-1 justify-center gap-2 flex items-center px-4 py-2 text-gray-800 bg-blue-400 hover:bg-blue-500"
        >
          Invest Now
        </Link>
      </div>
    </Link>
  );
};

export default PropertyCard;
