import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { json } from "stream/consumers";


interface VendorInfo {
  // Define the structure for vendor information
  name: string;
  contact: string;
  email: string;
  address: string;
}

interface PropertyFormData {
  name: string;
  title: string;
  location: string;
  description: string;
  type: string;
  yield: number;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  totalValue: number;
  images: string[]; // Array of image URLs or base64 strings
  documents: {
    name: string;
    url?: string;
    type: string;
    content?: string | ArrayBuffer | null;
  }[];
  bedrooms: number;
  bathrooms: number;
  area: number; // Square footage or area of the property
  amenities: string[]; // Array of amenities (e.g., 'Pool', 'Gym')
  fundingGoal: number;
  fundingRaised: number;
  vendorInfo: VendorInfo;
  legalInfo: string; // Legal information regarding the property
  riskFactors: string[]; // Array of potential risks
  return: {
    rental: number,
    appreciation:number,
    total: number,
}, 
  financials: {
    propertyPrice: number; // Price of the property
    stampDuty: number; // Stamp duty fees
    registrationFee: number; // Registration fees
    legalFee: number; // Legal fees
    totalInvestment: number; // Total investment required
    expectedRentalYield: number; // Expected rental yield percentage (e.g., 6% or 0.06)
    expectedAppreciation: number; // Expected appreciation percentage (e.g., 5% or 0.05)
    projectedReturn: number; // Projected return based on investment
  };
  offeringDetails: {
    minInvestment: number; // Minimum investment required
    holdingPeriod: number; // Investment holding period in years
    distributionFrequency: string; // Frequency of distributions (e.g., 'Quarterly', 'Annually')
  };
}

type FormDataType = {
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[]; // Uploaded image URLs
  // other fields...
};

