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

import { Banknote, Home, UserPlus } from "lucide-react";

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
  FaCheck,
  FaDashcube,
  FaEye,
  FaEyeSlash,
  FaHeart,
  FaMale,
  FaRupeeSign,
  FaSearch,
  FaSellcast,
  FaSign,
  FaUserAstronaut,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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

const leads_ = [
  {
    id: "L-001",
    name: "Ravi Sharma",
    mobile: "9876543210",
    email: "ravi.sharma@example.com",
    status: "active",
  },
  {
    id: "L-002",
    name: "Pooja Mehta",
    mobile: "9123456789",
    email: "pooja.mehta@example.com",
    status: "pending",
  },
  {
    id: "L-003",
    name: "Amit Kumar",
    mobile: "9988776655",
    email: "amit.kumar@example.com",
    status: "active",
  },
  {
    id: "L-004",
    name: "Sneha Verma",
    mobile: "9090909090",
    email: "sneha.verma@example.com",
    status: "inactive",
  },
  {
    id: "L-005",
    name: "Rahul Singh",
    mobile: "9812345678",
    email: "rahul.singh@example.com",
    status: "active",
  },
  {
    id: "L-006",
    name: "Nikita Joshi",
    mobile: "9900880077",
    email: "nikita.joshi@example.com",
    status: "pending",
  },
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

const customers_ = vendors_;

const salesData_ = [
  { month: "Jan", revenue: 845000, income: 750000, salesCount: 12 },
  { month: "Feb", revenue: 1025000, income: 950000, salesCount: 15 },
  { month: "Mar", revenue: 940000, income: 880000, salesCount: 14 },
  { month: "Apr", revenue: 1200000, income: 1100000, salesCount: 18 },
  { month: "May", revenue: 1350000, income: 1250000, salesCount: 20 },
  { month: "Jun", revenue: 1150000, income: 1050000, salesCount: 17 },
];
const ChannelPartner = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [tickets, setTickets] = useState(ticket_);
  const [propertiesHighlight, setPropertyHighlights] =
    useState(propertiesHighlight_);
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
  const [customers, setCustomers] = useState(customers_);
  const [leads, setLeads] = useState(leads_);
  const [totalCommission, setTotalCommission] = useState("");

  const [client, setClient] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  // Sample data for overview

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
    const fetchleads = async () => {
      try {
        const baseUrl =
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_BACKEND_URL
            : "http://localhost:5000";

        const userId = localStorage.getItem("_id");

        const response = await fetch(
          `${baseUrl}/api/users/channelpartner/getallleads/${userId}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        setLeads(data.leads);
        setTotalCommission(data.totalCommission);
        // console.log(data.leads);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchleads();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]: value,
    }));
    // console.log(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("_id");

      if (!userId) {
        throw new Error("Channel Partner ID not found in localStorage");
      }

      const payload = {
        ...client,
        userId,
      };

      const baseUrl =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_BACKEND_URL
          : "http://localhost:5000";

      const res = await fetch(`${baseUrl}/api/users/channelpartner/addleads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Request Payload:", payload);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add client");
      }

      const data = await res.json();
      toast.success("Client added successfully")
      console.log("Client added successfully:", data);

      // Optional: reset form
      setClient({ name: "", mobile: "", email: "" });
    } catch (error) {
      console.error("Error adding client:", error.message);
      // Optional: display error to user
    }
  };

  const vendorFilterFromUser = async () => {
    try {
      const baseUrl =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_BACKEND_URL
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
            Welcome Channel Partner !!
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
              variant={activeTab === "leads" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("leads")}
            >
              <Building className="mr-2 h-4 w-4" />
              Leads
            </Button>
          </div>
        </nav>
        <div className="p-4 mt-auto border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
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
              <h1 className="text-2xl font-bold">Channel Partner Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="relative max-w-xs flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    placeholder="Search..."
                    className="pl-9"
                  />
                </div>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Customers */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Customers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">
                    {leads?.length ?? 9}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +3 added this month
                  </p>
                </CardContent>
              </Card>

              {/* Total Commission Earned */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Commission Earned
                  </CardTitle>
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="items-center flex text-2xl font-bold text-green-500">
                    <FaRupeeSign />{totalCommission}+
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +15% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Commission Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        {/* <Tooltip
                          formatter={(value) =>
                            `₹${(value / 100000).toFixed(1)}L`
                          }
                        /> */}
                        <Legend />
                        <Bar
                          dataKey="revenue"
                          name="Revenue"
                          fill="#8884d8"
                          barSize={10}
                        />
                        <Bar
                          dataKey="income"
                          name="Income"
                          fill="#82ca9d"
                          barSize={10}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attention Required */}
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
        {activeTab === "leads" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Channel Partner Leads</h1>
            </div>

            {/* Add Client Form */}
            <Card className="bg-white dark:bg-[#0e0e0e] shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Client
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enter details to register a new lead
                </p>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Client Name
                      </label>
                      <Input
                        name="name"
                        value={client.name}
                        onChange={handleChange}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mobile Number
                      </label>
                      <Input
                        name="mobile"
                        value={client.mobile}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                        type="tel"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <Input
                        name="email"
                        value={client.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        type="email"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>

            {/* Leads Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Leads</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">Sno.</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Mobile</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead, index) => (
                        <tr
                          key={lead.id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium">{index + 1}</td>
                          <td className="px-6 py-4">{lead.name}</td>
                          <td className="px-6 py-4">{lead.mobile}</td>
                          <td className="px-6 py-4">{lead.email}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${lead.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                              {lead.status.charAt(0).toUpperCase() +
                                lead.status.slice(1)}
                            </span>
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
                  Showing {leads.length} leads
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
      </main>
    </div>
  );
};

export default ChannelPartner;
