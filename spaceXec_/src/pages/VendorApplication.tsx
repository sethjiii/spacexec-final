import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserFromStorage } from "../utils/authUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  Send,
} from "lucide-react";
import axios from "axios";

interface VendorApplicationData {
  userId: string;
  businessName: string;
  businessType: string;
  businessLicense: string;
  taxId: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessPhone: string;
  businessEmail: string;
  website: string;
  yearsInBusiness: number;
  specialties: string[];
  serviceAreas: Array<{
    city: string;
    state: string;
    zipCode: string;
  }>;
  annualRevenue: number;
  creditScore: number;
  bankInfo: {
    accountHolder: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
}

const businessTypes = [
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
];

const specialties = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "land", label: "Land" },
  { value: "luxury", label: "Luxury" },
  { value: "investment", label: "Investment" },
  { value: "development", label: "Development" },
];

const VendorApplication = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const [formData, setFormData] = useState<VendorApplicationData>({
    userId: "",
    businessName: "",
    businessType: "",
    businessLicense: "",
    taxId: "",
    businessAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    businessPhone: "",
    businessEmail: "",
    website: "",
    yearsInBusiness: 0,
    specialties: [],
    serviceAreas: [{ city: "", state: "", zipCode: "" }],
    annualRevenue: 0,
    creditScore: 750, // Default credit score
    bankInfo: {
      accountHolder: "",
      accountNumber: "",
      routingNumber: "",
      bankName: "",
    },
  });

  useEffect(() => {
    // Get user data using the utility function
    const user = getUserFromStorage();

    if (user && user._id) {
      setUserId(user._id);
      setFormData((prev) => ({ ...prev, userId: user._id }));
    } else {
      toast.error("Please login to apply as a vendor");
      navigate("/login");
    }
  }, [navigate]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAddress = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessAddress: {
        ...prev.businessAddress,
        [field]: value,
      },
    }));
  };

  const updateBankInfo = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bankInfo: {
        ...prev.bankInfo,
        [field]: value,
      },
    }));
  };

  const addServiceArea = () => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: [
        ...prev.serviceAreas,
        { city: "", state: "", zipCode: "" },
      ],
    }));
  };

  const removeServiceArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index),
    }));
  };

  const updateServiceArea = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map((area, i) =>
        i === index ? { ...area, [field]: value } : area
      ),
    }));
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.businessName &&
          formData.businessType &&
          formData.businessLicense &&
          formData.taxId
        );
      case 2:
        return !!(
          formData.businessAddress.street &&
          formData.businessAddress.city &&
          formData.businessAddress.state &&
          formData.businessAddress.zipCode &&
          formData.businessPhone &&
          formData.businessEmail
        );
      case 3:
        return !!(
          formData.yearsInBusiness > 0 && formData.specialties.length > 0
        );
      case 4:
        return !!(
          formData.bankInfo.accountHolder &&
          formData.bankInfo.accountNumber &&
          formData.bankInfo.routingNumber &&
          formData.bankInfo.bankName
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("📤 Sending vendor application data:", formData);
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const token = localStorage.getItem("token"); // JWT stored after login

      const response = await axios.post(
        `${baseUrl}/api/vendors/apply`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ attach JWT
          },
        }
      );

      if (response.status === 201) {
        toast.success("Vendor application submitted successfully!");
        navigate("/dashboard/" + userId);
      }
    } catch (error: any) {
      console.error("❌ Error submitting application:", error);
      console.error("❌ Error response:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Become a Vendor
            </h1>
            <p className="text-gray-600">
              Join our platform as a verified real estate professional
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 4
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Steps */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {currentStep === 1 && "Business Information"}
              {currentStep === 2 && "Contact & Address"}
              {currentStep === 3 && "Business Details"}
              {currentStep === 4 && "Banking Information"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your business"}
              {currentStep === 2 && "How can we reach you?"}
              {currentStep === 3 && "Your expertise and experience"}
              {currentStep === 4 && "Payment and banking details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) =>
                        updateFormData("businessName", e.target.value)
                      }
                      placeholder="Enter your business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) =>
                        updateFormData("businessType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessLicense">Business License *</Label>
                    <Input
                      id="businessLicense"
                      value={formData.businessLicense}
                      onChange={(e) =>
                        updateFormData("businessLicense", e.target.value)
                      }
                      placeholder="Enter business license number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxId">Tax ID *</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => updateFormData("taxId", e.target.value)}
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact & Address */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessPhone">Business Phone *</Label>
                    <Input
                      id="businessPhone"
                      value={formData.businessPhone}
                      onChange={(e) =>
                        updateFormData("businessPhone", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessEmail">Business Email *</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={formData.businessEmail}
                      onChange={(e) =>
                        updateFormData("businessEmail", e.target.value)
                      }
                      placeholder="contact@yourbusiness.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    placeholder="https://yourbusiness.com"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Business Address *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        placeholder="Street Address"
                        value={formData.businessAddress.street}
                        onChange={(e) =>
                          updateAddress("street", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="City"
                        value={formData.businessAddress.city}
                        onChange={(e) => updateAddress("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="State"
                        value={formData.businessAddress.state}
                        onChange={(e) => updateAddress("state", e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="ZIP Code"
                        value={formData.businessAddress.zipCode}
                        onChange={(e) =>
                          updateAddress("zipCode", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Country"
                        value={formData.businessAddress.country}
                        onChange={(e) =>
                          updateAddress("country", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Business Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                    <Input
                      id="yearsInBusiness"
                      type="number"
                      value={formData.yearsInBusiness}
                      onChange={(e) =>
                        updateFormData(
                          "yearsInBusiness",
                          e.target.value ? parseInt(e.target.value) : 0
                        )
                      }
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="annualRevenue">
                      Annual Revenue (Optional)
                    </Label>
                    <Input
                      id="annualRevenue"
                      type="number"
                      value={formData.annualRevenue}
                      onChange={(e) =>
                        updateFormData(
                          "annualRevenue",
                          e.target.value ? parseInt(e.target.value) : 0
                        )
                      }
                      placeholder="500000"
                    />
                  </div>
                </div>

                <div>
                  <Label>Property Specialties *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {specialties.map((specialty) => (
                      <div
                        key={specialty.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={specialty.value}
                          checked={formData.specialties.includes(
                            specialty.value
                          )}
                          onCheckedChange={() =>
                            toggleSpecialty(specialty.value)
                          }
                        />
                        <Label htmlFor={specialty.value} className="text-sm">
                          {specialty.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Service Areas</Label>
                  <div className="space-y-3">
                    {formData.serviceAreas.map((area, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="City"
                          value={area.city}
                          onChange={(e) =>
                            updateServiceArea(index, "city", e.target.value)
                          }
                        />
                        <Input
                          placeholder="State"
                          value={area.state}
                          onChange={(e) =>
                            updateServiceArea(index, "state", e.target.value)
                          }
                        />
                        <Input
                          placeholder="ZIP"
                          value={area.zipCode}
                          onChange={(e) =>
                            updateServiceArea(index, "zipCode", e.target.value)
                          }
                        />
                        {formData.serviceAreas.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeServiceArea(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addServiceArea}
                      className="w-full"
                    >
                      Add Service Area
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Banking Information */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountHolder">Account Holder Name *</Label>
                    <Input
                      id="accountHolder"
                      value={formData.bankInfo.accountHolder}
                      onChange={(e) =>
                        updateBankInfo("accountHolder", e.target.value)
                      }
                      placeholder="Enter account holder name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      value={formData.bankInfo.bankName}
                      onChange={(e) =>
                        updateBankInfo("bankName", e.target.value)
                      }
                      placeholder="Enter bank name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={formData.bankInfo.accountNumber}
                      onChange={(e) =>
                        updateBankInfo("accountNumber", e.target.value)
                      }
                      placeholder="Enter account number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="routingNumber">Routing Number *</Label>
                    <Input
                      id="routingNumber"
                      value={formData.bankInfo.routingNumber}
                      onChange={(e) =>
                        updateBankInfo("routingNumber", e.target.value)
                      }
                      placeholder="Enter routing number"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Security Notice
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your banking information is encrypted and secure. We
                        only use this information for commission payments and
                        will never share it with third parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button onClick={nextStep}>Next Step</Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Why Become a Vendor?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Verified Status</h3>
                <p className="text-sm text-gray-600">
                  Get verified badge and build trust with investors
                </p>
              </div>
              <div className="text-center">
                <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Property Management</h3>
                <p className="text-sm text-gray-600">
                  List and manage your properties with ease
                </p>
              </div>
              <div className="text-center">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Commission Earnings</h3>
                <p className="text-sm text-gray-600">
                  Earn commissions on successful property sales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorApplication;
