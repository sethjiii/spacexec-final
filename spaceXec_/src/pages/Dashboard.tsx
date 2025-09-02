import { useEffect, useState } from "react";
import { Share2, MapPin } from "lucide-react";
import {
  Home,
  User,
  FileText,
  DollarSign,
  Clock,
  Bell,
  LogOut,
  Settings,
  BarChart2,
  TrendingUp,
  Activity,
  Heart,
  Star,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import PropertyCard from "@/components/ui/PropertyCard";

import { Copy, CheckCircle } from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { FaMap, FaMapPin } from "react-icons/fa";
import { useLogout } from "../hooks/useLogout";

const data_ = [
  { name: "Category A", value: 40 },
  { name: "Category B", value: 30 },
  { name: "Category C", value: 20 },
  { name: "Category D", value: 10 },
];
const data1_ = [
  { name: "Jan", invested: 5000, totalInvested: 5000, portfolioValue: 5200 },
  { name: "Feb", invested: 3000, totalInvested: 8000, portfolioValue: 8500 },
  { name: "Mar", invested: 2000, totalInvested: 10000, portfolioValue: 10200 },
  { name: "Apr", invested: 4000, totalInvested: 14000, portfolioValue: 14500 },
  { name: "May", invested: 3500, totalInvested: 17500, portfolioValue: 18000 },
  { name: "Jun", invested: 4500, totalInvested: 22000, portfolioValue: 22500 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
// Sample user data
const user_d = {
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  joinedDate: "January 2022",
  totalInvestments: 3,
  totalInvested: 200000,
  totalReturns: 26000,
  portfolio: [
    {
      id: "1", //
      title: "Luxury Apartment in South Delhi", //
      location: "Green Park, Delhi", //
      price: 15000000, //
      yield: 14.5, //
      minInvestment: 25000, //
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
      type: "Residential", //
      area: 1250, //
      investedAmount: 100000, //
      ownership: 0.67, //
      returns: 145000, //
      purchaseDate: "March 15, 2022", //
    },
    {
      id: "2",
      title: "Commercial Space in Cyber City",
      location: "Gurugram, Haryana",
      price: 27500000,
      yield: 16.2,
      minInvestment: 50000,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
      type: "Commercial",
      area: 2100,
      investedAmount: 75000,
      ownership: 0.27,
      returns: 12150,
      purchaseDate: "May 22, 2022",
    },
    {
      id: "5",
      title: "Vacation Home in Shimla",
      location: "Shimla, Himachal Pradesh",
      price: 12500000,
      yield: 13.2,
      minInvestment: 20000,
      image:
        "https://images.unsplash.com/photo-1559767949-0faa5c7e9992?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      type: "Vacation",
      area: 1650,
      investedAmount: 25000,
      ownership: 0.2,
      returns: 3300,
      purchaseDate: "October 10, 2022",
      nftToken: "iofuo8940923",
    },
  ],
  // New wishlist properties
  wishlist: [
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
  ],
  transactions: [
    {
      id: "t1",
      date: "March 15, 2022",
      amount: 100000,
      type: "investment",
      property: "Luxury Apartment in South Delhi",
      transaction_id: "lvjndsuf98qrrw0709",
      propertyId: "akdfj983232",
      Date: "sdfsd",
    },
    {
      id: "t2",
      date: "April 15, 2022",
      amount: 1208,
      type: "return",
      property: "Luxury Apartment in South Delhi",
    },
    {
      id: "t3",
      date: "May 22, 2022",
      amount: 75000,
      type: "investment",
      property: "Commercial Space in Cyber City",
    },
    {
      id: "t4",
      date: "June 15, 2022",
      amount: 1208,
      type: "return",
      property: "Luxury Apartment in South Delhi",
    },
    {
      id: "t5",
      date: "June 22, 2022",
      amount: 1012,
      type: "return",
      property: "Commercial Space in Cyber City",
    },
    {
      id: "t6",
      date: "July 15, 2022",
      amount: 1208,
      type: "return",
      property: "Luxury Apartment in South Delhi",
    },
    {
      id: "t7",
      date: "July 22, 2022",
      amount: 1012,
      type: "return",
      property: "Commercial Space in Cyber City",
    },
    {
      id: "t8",
      date: "October 10, 2022",
      amount: 25000,
      type: "investment",
      property: "Vacation Home in Shimla",
    },
  ],
  notifications: [
    {
      id: "n1",
      date: "Today, 10:30 AM",
      message: "Monthly return of ₹1,208 credited to your account",
      read: false,
    },
    {
      id: "n2",
      date: "Yesterday, 3:45 PM",
      message: "Commercial Space in Cyber City has achieved 85% funding",
      read: false,
    },
    {
      id: "n3",
      date: "October 15, 2022",
      message:
        "New property listing matching your preferences is now available",
      read: true,
    },
    {
      id: "n4",
      date: "October 10, 2022",
      message: "Your investment in Vacation Home in Shimla has been confirmed",
      read: true,
    },
  ],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [wishlistView, setWishlistView] = useState("grid"); // 'grid' or 'tile'
  const [userId, setuserId] = useState("");
  const [profile, setProfile] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(user_d);
  const [data, setData] = useState(data_);
  const [data1, setData1] = useState(data1_);
  const [copiedToken, setCopiedToken] = useState(null);
  const { handleLogout } = useLogout();

  const copyToken = (tokenId) => {
    navigator.clipboard.writeText(tokenId);
    setCopiedToken(tokenId);
    setTimeout(() => setCopiedToken(null), 2000); // Reset copied state after 2s
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
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

        const token = localStorage.getItem("token"); // or however you store the JWT

        const response = await fetch(`${baseUrl}/api/users/dashboard/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ attach token
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUserData(data.data.userData);
        setData(data.data.charts.pieChartData);
        setData1(data.data.charts.monthlyTrackData);
        console.log(data.data);
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to toggle between grid and tile view
  const toggleWishlistView = () => {
    setWishlistView(wishlistView === "grid" ? "tile" : "grid");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto pt-3 pb-12 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:w-64 flex-shrink-0">
            <div className="sticky top-0 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {/* <User className="h-6 w-6 text-primary" /> */}
                    <img
                      src={profile}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {userData.name}
                    </h2>
                    <p className="text-xs text-gray-500">Customer</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        activeTab === "overview"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Home className="h-5 w-5" />
                      <span>Overview</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("my-properties")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        activeTab === "my-properties"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Home className="h-5 w-5" />
                      <span>My Properties</span>
                    </button>
                  </li>
                  {/* New Wishlist Navigation Item */}
                  <li>
                    <button
                      onClick={() => setActiveTab("wishlist")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        activeTab === "wishlist"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                      <span>Wishlist</span>
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {userData.wishlist.length}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("transactions")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        activeTab === "transactions"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <DollarSign className="h-5 w-5" />
                      <span>Transactions</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        activeTab === "notifications"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Bell className="h-5 w-5" />
                      <span>Notifications</span>
                      {userData.notifications.filter((n) => !n.read).length >
                        0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                          {userData.notifications.filter((n) => !n.read).length}
                        </span>
                      )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        activeTab === "profile"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("support")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        activeTab === "support"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                      <span>Support</span>
                    </button>
                  </li>
                </ul>
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
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === "overview" && (
              <div className="space animate-fade-in ">
                {/* <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1> */}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Invested</CardDescription>
                      <CardTitle className="text-2xl">
                        ₹{userData.totalInvested.toLocaleString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        Across {userData.totalInvestments} properties
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Returns</CardDescription>
                      <CardTitle className="text-2xl text-green-700">
                        +₹{userData.totalReturns.toLocaleString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-green-700 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {(
                          (userData.totalReturns / userData.totalInvested) *
                          100
                        ).toFixed(2)}
                        % on investment
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Current Portfolio Value</CardDescription>
                      <CardTitle className="text-2xl">
                        ₹
                        {(
                          userData.totalInvested + userData.totalReturns
                        ).toLocaleString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        Updated as of today
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <PieChart className="h-40 w-40 text-gray-300" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Returns History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <BarChart2 className="h-40 w-40 text-gray-300" />
                      </div>
                    </CardContent>
                  </Card>
                </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 mt-6">
                  {/* Pie Chart placeholder */}
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="flex justify-between w-full">
                          <span>Portfolio Allocation</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer>
                          <PieChart width={300} height={250}>
                            <Pie
                              data={data}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={50}
                              fill="#8884d8"
                              paddingAngle={1}
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${(percent * 100).toFixed(0)}%`
                              } // Show name & percentage
                            >
                              {data.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>

                            {/* <Tooltip /> */}

                            <Legend className="mt-20" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bar Chart placeholder */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Portfolio History</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={data1}
                            margin={{
                              top: 20,
                              right: 70,
                              left: 0,
                              bottom: 20,
                            }}
                          >
                            <XAxis dataKey="name" stroke="#8884d8" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="invested"
                              fill="#82ca9d"
                              barSize={5}
                              name="Invested"
                            />
                            <Bar
                              dataKey="totalInvested"
                              fill="#8884d8"
                              barSize={5}
                              name="Total Invested"
                            />
                            <Bar
                              dataKey="portfolioValue"
                              fill="#ffc658"
                              barSize={5}
                              name="Portfolio Value"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Wishlist Preview Section */}
                <Card className="my-6">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center">
                        <Heart className="mr-2 h-5 w-5 text-rose-500" />
                        Wishlist Highlights
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
                      {userData.wishlist.slice(0, 4).map((property) => (
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
                                <Heart
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

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.transactions
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        // Sort by latest transaction
                        .slice(0, 50) // Get the first 50 transactions after sorting
                        .map((transaction) => {
                          const property = transaction.propertyId;
                          // Assuming propertyId is populated with the property data

                          return (
                            <div
                              key={transaction.transaction_id} // Using transaction_id as the key
                              className="flex items-center justify-between border-b border-gray-100 pb-2"
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                                    transaction.type === "investment"
                                      ? "bg-blue-100"
                                      : "bg-green-100"
                                  }`}
                                >
                                  {transaction.type === "investment" ? (
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                  )}
                                </div>
                                <div>
                                  <p
                                    className={`font-medium ${
                                      transaction.type === "investment"
                                        ? "text-green-600"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {transaction.type === "investment"
                                      ? "Invested in"
                                      : "Return from"}{" "}
                                    {/* Display title if available */}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    <p>
                                      TransactionId:{" "}
                                      {transaction.transaction_id
                                        ? transaction.transaction_id
                                        : "Property not found"}{" "}
                                    </p>
                                    {new Date(
                                      transaction.date
                                    ).toLocaleDateString()}{" "}
                                    {/* Format the date */}
                                  </p>
                                </div>
                              </div>
                              <p
                                className={`font-medium ${
                                  transaction.type === "investment"
                                    ? "text-gray-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {transaction.type === "investment" ? "-" : "+"}{" "}
                                ₹{transaction.amount.toLocaleString()}{" "}
                                {/* Display title if available */}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                    <div className="mt-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                        onClick={() => setActiveTab("transactions")}
                      >
                        View All Transactions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "my-properties" && (
              <div className="space-y-8 animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-900 ">
                  Tokens You Own
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {userData.portfolio.map((property) => (
                    <div
                      key={property.id}
                      className="bg-gray-100 text-gray-900  shadow-xl p-6 flex flex-col justify-between border border-gray-200 transition-transform hover:scale-105 hover:shadow-2xl"
                    >
                      {/* Property Image */}
                      <div className="relative h-40  overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover "
                        />
                        {/* <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg shadow-md">
              {property.type}
            </div> */}
                      </div>

                      {/* Property Details */}
                      <h3 className="mt-4 text-xl font-semibold ">
                        {property.title}
                      </h3>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span>{property.location}</span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Invested Amount</span>
                          <span className="font-medium">
                            ₹{property.investedAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Ownership</span>
                          <span className="font-medium">
                            {property.ownership}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Returns Earned</span>
                          <span className="font-medium text-green-600">
                            ₹{property.returns.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Purchase Date</span>
                          <span className="font-medium">
                            {new Date(property.purchaseDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Secure NFT Token Section */}
                      <div className="mt-3  bg-gray-50  flex items-center justify-between text-[10px] font-mono shadow border border-gray-200">
                        <span className="truncate max-w-[85%] text-gray-700 px-1">
                          {property.nftToken}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-600 hover:text-blue-500 transition p-0.5"
                          onClick={() => copyToken(property.nftToken)}
                        >
                          {copiedToken === property.nftToken ? (
                            <CheckCircle size={12} className="text-green-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </Button>
                      </div>

                      {/* View Details Button */}
                      <div className="mt-4 flex gap-2">
                        <Link to={`/property/${property.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full border-gray-400 !px-3 !py-0 text-[12px] leading-tight  text-gray-900 hover:bg-gray-400 bg-blue-200"
                          >
                            See More
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full px-7 bg-red-500 text-white hover:bg-red-600"
                          onClick={() =>
                            navigate(`/sell/${property.id}`, {
                              state: property,
                            })
                          }
                        >
                          Sell
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    My Wishlist
                  </h1>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleWishlistView}
                      className="flex items-center"
                    >
                      {wishlistView === "grid" ? (
                        <>
                          <div className="mr-2 flex space-x-0.5">
                            <div className="h-2 w-2 bg-primary rounded-sm"></div>
                            <div className="h-2 w-2 bg-primary rounded-sm"></div>
                          </div>
                          Tile View
                        </>
                      ) : (
                        <>
                          <div className="mr-2 grid grid-cols-2 gap-0.5">
                            <div className="h-2 w-2 bg-primary rounded-sm"></div>
                            <div className="h-2 w-2 bg-primary rounded-sm"></div>
                            <div className="h-2 w-2 bg-primary rounded-sm"></div>
                            <div className="h-2 w-2 bg-primary rounded-sm"></div>
                          </div>
                          Grid View
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Grid View */}
                {wishlistView === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userData.wishlist.map((property) => (
                      //  <Link to={`/property/${property.id}`}></Link>
                      <div
                        key={property.id}
                        className="bg-white rounded- shadow-sm overflow-hidden group hover:shadow-md transition-all"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="p-1 flex justify-between">
                              {/* <span className="px-4 py-2 bg-gray-100 backdrop-blur-sm rounded-full text-xs font-small">
                                {property.type}
                              </span> */}
                              <button className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Heart
                                  className="h-4 w-4 text-rose-500"
                                  fill="#ec4899"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white text-sm font-medium">
                                ₹
                                {Math.round(
                                  property.price / 100000
                                ).toLocaleString()}{" "}
                                Lac
                              </span>
                              <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">
                                {property.yield}% yield
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900 truncate">
                                {property.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {property.location}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="text-xs font-medium text-gray-900">
                                {property.area} sq.ft
                              </p>
                            </div>
                          </div>

                          <div className="mt-4">
                            {/* <div className="flex justify-between text-sm mb-1">
                              <span>Funding Progress</span>
                              <span>{property.fundingPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${property.fundingPercentage}%`,
                                }}
                              ></div>
                            </div> */}
                            <p className="text-xs  text-gray-500 mt-1">
                              Min. Investment:{" "}
                              <span className="text-gray-700 font-bold">
                                ₹{property.minInvestment.toLocaleString()}
                              </span>
                            </p>
                          </div>

                          <div className="mt-4 flex">
                            <Link
                              to={`/property/${property.id}`}
                              className="w-full text-center bg-yellow-200 text-gray-700 font-semibold py-2 px-4  transition-all hover:text-gray-500 hover:bg-white shadow-md"
                            >
                              Invest Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tile View */}
                {wishlistView === "tile" && (
                  <div className="space-y-4">
                    {userData.wishlist.map((property) => (
                      <div
                        key={property.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                          <div className="sm:w-2/3 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-medium text-gray-900">
                                    {property.title}
                                  </h3>
                                  <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium">
                                    {property.type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {property.location}
                                </p>
                              </div>
                              <button className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Heart
                                  className="h-4 w-4 text-rose-500"
                                  fill="#ec4899"
                                />
                              </button>
                            </div>

                            <div className="mt-4 grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Price</p>
                                <p className="font-medium">
                                  ₹
                                  {Math.round(
                                    property.price / 100000
                                  ).toLocaleString()}{" "}
                                  Lac
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Area</p>
                                <p className="font-medium">
                                  {property.area} sq.ft
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Expected Yield
                                </p>
                                <p className="font-medium text-green-600">
                                  {property.yield}%
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Funding Progress</span>
                                <span>{property.fundingPercentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{
                                    width: `${property.fundingPercentage}%`,
                                  }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Min. Investment: ₹
                                {property.minInvestment.toLocaleString()}
                              </p>
                            </div>

                            <div className="mt-4 flex gap-2">
                              <Button variant="default" size="sm">
                                Invest Now
                              </Button>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-8 animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-900">
                  Transactions
                </h1>

                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between border-b border-gray-100 pb-4"
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center ${
                                transaction.type === "investment"
                                  ? "bg-blue-100"
                                  : "bg-green-100"
                              }`}
                            >
                              {transaction.type === "investment" ? (
                                <TrendingUp
                                  className={`h-5 w-5 text-blue-600`}
                                />
                              ) : (
                                <DollarSign
                                  className={`h-5 w-5 text-green-600`}
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.type === "investment"
                                  ? "Invested in"
                                  : "Return from"}{" "}
                                {transaction.property}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.date}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`text-lg font-medium ${
                              transaction.type === "investment"
                                ? "text-gray-900"
                                : "text-green-600"
                            }`}
                          >
                            {transaction.type === "investment" ? "-" : "+"} ₹
                            {transaction.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-8 animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>

                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {userData.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 flex ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div
                            className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center ${
                              !notification.read ? "bg-blue-100" : "bg-gray-100"
                            }`}
                          >
                            <Bell
                              className={`h-5 w-5 ${
                                !notification.read
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <p
                                className={`font-medium ${
                                  !notification.read
                                    ? "text-blue-900"
                                    : "text-gray-900"
                                }`}
                              >
                                {notification.message}
                              </p>
                              {!notification.read && (
                                <span className="inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {notification.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-8 animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{userData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">{userData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Joined Date</p>
                        <p className="font-medium">{userData.joinedDate}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button>Update Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "support" && (
              <div className="space-y-8 animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-900">Support</h1>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>
                      Our support team is ready to assist you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="How can we help you?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Describe your issue or question"
                        ></textarea>
                      </div>
                      <div>
                        <Button>Submit</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">
                          How do fractional property investments work?
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Fractional property investments allow you to own a
                          percentage of a property rather than purchasing it
                          outright. This gives you proportional ownership rights
                          and returns based on your investment amount.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">
                          What are the minimum investment amounts?
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Minimum investments vary by property but typically
                          start from ₹15,000. Each property listing will clearly
                          display the minimum investment amount required.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">
                          How are returns distributed?
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Returns are distributed monthly directly to your bank
                          account. The amount is proportional to your ownership
                          percentage in each property.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
