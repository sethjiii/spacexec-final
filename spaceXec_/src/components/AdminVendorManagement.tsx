import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  Check,
  X,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Building,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban,
  Edit,
  Trash2,
  Star,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
// Update the import path below to the correct relative path if needed
import firebaseConfig from "@/FirebaseConfig/FirebaseConfig"; // Adjust the path as per your project structure
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Initialize Firebase app and auth instance
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

interface Vendor {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profile_pic?: string;
    phone?: string;
  };
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
  website?: string;
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
  status: "pending" | "active" | "rejected" | "suspended";
  isVerified: boolean;
  verificationDate?: Date;
  verifiedBy?: string;
  applicationDate: Date;
  approvedDate?: Date;
  adminNotes: Array<{
    note: string;
    addedBy: string;
    date: Date;
  }>;
  documents: Array<{
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }>;
  commissionRate?: number;
  averageRating?: number;
  totalReviews?: number;
  totalProperties?: number;
}

const AdminVendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "suspend" | "reactivate">("approve");
  const [actionNotes, setActionNotes] = useState("");
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    fetchVendors();
    const adminIdFromStorage = localStorage.getItem("_id");
    if (adminIdFromStorage) {
      setAdminId(adminIdFromStorage);
    }
  }, []);

 const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const fetchVendors = async () => {
  try {
    setLoading(true);
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user");
    }

    // Force token refresh to get latest claims
    await user.getIdToken(true);
    const token = await user.getIdToken();

    const response = await fetch(`${API_BASE_URL}/vendors/admin/applications`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 🔍 Log raw response for debugging
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();
    setVendors(data.vendors || []);
  } catch (error) {
    console.error("Error fetching vendors:", error);
  } finally {
    setLoading(false);
  }
};


  const handleVendorAction = async () => {
  if (!selectedVendor || !actionNotes.trim()) {
    toast.error("Please provide notes for this action");
    return;
  }

  try {
    let endpoint = "";
    let method: "PUT" | "POST" = "POST"; // default to POST

    switch (actionType) {
      case "approve":
        endpoint = `${API_BASE_URL}/vendors/admin/approve/${selectedVendor._id}`;

        method = "PUT"; // ✅ backend expects PUT
        break;
      case "reject":
        endpoint = `${API_BASE_URL}/vendors/admin/reject/${selectedVendor._id}`;
        break;
      case "suspend":
        endpoint = `${API_BASE_URL}/vendors/admin/suspend/${selectedVendor._id}`;
        break;
      case "reactivate":
        endpoint = `${API_BASE_URL}/vendors/admin/reactivate/${selectedVendor._id}`;
        break;
    }

    const response = await axios({
      method,
      url: endpoint,
      data: {
        adminId,
        notes: actionNotes,
        ...(actionType === "reject" && { reason: actionNotes }),
      },
    });

    if (response.status === 200) {
      toast.success(`Vendor ${actionType}d successfully`);
      setIsActionDialogOpen(false);
      setActionNotes("");
      fetchVendors();
    }
  } catch (error: any) {
    console.error(`Error ${actionType}ing vendor:`, error);
    toast.error(error.response?.data?.message || `Failed to ${actionType} vendor`);
  }
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      case "suspended":
        return <Ban className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = 
      vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.businessAddress.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vendors.length,
    pending: vendors.filter(v => v.status === "pending").length,
    active: vendors.filter(v => v.status === "active").length,
    rejected: vendors.filter(v => v.status === "rejected").length,
    suspended: vendors.filter(v => v.status === "suspended").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Vendor Management</h1>
          <p className="text-gray-600">Manage vendor applications and approvals</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-orange-600">{stats.suspended}</p>
              </div>
              <Ban className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search vendors by name, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Applications</CardTitle>
          <CardDescription>
            {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Business Info
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={vendor.userId.profile_pic || "https://via.placeholder.com/40"}
                            alt={vendor.userId.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vendor.userId.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vendor.userId.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {vendor.businessName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vendor.businessType} • {vendor.yearsInBusiness} years
                        </div>
                        <div className="text-sm text-gray-500">
                          <MapPin className="inline w-3 h-3 mr-1" />
                          {vendor.businessAddress.city}, {vendor.businessAddress.state}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {vendor.businessPhone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {vendor.businessEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${getStatusColor(vendor.status)}`}>
                        <span className="flex items-center">
                          {getStatusIcon(vendor.status)}
                          <span className="ml-1">
                            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                          </span>
                        </span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(vendor.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {vendor.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => {
                                setSelectedVendor(vendor);
                                setActionType("approve");
                                setIsActionDialogOpen(true);
                              }}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedVendor(vendor);
                                setActionType("reject");
                                setIsActionDialogOpen(true);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        
                        {vendor.status === "active" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700"
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setActionType("suspend");
                              setIsActionDialogOpen(true);
                            }}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {vendor.status === "suspended" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setActionType("reactivate");
                              setIsActionDialogOpen(true);
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Vendor
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" && "Approve this vendor application and grant access to list properties."}
              {actionType === "reject" && "Reject this vendor application. The vendor will be notified."}
              {actionType === "suspend" && "Temporarily suspend this vendor's account."}
              {actionType === "reactivate" && "Reactivate this vendor's account."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <Textarea
                placeholder={`Enter notes for ${actionType}ing this vendor...`}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsActionDialogOpen(false);
                  setActionNotes("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleVendorAction}
                className={
                  actionType === "approve" || actionType === "reactivate"
                    ? "bg-green-600 hover:bg-green-700"
                    : actionType === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }
              >
                {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Vendor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVendorManagement;
