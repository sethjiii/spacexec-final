import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building,
  Ticket,
  Users,
  BarChart3,
  FileCheck,
  Settings,
  LogOut,
  Search,
  Plus,
  Check,
  X,
  AlertTriangle,
  MessageSquare,
  Briefcase,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaBan,
  FaCheck,
  FaCircleNotch,
  FaDashcube,
  FaEye,
  FaEyeSlash,
  FaMale,
  FaMinusCircle,
  FaRegEye,
  FaSearch,
  FaSellcast,
  FaSign,
  FaTrash,
  FaUserAstronaut,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import ChatBox from "./ChatContainer";
import AdminVendorManagement from "@/components/AdminVendorManagement";
import { useLogout } from "../hooks/useLogout";

// Initialize toast container

const ticket_ = [
  {
    id: "T-1001",
    subject: "Unable to view property details",
    status: "open",
    customer: "Rahul Sharma",
    priority: "high",
    created: "2 hours ago",
  },
  {
    id: "T-1002",
    subject: "Payment verification issue",
    status: "in-progress",
    customer: "Priya Patel",
    priority: "medium",
    created: "5 hours ago",
    assignedTo: "Support Team A",
  },
  {
    id: "T-1003",
    subject: "Property investment confirmation",
    status: "resolved",
    customer: "Arjun Singh",
    priority: "low",
    created: "1 day ago",
    assignedTo: "Support Team B",
  },
  {
    id: "T-1004",
    subject: "Website loading slow on mobile",
    status: "open",
    customer: "Neha Gupta",
    priority: "medium",
    created: "1 day ago",
  },
  {
    id: "T-1005",
    subject: "Request for refund",
    status: "in-progress",
    customer: "Karan Malhotra",
    priority: "high",
    created: "2 days ago",
    assignedTo: "Finance Team",
  },
  {
    id: "T-1006",
    subject: "NFT token not received",
    status: "open",
    customer: "Ananya Desai",
    priority: "high",
    created: "2 days ago",
  },
];

const userList_ = [
  {
    id: "U-001",
    name: "Vikram Mehta",
    role: "user",
    email: "vikram.m@example.com",
    phone: "+91 98765 43210",
    investments: 3,
    joinedDate: "15 Jan 2023",
    status: "active",
  },
  {
    id: "U-002",
    name: "Meera Sharma",
    role: "user",

    email: "meera.s@example.com",
    phone: "+91 87654 32109",
    investments: 1,
    joinedDate: "28 Jan 2023",
    status: "active",
  },
  {
    id: "U-003",
    name: "Rajiv Kapoor",
    role: "user",

    email: "rajiv.k@example.com",
    phone: "+91 76543 21098",
    investments: 0,
    joinedDate: "10 Feb 2023",
    status: "inactive",
  },
  {
    id: "U-004",
    name: "Ananya Singh",
    role: "user",

    email: "ananya.s@example.com",
    phone: "+91 65432 10987",
    investments: 5,
    joinedDate: "22 Feb 2023",
    status: "active",
  },
  {
    id: "U-005",
    name: "Karthik Iyer",
    role: "user",

    email: "karthik.i@example.com",
    phone: "+91 54321 09876",
    investments: 2,
    joinedDate: "05 Mar 2023",
    status: "active",
  },
  {
    id: "U-006",
    name: "Preeti Verma",
    role: "user",

    email: "preeti.v@example.com",
    phone: "+91 43210 98765",
    investments: 0,
    joinedDate: "18 Mar 2023",
    status: "blocked",
  },
];

const property_ = [
  { name: "Residential", value: 45 },
  { name: "Commercial", value: 30 },
  { name: "Vacation", value: 15 },
  { name: "Industrial", value: 10 },
];

