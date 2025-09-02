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
import { useLogout } from "../hooks/useLogout";
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
  FaCheck,
  FaDashcube,
  FaEye,
  FaEyeSlash,
  FaHeart,
  FaMale,
  FaSearch,
  FaSellcast,
  FaSign,
  FaUserAstronaut,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const propertiesHighlight_ = [
  {
    id: "w1",
    title: "Beachfront Villa in Goa",
    location: "Calangute, Goa",
    price: 35000000,
    yield: 12.8,
    minInvestment: 100000,
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    type: "Vacation",
    area: 2200,
    fundingPercentage: 78,

  },
  {
    id: "w2",
    title: "Office Space in Mumbai",
    location: "Bandra Kurla Complex, Mumbai",
    price: 42000000,
    yield: 15.5,
    minInvestment: 75000,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    type: "Commercial",
    area: 1800,
    fundingPercentage: 65,
  },
  {
    id: "w3",
    title: "Premium Apartment in Bangalore",
    location: "Koramangala, Bangalore",
    price: 18000000,
    yield: 13.9,
    minInvestment: 30000,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    type: "Residential",
    area: 1450,
    fundingPercentage: 92,
  },
  {
    id: "w4",
    title: "Hill View Cottage in Mussoorie",
    location: "Mussoorie, Uttarakhand",
    price: 9500000,
    yield: 11.8,
    minInvestment: 15000,
    image:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    type: "Vacation",
    area: 950,
    fundingPercentage: 45,
  },
];

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


