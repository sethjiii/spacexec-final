import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ChatButton from "./pages/Chatboxbottom";

// Auth
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import ForgotPassword from "./components/auth/Forgotpass";
import ResetPassword from "./components/auth/Resetpassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import InvestStep1 from "./pages/InvestStep1";
import InvestStep2 from "./pages/InvestStep2";
import InvestStep3 from "./pages/InvestStep3";
import InvestStep4 from "./pages/InvestStep4";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPropertyForm from "./pages/AddProperty";
import AdminVendorManagement from "./pages/AdminVendorManagement";
import VendorDashboard from "./pages/VendorDashboard";
import VendorApplication from "./pages/VendorApplication";
import ChannelPartner from "./pages/ChannelPartner";
import BecomeChannelPartner from "./pages/upgradetoChannnelp";
import ChatBox from "./pages/ChatContainer";
import SellNFTPage from "./pages/sellNft";
import LuxuryPropertyMarketplace from "./pages/MarketPlace";
import MarketPlaceCheckout1 from "./pages/marketplaceCheckout1";
import MarketPlaceCheckout2 from "./pages/marketplaceCheckout2";
import ContactUs from "./pages/contact";
import AboutUs from "./pages/about";
import Terms from "./pages/terms";
import PrivacyPolicy from "./pages/privacypolicy";
import RefundPolicy from "./pages/refundPolicy";
import Disclaimer from "./pages/disclaimer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <ToastContainer position="top-right" autoClose={3000} />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/refundpolicy" element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          {/* Investor/User Protected Routes */}
          <Route
            path="/dashboard/:id"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invest/:propertyId"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor", "channelPartner", "admin"]}>
                <InvestStep1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invest/review"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor", "channelPartner", "admin"]}>
                <InvestStep2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invest/payment"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor", "channelPartner", "admin"]}>
                <InvestStep3 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invest/checkout"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor", "channelPartner", "admin"]}>
                <InvestStep4 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/buy"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor", "channelPartner", "admin"]}>
                <MarketPlaceCheckout1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/checkout"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor", "channelPartner", "admin"]}>
                <MarketPlaceCheckout2 />
              </ProtectedRoute>
            }
          />

          {/* Vendor Protected Routes */}
          <Route
            path="/vendordashboard"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor-application"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorApplication />
              </ProtectedRoute>
            }
          />

          {/* Channel Partner Protected Routes */}
          <Route
            path="/channelpartner/:id"
            element={
              <ProtectedRoute allowedRoles={["channelPartner"]}>
                <ChannelPartner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upgrade-to-channelpartner"
            element={
              <ProtectedRoute allowedRoles={["channelPartner"]}>
                <BecomeChannelPartner />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addproperty"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPropertyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendor-management"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminVendorManagement />
              </ProtectedRoute>
            }
          />

          {/* Marketplace (public) */}
          <Route path="/marketplace" element={<LuxuryPropertyMarketplace />} />

          {/* Chat (any logged in role) */}
          <Route
            path="/chatbox"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor", "admin", "channelPartner"]}>
                <ChatBox ticketId="default-ticket-id" />
              </ProtectedRoute>
            }
          />

          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ChatButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
