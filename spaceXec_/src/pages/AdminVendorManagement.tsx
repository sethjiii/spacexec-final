import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building,
  Users,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  MessageSquare,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import axios from "axios";

interface Vendor {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profile_pic: string;
    phone: string;
  };
  businessName: string;
  businessType: string;
  status: "pending" | "active" | "suspended" | "rejected";
  applicationDate: string;
}

const AdminVendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user._id) {
      setAdminId(user._id);
    }
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vendors/admin/applications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // add your Firebase/JWT token
        },
      });
      
      setVendors(response.data.vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/vendors/admin/approve/${vendorId}`, {
        adminId,
        notes: "Approved by admin",
      });
      toast.success("Vendor approved successfully!");
      fetchVendors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve vendor");
    }
  };

  const handleReject = async (vendorId: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/vendors/admin/reject/${vendorId}`, {
        adminId,
        reason: "Rejected by admin",
        notes: "Application rejected",
      });
      toast.success("Vendor application rejected");
      fetchVendors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject vendor");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Suspended</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
        <p className="text-gray-600">Review and manage vendor applications</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Applications</CardTitle>
          <CardDescription>
            Manage vendor applications and approvals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={vendor.userId.profile_pic}
                        alt={vendor.userId.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{vendor.userId.name}</p>
                        <p className="text-sm text-gray-500">{vendor.userId.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{vendor.businessName}</p>
                      <p className="text-sm text-gray-500 capitalize">{vendor.businessType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{vendor.userId.phone}</p>
                      <p className="text-sm text-gray-500">{vendor.userId.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(vendor.status)}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{formatDate(vendor.applicationDate)}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {vendor.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(vendor._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(vendor._id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVendorManagement;