const salesData_ = [
  { month: "Jan", revenue: 845000, income: 750000, salesCount: 12 },
  { month: "Feb", revenue: 1025000, income: 950000, salesCount: 15 },
  { month: "Mar", revenue: 940000, income: 880000, salesCount: 14 },
  { month: "Apr", revenue: 1200000, income: 1100000, salesCount: 18 },
  { month: "May", revenue: 1350000, income: 1250000, salesCount: 20 },
  { month: "Jun", revenue: 1150000, income: 1050000, salesCount: 17 },
];
const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [tickets, setTickets] = useState(ticket_);
  const [propertiesHighlight, setPropertyHighlights] = useState(propertiesHighlight_);
  const [salesData, setSalesData] = useState(salesData_);
  const [totalRevenue, setTotalRevenue] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [totalProperties, setTotalProperties] = useState("");
  const [propertyTypeData, setpropertyTypeData] = useState(property_);
  const [ticketFilter, setTicketFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [profile, setProfile] = useState("");
  const [error, setError] = useState(null);
  const { handleLogout } = useLogout();
  const [adminParams, setAdminParams] = useState({
    total_users: 0,
    total_properties: 0,
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
  const [vendorList, setVendorList] = useState(vendors_);

  // Sample data for overview


  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Sample data for tickets

  // Sample properties data
  const properties = [
    {
      id: "P-001",
      title: "Luxury Apartment in South Delhi",
      location: "Green Park, Delhi",
      price: 15000000,
      type: "Residential",
      status: "active",
      investors: 32,
      fundingCompleted: 75,
    },
    {
      id: "P-002",
      title: "Commercial Space in Cyber City",
      location: "Gurugram, Haryana",
      price: 27500000,
      type: "Commercial",
      status: "active",
      investors: 58,
      fundingCompleted: 89,
    },
    {
      id: "P-003",
      title: "Vacation Home in Shimla",
      location: "Shimla, Himachal Pradesh",
      price: 12500000,
      type: "Vacation",
      status: "active",
      investors: 27,
      fundingCompleted: 65,
    },
    {
      id: "P-004",
      title: "Office Complex in Whitefield",
      location: "Bangalore, Karnataka",
      price: 35000000,
      type: "Commercial",
      status: "pending",
      investors: 0,
      fundingCompleted: 0,
    },
    {
      id: "P-005",
      title: "Beachfront Villa in Goa",
      location: "Calangute, Goa",
      price: 22000000,
      type: "Vacation",
      status: "disabled",
      investors: 15,
      fundingCompleted: 34,
    },
    {
      id: "P-006",
      title: "Retail Space in Lower Parel",
      location: "Mumbai, Maharashtra",
      price: 18500000,
      type: "Commercial",
      status: "active",
      investors: 41,
      fundingCompleted: 80,
    },
  ];

  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      try {
        const pro_ = localStorage.getItem("profile_pic");
        setProfile(pro_);

        const vendorId = localStorage.getItem("_id");
        if (!vendorId) {
          throw new Error("User ID not found in localStorage");
        }

        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : "http://localhost:5000";

        const response = await fetch(`${baseUrl}/api/users/vendordashboard/${vendorId}`, {
          method: "POST",
        });

        const data = await response.json();
        console.log(data)


        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        setPropertyHighlights(data.listings)
        setSalesData(data.salesSummary)
        setTotalIncome(data.totalIncome)
        setTotalProperties(data.totalProperties)
        setTotalRevenue(data.totalRevenue)

        // setTickets(data.support_tickets);
        // setAdminParams(data.admin_params);

        // Format pie chart data
        // console.log(data.admin_params);
        const formatChartData = (rawData) => {
          // rawData = { "Residential": 45, "Commercial": 30, ... }
          return Object.entries(rawData).map(([name, value]) => ({
            name,
            value,
          }));
        };
        console.log(data);

        // When you receive the data
        // setpropertyTypeData(formatChartData(data.formatted_pie));

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

      const response = await fetch(
        `${baseUrl}/api/users/admindashboard/usersdata`,
        {
          method: "POST",
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

  const vendorFilterFromUser = async () => {
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const response = await fetch(
        `${baseUrl}/api/users/admindashboard/vendorsdata`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setVendorList(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch dashboard data:", err);
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

  const filteredVendors =
    vendorFilter === "all"
      ? vendorList
      : vendorList.filter((vendor) => vendor.status === vendorFilter);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-primary">
            Welcome to Vendor Dashboard !!
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
              onClick={() => setActiveTab("properties")}
            >
              <Building className="mr-2 h-4 w-4" />
              Properties
            </Button>
            {/* <Button
              variant={activeTab === "tickets" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("tickets")}
            >
              <Ticket className="mr-2 h-4 w-4" />
              Support Tickets
            </Button> */}
            {/* <Button
              variant={activeTab === "vendors" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("vendors");
                vendorFilterFromUser();
              }}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Vendors
            </Button> */}
            {/* <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("users");
                fetchUsersData();
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button> */}
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
              <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="relative max-w-xs">
                  <Input
                    placeholder="Search..."
                    className="pl-10"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* property status */}

            <Card className="my-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="flex items-center">
                    <FaHeart className="mr-2 h-5 w-5 text-rose-500" />
                    Property Highlights
                  </CardTitle>
                  <CardDescription>
                    Properties you've saved for future investment
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("wishlist")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {propertiesHighlight.slice(0, 4).map((property) => (
                    <div
                      key={property.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-all relative"
                    >
                      <div className="h-24 overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-0 right-0 p-1">
                          <div className="bg-white/80 backdrop-blur-sm p-1 rounded-full">
                            <FaHeart
                              className="h-4 w-4 text-rose-500"
                              fill="#ec4899"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="font-medium text-xs truncate">
                          {property.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {property.location}
                        </p>
                        <div className="mt-1 flex justify-between items-center">
                          <span className="text-xs font-semibold">
                            ₹
                            {Math.round(
                              property.price / 100000
                            ).toLocaleString()}{" "}
                            L
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                            {property.yield}% yield
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sold Shares Worth
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    +{totalRevenue}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Income
                  </CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    +{totalIncome}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Listed property
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalProperties}
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
                      {adminParams.propertiesByStatus.under_review || 0} active
                      <FaEyeSlash className="ml-2" />
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Dummy Field
                  </CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    __
                  </div>
                  <div className="flex justify-between pt-3">
                    <p className="text-xs flex items-center text-muted-foreground font-semibold text-green-600 ">
                      ____________
                      <FaSellcast className="ml-2" />
                    </p>
                    <p className="text-xs flex items-center text-muted-foreground font-semibold">
                      ________________
                      <FaMale className="ml-2" />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
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
                          dataKey="income"
                          name="Income"
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
                    onClick={() => setPropertyFilter("pending")}
                    className={propertyFilter === "pending" ? "bg-muted" : ""}
                  >
                    Pending
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
                <Input
                  placeholder="Search properties..."
                  className="max-w-xs"
                />

                <Link
                  to="/addproperty"
                  className="flex items-center justify-center w-40 h-10 px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Property
                </Link>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Property</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Investors</th>
                        <th className="px-6 py-3">Funding</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.map((property) => (
                        <tr
                          key={property.id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium">
                            {property.id}
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
                          <td className="px-6 py-4">{property.investors}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{
                                    width: `${property.fundingCompleted}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs">
                                {property.fundingCompleted}%
                              </span>
                            </div>
                          </td>
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
                                {property.status === "active" ? (
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
        {activeTab === "vendors" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Vendors Management</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVendorFilter("all")}
                    className={vendorFilter === "all" ? "bg-muted" : ""}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVendorFilter("approved")}
                    className={vendorFilter === "approved" ? "bg-muted" : ""}
                  >
                    Approved
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVendorFilter("pending")}
                    className={vendorFilter === "pending" ? "bg-muted" : ""}
                  >
                    Pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVendorFilter("rejected")}
                    className={vendorFilter === "rejected" ? "bg-muted" : ""}
                  >
                    Rejected
                  </Button>
                </div>
                <Input placeholder="Search vendors..." className="max-w-xs" />
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vendor
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Vendor Name</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Properties</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Joined Date</th>
                        <th className="px-6 py-3">Rating</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVendors.map((vendor, index) => (
                        <tr
                          key={vendor.id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium">{index + 1}</td>
                          <td className="px-6 py-4">{vendor.name}</td>
                          <td className="px-6 py-4">{vendor.type}</td>
                          <td className="px-6 py-4 text-center">
                            {vendor.properties}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs`}>
                              {vendor.status.toString()
                                ? "verified"
                                : "pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4">{vendor.joinedDate}</td>
                          <td className="px-6 py-4">{vendor.rating}</td>
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
                              {vendor.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-green-500"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500"
                                  >
                                    <X className="h-4 w-4" />
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
                  Showing {filteredVendors.length} of {vendorList.length}{" "}
                  vendors
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

export default VendorDashboard;