// Sample vendors data
const vendors_ = [
  {
    id: "V-001",
    name: "Prime Properties Ltd.",
    type: "Developer",
    properties: 5,
    status: "approved",
    joinedDate: "10 Jan 2023",
    rating: 4.8,
  },
  {
    id: "V-002",
    name: "Realty Vision Corp",
    type: "Broker",
    properties: 3,
    status: "approved",
    joinedDate: "15 Feb 2023",
    rating: 4.5,
  },
  {
    id: "V-003",
    name: "Horizon Builders",
    type: "Developer",
    properties: 0,
    status: "pending",
    joinedDate: "28 Mar 2023",
    rating: "N/A",
  },
  {
    id: "V-004",
    name: "Cityscape Properties",
    type: "Agent",
    properties: 4,
    status: "pending",
    joinedDate: "5 Apr 2023",
    rating: 4.2,
  },
  {
    id: "V-005",
    name: "Metro Estates",
    type: "Broker",
    properties: 0,
    status: "rejected",
    joinedDate: "17 Apr 2023",
    rating: "N/A",
  },
  {
    id: "V-006",
    name: "Elegant Homes",
    type: "Developer",
    properties: 1,
    status: "approved",
    joinedDate: "22 Apr 2023",
    rating: 4.0,
  },
];
const salesData = [
  { month: "Jan", revenue: 845000, investments: 750000, properties: 12 },
  { month: "Feb", revenue: 1025000, investments: 950000, properties: 15 },
  { month: "Mar", revenue: 940000, investments: 880000, properties: 14 },
  { month: "Apr", revenue: 1200000, investments: 1100000, properties: 18 },
  { month: "May", revenue: 1350000, investments: 1250000, properties: 20 },
  { month: "Jun", revenue: 1150000, investments: 1050000, properties: 17 },
];
const properties_ = [
  {
    _id: "P-001",
    title: "Luxury Apartment in South Delhi",
    location: "Green Park, Delhi",
    price: 15000000,
    type: "Residential",
    status: "active",
    investors: 32,
    fundingCompleted: 75,
  },
  {
    _id: "P-002",
    title: "Commercial Space in Cyber City",
    location: "Gurugram, Haryana",
    price: 27500000,
    type: "Commercial",
    status: "active",
    investors: 58,
    fundingCompleted: 89,
  },
  {
    _id: "P-003",
    title: "Vacation Home in Shimla",
    location: "Shimla, Himachal Pradesh",
    price: 12500000,
    type: "Vacation",
    status: "active",
    investors: 27,
    fundingCompleted: 65,
  },
  {
    _id: "P-004",
    title: "Office Complex in Whitefield",
    location: "Bangalore, Karnataka",
    price: 35000000,
    type: "Commercial",
    status: "pending",
    investors: 0,
    fundingCompleted: 0,
  },
  {
    _id: "P-005",
    title: "Beachfront Villa in Goa",
    location: "Calangute, Goa",
    price: 22000000,
    type: "Vacation",
    status: "disabled",
    investors: 15,
    fundingCompleted: 34,
  },
  {
    _id: "P-006",
    title: "Retail Space in Lower Parel",
    location: "Mumbai, Maharashtra",
    price: 18500000,
    type: "Commercial",
    status: "active",
    investors: 41,
    fundingCompleted: 80,
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [tickets, setTickets] = useState(ticket_);
  const [propertyTypeData, setpropertyTypeData] = useState(property_);
  const [ticketFilter, setTicketFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [properties, setProperties] = useState(properties_);
  const [profile, setProfile] = useState("");
  const [channelPartnerList, setChannelPartnerList] = useState([]);
  const [channelPartnerFilter, setChannelPartnerFilter] = useState("all");
  const { handleLogout } = useLogout();

  const [error, setError] = useState(null);
  const [adminParams, setAdminParams] = useState({
    total_users: 0,
    total_properties: 0,
    total_revenue: 0,
    usersByRole: {
      admin: 0,
      vendor: 0,
      user: 0,
      "channel-partner": 0,
    },
    propertiesByStatus: {
      active: 0,
      under_review: 0,
      inactive: 0,
    },
    formattedTicketStatusCounts: {
      open: 0,
      in_progress: 0,
      resolved: 0,
    },
  });
  const [userList, setUserList] = useState(userList_);

  // Sample data for overview

  // Sample data for tickets

  // Sample properties data
  const openChatModel = (ticketId) => {
    console.log("Opening chat model for ticket:", ticketId);
    setSelectedTicketId(ticketId);
  };

  const getAuthToken = () => {
    return localStorage.getItem("token"); // or whatever key you stored the token with
  };

  const handleDisableProperty = async (propertyId: string) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to disable this property?"
    );

    if (!userConfirmed) {
      return; // If user cancels, do nothing
    }

    try {
      const token = getAuthToken(); // Your helper to get the JWT
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const res = await fetch(
        `${baseUrl}/api/properties/disable/${propertyId}`,
        {
          method: "PUT", // ✅ use PUT or PATCH depending on your API
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ attach JWT
          },
          credentials: "include", // keep if backend uses cookies
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Property disabled successfully!");
      } else {
        toast.error("Failed to disable property!");
      }
    } catch (error) {
      console.error("Error disabling property:", error);
      toast.error("Error disabling property!");
    }
  };

  // Delete Property
  const handleDeleteProperty = async (propertyId: string) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!userConfirmed) {
      return; // If user cancels, do nothing
    }

    try {
      const token = getAuthToken();
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const res = await fetch(
        `${baseUrl}/api/properties/delete/${propertyId}`,
        {
          method: "DELETE", // DELETE for deleting
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      const data = await res.json(); // <--- Important: read the JSON body
      console.log(data);
      if (res.ok) {
        toast.success(data.message || "Property approved successfully!");
      } else {
        toast.error(data.message || "Failed to approve property!");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Error deleting property!");
    }
  };

  // Approve Property
  const handleApproveProperty = async (propertyId: string) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to approve this property?"
    );

    if (!userConfirmed) {
      return; // If user cancels, do nothing
    }

    try {
      const token = getAuthToken();
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const res = await fetch(
        `${baseUrl}/api/properties/approve/${propertyId}`,
        {
          method: "PUT", // PATCH for approving
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (res.ok) {
        toast.success("Property approved successfully!");
      } else {
        toast.error("Failed to approve property!");
      }
    } catch (error) {
      console.error("Error approving property:", error);
      toast.error("Error approving property!");
    }
  };

  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      try {
        const pro_ = localStorage.getItem("profile_pic");
        setProfile(pro_);

        const id = localStorage.getItem("_id");
        if (!id) {
          throw new Error("User ID not found in localStorage");
        }

        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : "http://localhost:5000";

        const token = localStorage.getItem("token"); // JWT stored after login

        const response = await fetch(`${baseUrl}/api/users/admindashboard`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ attach JWT
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        setTickets(data.support_tickets);
        setAdminParams(data.admin_params);

        // Format pie chart data
        // console.log(data.admin_params);
        const formatChartData = (rawData) => {
          // rawData = { "Residential": 45, "Commercial": 30, ... }
          return Object.entries(rawData).map(([name, value]) => ({
            name,
            value: Number(value),
          }));
        };
        console.log(data);

        // When you receive the data
        setpropertyTypeData(formatChartData(data.formatted_pie));

        // console.log(formatChartData(data.formatted_pie))
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchAdminDashboardData();
  }, []);

  const fetchUsersData = async () => {
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const token = localStorage.getItem("token"); // JWT stored after login

      const response = await fetch(
        `${baseUrl}/api/users/admindashboard/usersdata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ attach JWT
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setUserList(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  const fetchAllProperties = async () => {
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const token = localStorage.getItem("token"); // JWT stored after login

      const response = await fetch(`${baseUrl}/api/properties/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ attach JWT
        },
      });

      const data = await response.json();

      setProperties(data);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      console.log(data);

      console.log(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  const channelPartnerFilterFromUser = async () => {
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const token = localStorage.getItem("token"); // JWT stored after login

      const response = await fetch(
        `${baseUrl}/api/users/getallchannelpartner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ attach JWT
          },
        }
      );

      const data = await response.json();

      console.log("data");
      console.log(data);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setChannelPartnerList(data.partners); // Ensure setChannelPartnerList is defined in your component
      console.log(data);
    } catch (err) {
      setError(err.message); // Assuming you're using a shared error state
      console.error("Failed to fetch channel partner data:", err);
    }
  };

  const upgradeUserToChannelPartner = async (userId) => {
    try {
      const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://localhost:5000";

const token = localStorage.getItem("token"); // JWT stored after login

const response = await fetch(`${baseUrl}/api/users/upgrade-user`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // ✅ attach JWT
  },
  body: JSON.stringify({ userId }),
});

const data = await response.json();



      if (!response.ok) {
        throw new Error(data.message || "Failed to upgrade user.");
      }

      console.log("User upgraded to channel partner:", data);
      alert("User successfully upgraded to channel partner!");
      // Optionally refresh the list or update UI state
    } catch (error) {
      console.error("Error upgrading user:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "disabled":
        return "bg-red-100 text-red-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredTickets =
    ticketFilter === "all"
      ? tickets
      : tickets.filter((ticket) => ticket.status === ticketFilter);

  const filteredProperties =
    propertyFilter === "all"
      ? properties
      : properties.filter((property) => property.status === propertyFilter);

  const filteredChannelPartners =
    channelPartnerFilter === "all"
      ? channelPartnerList
      : channelPartnerList.filter(
          (partner) => partner.status === channelPartnerFilter
        );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-primary">
            Welcome Admin !!
          </h2>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            <Button
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "properties" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("properties");
                fetchAllProperties();
              }}
            >
              <Building className="mr-2 h-4 w-4" />
              Properties
            </Button>
            <Button
              variant={activeTab === "tickets" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("tickets");
              }}
            >
              <Ticket className="mr-2 h-4 w-4" />
              Support Tickets
            </Button>
            <Button
              variant={activeTab === "vendors" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("vendors");
              }}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Vendors
            </Button>

            <Button
              variant={activeTab === "channelpartners" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("channelpartners");
                channelPartnerFilterFromUser();
              }}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Channelpartners
            </Button>

            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("users");
                fetchUsersData();
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button
              variant={activeTab === "analytics" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            {/* <Button
              variant={activeTab === "reports" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("reports")}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Reports
            </Button> */}
            {/* <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button> */}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Overview Dashboard */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <Input placeholder="Search..." className="pl-10 max-w-xs" />
                </div>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    +{adminParams.total_revenue}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Properties
                  </CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminParams.total_properties}
                    <span className="text-xs ml-2 text-muted-foreground ">
                      total
                    </span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <p className="text-xs flex items-center font-semibold text-green-600 ">
                      {adminParams.propertiesByStatus.active} active
                      <FaEye className="ml-2" />
                    </p>
                    <p className="text-xs flex items-center text-muted-foreground font-semibold text-red-400">
                      {adminParams.propertiesByStatus.under_review || 0} hidden
                      <FaBan className="ml-2 text-red-500" />
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Registered Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminParams.total_users}
                  </div>
                  <div className="flex justify-between pt-3">
                    <p className="text-xs flex items-center text-muted-foreground font-semibold text-green-600 ">
                      {adminParams.usersByRole.vendor} vendor
                      <FaSellcast className="ml-2" />
                    </p>
                    <p className="text-xs flex items-center text-muted-foreground font-semibold">
                      {adminParams.usersByRole.user} user
                      <FaMale className="ml-2" />
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Open Tickets
                  </CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tickets.length}</div>
                  <div className="flex justify-between pt-3">
                    <p className="text-xs flex items-center text-muted-foreground font-semibold text-red-400">
                      {adminParams.formattedTicketStatusCounts.in_progress} open
                      <FaSearch className="ml-2" />
                    </p>

                    <p className="text-xs flex items-center font-semibold text-green-600 ">
                      {adminParams.formattedTicketStatusCounts.resolved || 0}{" "}
                      resolved
                      <FaCheck className="ml-2" />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) =>
                            `₹${(Number(value) / 100000).toFixed(1)}L`
                          }
                        />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                        <Bar
                          dataKey="investments"
                          name="Investments"
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Property Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={300} height={300}>
                        <Pie
                          data={propertyTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          // label={({ name, percent }) =>
                          //   `${name}: ${(percent * 100).toFixed(0)}%`
                          // }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {propertyTypeData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />

                        <Legend className="mt-20" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attention Required */}
            <Card>
              <CardHeader>
                <CardTitle>Attention Required</CardTitle>
                <CardDescription>
                  Items that need your immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium">
                        3 High Priority Support Tickets
                      </h4>
                      <p className="text-sm text-gray-600">
                        Three tickets have been open for more than 24 hours
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setActiveTab("tickets")}
                      >
                        View Tickets
                      </Button>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200 flex items-start">
                    <FileCheck className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium">
                        2 Pending Property Approvals
                      </h4>
                      <p className="text-sm text-gray-600">
                        Two properties are awaiting your approval
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setActiveTab("properties")}
                      >
                        Review Properties
                      </Button>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md border border-green-200 flex items-start">
                    <Users className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium">1 Vendor Application</h4>
                      <p className="text-sm text-gray-600">
                        A new vendor has applied to list properties
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setActiveTab("vendors")}
                      >
                        Review Application
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Support Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Support Tickets</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketFilter("all")}
                    className={ticketFilter === "all" ? "bg-muted" : ""}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketFilter("open")}
                    className={ticketFilter === "open" ? "bg-muted" : ""}
                  >
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketFilter("in-progress")}
                    className={ticketFilter === "in-progress" ? "bg-muted" : ""}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketFilter("resolved")}
                    className={ticketFilter === "resolved" ? "bg-muted" : ""}
                  >
                    Resolved
                  </Button>
                </div>
                <Input placeholder="Search tickets..." className="max-w-xs" />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">Ticket ID</th>
                        <th className="px-6 py-3">Subject</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Status</th>

                        <th className="px-6 py-3">Created</th>

                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTicketId && (
                        <div className="absolute top-0 -left-32 w-2/3 h-2/3 ">
                          <div className="bg-gray-400 bg-opacity-0 h-full w-full p-2 rounded-lg relative">
                            {/* <p className="text-center pb-1 text-white font-sans">Support Desk</p> */}
                            <div
                              className="absolute top-4  z-50 right-40 cursor-pointer text-red-500 font-bold  text-xl"
                              onClick={() => setSelectedTicketId(null)}
                            >
                              ✕
                            </div>
                            <div></div>
                            <ChatBox ticketId={selectedTicketId} />
                          </div>
                        </div>
                      )}

                      {filteredTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium">{ticket.id}</td>
                          <td className="px-6 py-4">{ticket.subject}</td>
                          <td className="px-6 py-4">{ticket.customer}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                ticket.status
                              )}`}
                            >
                              {ticket.status.charAt(0).toUpperCase() +
                                ticket.status.slice(1)}
                            </span>
                          </td>

                          <td className="px-6 py-4">{ticket.created}</td>

                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {/* <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button> */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openChatModel(ticket.id)}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-3">
                <div className="text-sm text-gray-500">
                  Showing {filteredTickets.length} of {tickets.length} tickets
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Properties Management</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPropertyFilter("all")}
                    className={propertyFilter === "all" ? "bg-muted" : ""}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPropertyFilter("active")}
                    className={propertyFilter === "active" ? "bg-muted" : ""}
                  >
                    Active
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPropertyFilter("under_review")}
                    className={propertyFilter === "pending" ? "bg-muted" : ""}
                  >
                    Under_review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPropertyFilter("disabled")}
                    className={propertyFilter === "disabled" ? "bg-muted" : ""}
                  >
                    Disabled
                  </Button>
                </div>

                {/* <Input
                  placeholder="Search properties..."
                  className="max-w-xs"
                /> */}

                <div className="flex gap-2">
                  <Link
                    to="/addproperty"
                    className="flex items-center justify-center w-40 h-10 px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Property
                  </Link>
                  <Link
                    to="/admin/vendor-management"
                    className="flex items-center justify-center w-40 h-10 px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Manage Vendors
                  </Link>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">SNo. </th>
                        <th className="px-6 py-3">Object ids </th>
                        <th className="px-6 py-3">Property </th>
                        <th className="px-6 py-3">Location </th>
                        <th className="px-6 py-3">Type </th>
                        <th className="px-6 py-3">Price </th>
                        <th className="px-6 py-3">Status </th>
                        <th className="px-6 py-3">Actions </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.map((property, index) => (
                        <tr
                          key={property._id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium">{index + 1}</td>
                          <td className="px-6 py-4 font-medium">
                            {property._id}
                          </td>
                          <td className="px-6 py-4">{property.title}</td>
                          <td className="px-6 py-4">{property.location}</td>
                          <td className="px-6 py-4">{property.type}</td>
                          <td className="px-6 py-4">
                            ₹{(property.price / 100000).toFixed(1)}L
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                property.status
                              )}`}
                            >
                              {property.status.charAt(0).toUpperCase() +
                                property.status.slice(1)}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="flex text-center items-center space-x-2">
                              {/* View Button */}
                              <Link
                                to={`/property/${property._id}`}
                                target="_blank"
                              >
                                <div className="relative group">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <FaRegEye className="text-green-700 h-4 w-4" />
                                  </Button>
                                  <span className="absolute left-1/2 w-32 transform -translate-x-1/2 bottom-3 mb-6 text-sm text-white bg-gray-500 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    View Property
                                  </span>
                                </div>
                              </Link>

                              {/* Approve/Disable Button */}
                              <div className="relative group">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    property.status === "active"
                                      ? handleDisableProperty(property._id)
                                      : handleApproveProperty(property._id)
                                  }
                                >
                                  {property.status === "active" ? (
                                    <FaMinusCircle className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <Check className="h-4 w-4 text-green-500" />
                                  )}
                                </Button>
                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-3 mb-6 text-sm text-white bg-gray-500 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {property.status === "active"
                                    ? "Disable"
                                    : "Approve"}
                                </span>
                              </div>

                              {/* Delete Button */}
                              <div className="relative group">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    handleDeleteProperty(property._id)
                                  }
                                >
                                  <FaTrash className="h-4 w-4 text-red-600" />
                                </Button>
                                <span className="absolute -left-6 transform -translate-x-1/2 bottom-2 w-36 mb-6 text-sm text-white bg-gray-500 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  Delete Property
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-3">
                <div className="text-sm text-gray-500">
                  Showing {filteredProperties.length} of {properties.length}{" "}
                  properties
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === "vendors" && <AdminVendorManagement />}

        {/* channelpartner tab */}
        {activeTab === "channelpartners" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Channel Partner Management</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChannelPartnerFilter("all")}
                    className={channelPartnerFilter === "all" ? "bg-muted" : ""}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChannelPartnerFilter("approved")}
                    className={
                      channelPartnerFilter === "approved" ? "bg-muted" : ""
                    }
                  >
                    Approved
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChannelPartnerFilter("pending")}
                    className={
                      channelPartnerFilter === "pending" ? "bg-muted" : ""
                    }
                  >
                    Pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChannelPartnerFilter("rejected")}
                    className={
                      channelPartnerFilter === "rejected" ? "bg-muted" : ""
                    }
                  >
                    Rejected
                  </Button>
                </div>
                <Input
                  placeholder="Search channel partners..."
                  className="max-w-xs"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredChannelPartners.map((partner, index) => (
                        <tr
                          key={partner.id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium">{index + 1}</td>
                          <td className="px-6 py-4">{partner.name}</td>
                          <td className="px-6 py-4">{partner.email}</td>
                          <td className="px-6 py-4">{partner.location}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs`}>
                              {!partner.status ? "pending" : "approved"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  const confirmed = window.confirm(
                                    "Are you sure you want to upgrade this user to a channel partner?"
                                  );
                                  if (confirmed) {
                                    // call your upgrade function here
                                    upgradeUserToChannelPartner(partner.id); // replace with your actual function
                                  }
                                }}
                              >
                                <FaCheck className="h-4 w-4 text-green-500 cursor-pointer" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {partner.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-green-500"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-3">
                <div className="text-sm text-gray-500">
                  Showing {filteredChannelPartners.length} of{" "}
                  {channelPartnerList.length} partners
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Users Management</h1>
              <div className="flex items-center space-x-4">
                <Input placeholder="Search users..." className="max-w-xs" />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">SNo.</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Phone</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Investments</th>
                        <th className="px-6 py-3">Joined Date</th>
                        {/* <th className="px-6 py-3">Status</th> */}
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Sample user data */}
                      {userList.map((user, index) => (
                        <tr
                          key={user.id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium">{index + 1}</td>
                          <td className="px-6 py-4">{user.name}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">{user.phone}</td>
                          <td className="px-6 py-4">{user.role}</td>
                          <td className="px-6 text-center py-4">
                            {user.investments}
                          </td>
                          <td className="px-6 py-4">{user.joinedDate}</td>
                          {/* <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "inactive"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </span>
                          </td> */}
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                {user.status === "active" ? (
                                  <X className="h-4 w-4" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-3">
                <div className="text-sm text-gray-500 flex items-center ">
                  <FaUserAstronaut className="mr-2" /> Your current crowd of{" "}
                  {userList.length} users
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Analytics</h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Investment
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹4.98 Cr</div>
                  <div className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+18.2% from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Investment
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹3.2L</div>
                  <div className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+5.3% from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Active Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,254</div>
                  <div className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+12.5% from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversion Rate
                  </CardTitle>
                  <Check className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.7%</div>
                  <div className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+1.2% from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: "Jan", users: 1560 },
                          { month: "Feb", users: 1890 },
                          { month: "Mar", users: 2150 },
                          { month: "Apr", users: 2350 },
                          { month: "May", users: 2680 },
                          { month: "Jun", users: 2854 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" name="Users" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Residential", value: 55 },
                            { name: "Commercial", value: 32 },
                            { name: "Vacation", value: 8 },
                            { name: "Industrial", value: 5 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {propertyTypeData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>

            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        Profile Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Admin Name
                          </label>
                          <Input defaultValue="Rajesh Kumar" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Email Address
                          </label>
                          <Input defaultValue="admin@propinvest.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Phone Number
                          </label>
                          <Input defaultValue="+91 98765 43210" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Role
                          </label>
                          <Input defaultValue="Super Admin" disabled />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        Company Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Company Name
                          </label>
                          <Input defaultValue="PropInvest Technologies Pvt. Ltd." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Company Address
                          </label>
                          <Input defaultValue="1234, Cyber City, Gurugram, Haryana" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            GST Number
                          </label>
                          <Input defaultValue="29AAKCP9768N1ZX" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            CIN
                          </label>
                          <Input defaultValue="U72200KA2020PTC082721" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and authentication settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Current Password
                          </label>
                          <Input type="password" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            New Password
                          </label>
                          <Input type="password" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Confirm New Password
                          </label>
                          <Input type="password" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">
                            Enable two-factor authentication for enhanced
                            security
                          </p>
                          <p className="text-xs text-gray-500">
                            Requires an authentication app like Google
                            Authenticator
                          </p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Manage your notification preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">New Support Tickets</h3>
                          <p className="text-sm text-gray-500">
                            Receive notifications when new tickets are created
                          </p>
                        </div>
                        <Button variant="outline">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Property Submissions</h3>
                          <p className="text-sm text-gray-500">
                            Receive notifications for new property submissions
                          </p>
                        </div>
                        <Button variant="outline">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Vendor Applications</h3>
                          <p className="text-sm text-gray-500">
                            Receive notifications for new vendor applications
                          </p>
                        </div>
                        <Button variant="outline">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">User Registrations</h3>
                          <p className="text-sm text-gray-500">
                            Receive notifications for new user registrations
                          </p>
                        </div>
                        <Button variant="outline">Disabled</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="api" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Settings</CardTitle>
                    <CardDescription>
                      Manage your API keys and access.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">API Key</h3>
                      <div className="flex items-center space-x-2">
                        <Input
                          defaultValue="pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          type="password"
                        />
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline">
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Last generated on April 12, 2023
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Webhook URL</h3>
                      <Input defaultValue="https://propinvest.com/api/webhooks/callback" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Regenerate API Key</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Reports</h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>
                  Download or view detailed reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Monthly Investment Report</h3>
                      <p className="text-sm text-gray-500">
                        Summary of all investments made in the current month
                      </p>
                    </div>
                    <Button variant="outline">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">User Activity Report</h3>
                      <p className="text-sm text-gray-500">
                        Detailed report of user activities and engagement
                      </p>
                    </div>
                    <Button variant="outline">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">
                        Property Performance Report
                      </h3>
                      <p className="text-sm text-gray-500">
                        Analysis of property listing performance and investment
                        status
                      </p>
                    </div>
                    <Button variant="outline">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Revenue Report</h3>
                      <p className="text-sm text-gray-500">
                        Financial summary including revenue, expenses, and
                        profits
                      </p>
                    </div>
                    <Button variant="outline">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Support Tickets Analysis</h3>
                      <p className="text-sm text-gray-500">
                        Overview of customer support performance and issue
                        resolution
                      </p>
                    </div>
                    <Button variant="outline">Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