const AdminPropertyForm: React.FC = () => {
  // Initial form state
  const initialFormState: PropertyFormData = {
    name: "",
    title: "",
    location: "",
    description: "",
    type: "residential", // Default type for property
    yield: 0,
    totalShares: 100,
    availableShares: 100,
    pricePerShare: 0,
    totalValue: 0,
    images: [],
    documents: [], // Empty array to hold documents later
    bedrooms: 0,
    bathrooms: 0,
    area: 0, // Square footage or area of the property
    amenities: [], // Array for storing amenities (e.g., 'Pool', 'Gym')
    fundingGoal: 0,
    fundingRaised: 0,
    vendorInfo: {
      name: "",
      contact: "", // Assuming 'contact' instead of 'phone' for flexibility
      email: "",
      address: "", // Adding 'address' as a part of vendor info
    },
    legalInfo: "",
    riskFactors: [""], // Default empty string array for risk factors
    return: {
      rental: 0,
      appreciation:0,
      total: 0,// Including historical return as 0 initially
    },
    financials: {
      propertyPrice: 0, // Corrected to match the PropertyFormData structure
      stampDuty: 0,
      registrationFee: 0,
      legalFee: 0,
      totalInvestment: 0,
      expectedRentalYield: 0,
      expectedAppreciation: 0,
      projectedReturn: 0,
    },
    offeringDetails: {
      minInvestment: 0,
      holdingPeriod: 0,
      distributionFrequency: "monthly", // Default to 'monthly'
    },
  };
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormState);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [newAmenity, setNewAmenity] = useState<string>("");
  const [newRiskFactor, setNewRiskFactor] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(formData);
  }, [formData]);
  // Image preview state
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle text input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle number input changes
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    }
  };

  // Handle image uploads
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const res = await fetch(`${baseUrl}/api/properties/uploadimages`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...data.urls],
      }));
      console.log(formData);


      setImagePreviewUrls((prev) => [...prev, ...data.urls]);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleDocumentUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
  
      // Append files to FormData
      Array.from(e.target.files).forEach((file) => {
        formData.append("documents", file); // 'documents' should match the backend field
      });
  
      try {
        // Determine the base URL for the backend
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : "http://localhost:5000";
  
        // Make the POST request to upload the documents
        const response = await fetch(`${baseUrl}/api/properties/uploadpdfs`, {
          method: "POST",
          body: formData,
        });
  
        // Check if the response is OK
        if (!response.ok) {
          throw new Error("Failed to upload documents");
        }
  
        // Parse the JSON response
        const data = await response.json();
        // console.log(data)
  
        // Update the formData state with the document URLs
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, ...data.urls], // Assuming the response contains URLs of uploaded documents
        }));
        console.log(formData);
      } catch (error) {
        console.error("Document upload failed:", error);
      }
    }
  };
  

  // Add amenity
  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  // Remove amenity
  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  // Add risk factor
  const handleAddRiskFactor = () => {
    if (newRiskFactor.trim()) {
      setFormData((prev) => ({
        ...prev,
        riskFactors: [...prev.riskFactors, newRiskFactor.trim()],
      }));
      setNewRiskFactor("");
    }
  };

  // Remove risk factor
  const handleRemoveRiskFactor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      riskFactors: prev.riskFactors.filter((_, i) => i !== index),
    }));
  };

  // Remove document
  const handleRemoveDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate derived fields
  const calculateDerivedFields = () => {
    // Calculate price per share
    const pricePerShare = formData.financials.propertyPrice / formData.totalShares;
  
    // Calculate net operating income based on rental yield and property price
    const netOperatingIncome =
      (formData.financials.expectedRentalYield / 100) * formData.financials.propertyPrice;
  
    // Calculate cap rate
    const capRate =
      formData.financials.propertyPrice > 0
        ? (netOperatingIncome / formData.financials.propertyPrice) * 100
        : 0;
  
    // Update the formData state with calculated fields
    setFormData((prev) => ({
      ...prev,
      pricePerShare,
      financials: {
        ...prev.financials,
        netOperatingIncome,
        capRate,
      },
    }));
  };
  

  // Handle form submission

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication error. Please login again.");
        setLoading(false);
        return;
      }

     

      const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : "http://localhost:5000";

     

      const submitRes = await fetch(`${baseUrl}/api/properties/addbyadmin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify(formData),
      });

      const submitData = await submitRes.json();

      if (submitRes.status === 201) {
        toast.success("Property added successfully");
        setFormData(initialFormState); // Reset form
        setImageFiles([]); // Reset uploaded files
        setImagePreviewUrls([]); // Reset previews
        setUploadProgress(0);
      } else {
        toast.error(submitData.message || "Failed to add property");
      }
    } catch (error: any) {
      console.error("Error adding property:", error);
      toast.error("Failed to add property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>

      {/* Form tabs */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === "basic"
              ? "border-b-2 border-blue-500 font-medium"
              : ""
          }`}
          onClick={() => handleTabChange("basic")}
        >
          Basic Info
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "media"
              ? "border-b-2 border-blue-500 font-medium"
              : ""
          }`}
          onClick={() => handleTabChange("media")}
        >
          Media
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "features"
              ? "border-b-2 border-blue-500 font-medium"
              : ""
          }`}
          onClick={() => handleTabChange("features")}
        >
          Features & Amenities
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "financial"
              ? "border-b-2 border-blue-500 font-medium"
              : ""
          }`}
          onClick={() => handleTabChange("financial")}
        >
          Financial Details
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "legal"
              ? "border-b-2 border-blue-500 font-medium"
              : ""
          }`}
          onClick={() => handleTabChange("legal")}
        >
          Legal & Risk
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title/Headline
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Property Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="land">Land</option>
                  <option value="mixed-use">Mixed Use</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Yield (%)
                </label>
                <input
                  type="number"
                  name="yield"
                  value={formData.yield}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Property Images
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded border border-blue-200 hover:bg-blue-100"
                >
                  Upload Images
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                  accept="image/*"
                />
                <span className="ml-2 text-sm text-gray-500">
                  Supported formats: JPG, PNG, WebP
                </span>
              </div>

              {/* Image previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Uploaded Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Property preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Property Documents
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => documentInputRef.current?.click()}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded border border-blue-200 hover:bg-blue-100"
                >
                  Upload Documents
                </button>
                <input
                  type="file"
                  ref={documentInputRef}
                  onChange={handleDocumentUpload}
                  className="hidden"
                  multiple
                  accept=".pdf,.docx,.xlsx"
                />
                {/* <iframe src="https://res.cloudinary.com/dtucbqemb/image/upload/v1745825721/realstate-pdfs/e02xdd6m2eabdv80pzy5.pdf" width="600" height="400"></iframe> */}

                <span className="ml-2 text-sm text-gray-500">
                  Supported formats: PDF, DOCX, XLSX
                </span>
              </div>

              {/* Document list */}
              {formData.documents.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">
                    Uploaded Documents
                  </h3>
                  <div className="space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex flex-col">
                          {/* Document name */}

                          {/* PDF Preview */}
                          <embed
                            src={doc}
                            width="600"
                            height="200"
                            type="application/pdf"
                            className="mt-2"
                          />

                          {/* Link to open the document in a new tab */}
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 mt-2"
                          >
                            View Document
                          </a>
                        </div>

                        {/* Button to remove document */}
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features & Amenities Tab */}
        {activeTab === "features" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Amenities
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  className="w-full p-2 border rounded-l"
                  placeholder="Add amenity"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                  Add
                </button>
              </div>

              {/* Amenities list */}
              {formData.amenities.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Added Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-50 px-3 py-1 rounded"
                      >
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Financial Details Tab */}
        {activeTab === "financial" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Value ($)
                </label>
                <input
                  type="number"
                  name="totalValue"
                  value={formData.totalValue}
                  onChange={handleNumberChange}
                  onBlur={calculateDerivedFields}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Shares
                </label>
                <input
                  type="number"
                  name="totalShares"
                  value={formData.totalShares}
                  onChange={handleNumberChange}
                  onBlur={calculateDerivedFields}
                  className="w-full p-2 border rounded"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Available Shares
                </label>
                <input
                  type="number"
                  name="availableShares"
                  value={formData.availableShares}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  max={formData.totalShares}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price Per Share ($)
                </label>
                <input
                  type="number"
                  name="pricePerShare"
                  value={formData.pricePerShare}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Funding Goal ($)
                </label>
                <input
                  type="number"
                  name="fundingGoal"
                  value={formData.fundingGoal}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Funding Raised ($)
                </label>
                <input
                  type="number"
                  name="fundingRaised"
                  value={formData.fundingRaised}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  max={formData.fundingGoal}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Return Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                  Total Return (%)
                  </label>
                  <input
                    type="number"
                    name="return.rental"
                    value={formData.return.total}
                    onChange={handleNumberChange}
                    className="w-full p-2 border rounded"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                  Appreciation Return (%) (optional)
                  </label>
                  <input
                    type="number"
                    name="return.historical"
                    value={formData.return.appreciation || 0}
                    onChange={handleNumberChange}
                    className="w-full p-2 border rounded"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                  Rental Return (%) (optional)
                  </label>
                  <input
                    type="number"
                    name="return.historical"
                    value={formData.return.rental || 0}
                    onChange={handleNumberChange}
                    className="w-full p-2 border rounded"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div>
  <h3 className="text-lg font-medium mb-2">Financial Details</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Property Price */}
    <div>
      <label className="block text-sm font-medium mb-1">Property Price ($)</label>
      <input
        type="number"
        name="financials.propertyPrice"
        value={formData.financials.propertyPrice}
        onChange={handleNumberChange}
        onBlur={calculateDerivedFields}
        className="w-full p-2 border rounded"
        min="0"
        required
      />
    </div>

    {/* Stamp Duty */}
    <div>
      <label className="block text-sm font-medium mb-1">Stamp Duty ($)</label>
      <input
        type="number"
        name="financials.stampDuty"
        value={formData.financials.stampDuty}
        onChange={handleNumberChange}
        className="w-full p-2 border rounded"
        min="0"
        required
      />
    </div>

    {/* Registration Fee */}
    <div>
      <label className="block text-sm font-medium mb-1">Registration Fee ($)</label>
      <input
        type="number"
        name="financials.registrationFee"
        value={formData.financials.registrationFee}
        onChange={handleNumberChange}
        className="w-full p-2 border rounded"
        min="0"
        required
      />
    </div>

    {/* Legal Fee */}
    <div>
      <label className="block text-sm font-medium mb-1">Legal Fee ($)</label>
      <input
        type="number"
        name="financials.legalFee"
        value={formData.financials.legalFee}
        onChange={handleNumberChange}
        className="w-full p-2 border rounded"
        min="0"
        required
      />
    </div>

    {/* Total Investment */}
    <div>
      <label className="block text-sm font-medium mb-1">Total Investment ($)</label>
      <input
        type="number"
        name="financials.totalInvestment"
        value={formData.financials.totalInvestment}
        onChange={handleNumberChange}
        onBlur={calculateDerivedFields}
        className="w-full p-2 border rounded"
        min="0"
        required
      />
    </div>

    {/* Expected Rental Yield */}
    <div>
      <label className="block text-sm font-medium mb-1">Expected Rental Yield (%)</label>
      <input
        type="number"
        name="financials.expectedRentalYield"
        value={formData.financials.expectedRentalYield}
        onChange={handleNumberChange}
        onBlur={calculateDerivedFields}
        className="w-full p-2 border rounded"
        min="0"
        required
      />
    </div>

    {/* Expected Appreciation */}
    <div>
      <label className="block text-sm font-medium mb-1">Expected Appreciation (%)</label>
      <input
        type="number"
        name="financials.expectedAppreciation"
        value={formData.financials.expectedAppreciation}
        onChange={handleNumberChange}
        onBlur={calculateDerivedFields}
        className="w-full p-2 border rounded"
        min="0"
        required
      />
    </div>

    {/* Projected Return */}
    <div>
      <label className="block text-sm font-medium mb-1">Projected Return (%)</label>
      <input
        type="number"
        name="financials.projectedReturn"
        value={formData.financials.projectedReturn}
        onChange={handleNumberChange}
        onBlur={calculateDerivedFields}
        className="w-full p-2 border rounded"
        min="0"
        required
      />
    </div>

    {/* Net Operating Income */}
    <div>
      <label className="block text-sm font-medium mb-1">Net Operating Income ($)</label>
      <input
        type="number"
        name="financials.netOperatingIncome"
        value={formData.financials.netOperatingIncome}
        className="w-full p-2 border rounded bg-gray-100"
        readOnly
      />
    </div>

    {/* Cap Rate */}
    <div>
      <label className="block text-sm font-medium mb-1">Cap Rate (%)</label>
      <input
        type="number"
        name="financials.capRate"
        value={formData.financials.capRate}
        className="w-full p-2 border rounded bg-gray-100"
        readOnly
      />
    </div>
  </div>
</div>


            <div>
              <h3 className="text-lg font-medium mb-2">Offering Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Minimum Investment ($)
                  </label>
                  <input
                    type="number"
                    name="offeringDetails.minInvestment"
                    value={formData.offeringDetails.minInvestment}
                    onChange={handleNumberChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Holding Period (months)
                  </label>
                  <input
                    type="number"
                    name="offeringDetails.holdingPeriod"
                    value={formData.offeringDetails.holdingPeriod}
                    onChange={handleNumberChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Distribution Frequency
                  </label>
                  <select
                    name="offeringDetails.distributionFrequency"
                    value={formData.offeringDetails.distributionFrequency}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="biannual">Biannual</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legal & Risk Tab */}
        {activeTab === "legal" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Vendor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    name="vendorInfo.name"
                    value={formData.vendorInfo.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Vendor Phone
                  </label>
                  <input
                    type="text"
                    name="vendorInfo.phone"
                    value={formData.vendorInfo.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Vendor Email
                  </label>
                  <input
                    type="email"
                    name="vendorInfo.email"
                    value={formData.vendorInfo.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Vendor Website (optional)
                  </label>
                  <input
                    type="url"
                    name="vendorInfo.website"
                    value={formData.vendorInfo.website}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Legal Information
              </label>
              <textarea
                name="legalInfo"
                value={formData.legalInfo}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Risk Factors
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={newRiskFactor}
                  onChange={(e) => setNewRiskFactor(e.target.value)}
                  className="w-full p-2 border rounded-l"
                  placeholder="Add risk factor"
                />
                <button
                  type="button"
                  onClick={handleAddRiskFactor}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                  Add
                </button>
              </div>

              {/* Risk factors list */}
              {formData.riskFactors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">
                    Added Risk Factors
                  </h3>
                  <div className="space-y-2">
                    {formData.riskFactors.map((factor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span>{factor}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRiskFactor(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form actions */}
        <div className="mt-8 flex justify-between">
          <div className="flex items-center">
            {loading && (
              <div className="mr-4 w-full max-w-xs">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm">{uploadProgress}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setFormData(initialFormState)}
              className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Add Property"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminPropertyForm;
