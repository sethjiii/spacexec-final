import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import axios from "axios";

interface VendorStatus {
  _id: string;
  status: "pending" | "active" | "suspended" | "rejected";
  businessName: string;
  applicationDate: string;
  adminNotes?: Array<{
    note: string;
    addedAt: string;
  }>;
}

const VendorApplicationStatus = ({ userId }: { userId: string }) => {
  const [vendorStatus, setVendorStatus] = useState<VendorStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      checkVendorStatus();
    }
  }, [userId]);

  const checkVendorStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/vendors/user/${userId}`);
      setVendorStatus(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No vendor application found
        setVendorStatus(null);
      } else {
        console.error("Error checking vendor status:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "suspended":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
      case "suspended":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!vendorStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Become a Vendor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Join our platform as a verified real estate professional and start listing your properties.
          </p>
          <Link to="/vendor-application">
            <Button className="w-full">
              <Building className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(vendorStatus.status)}
          Vendor Application Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">{vendorStatus.businessName}</p>
          <p className="text-sm text-gray-500">
            Applied on {formatDate(vendorStatus.applicationDate)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(vendorStatus.status)}
        </div>

        {vendorStatus.status === "pending" && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              Your application is under review. We'll notify you once a decision has been made.
            </p>
          </div>
        )}

        {vendorStatus.status === "rejected" && vendorStatus.adminNotes && vendorStatus.adminNotes.length > 0 && (
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-800 font-medium mb-2">Application Feedback:</p>
            <p className="text-sm text-red-700">
              {vendorStatus.adminNotes[vendorStatus.adminNotes.length - 1].note}
            </p>
          </div>
        )}

        {vendorStatus.status === "active" && (
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800 mb-2">
              Congratulations! Your vendor application has been approved.
            </p>
            <Link to="/vendordashboard">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Go to Vendor Dashboard
              </Button>
            </Link>
          </div>
        )}

        {vendorStatus.status === "suspended" && (
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              Your vendor account has been suspended. Please contact support for more information.
            </p>
          </div>
        )}

        {vendorStatus.status === "rejected" && (
          <div className="mt-4">
            <Link to="/vendor-application">
              <Button variant="outline" className="w-full">
                <Building className="h-4 w-4 mr-2" />
                Reapply
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorApplicationStatus;
