
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Navbar from "./components/layout/Navbar";
import Invest from "./pages/InvestStep1";
import InvestStep1 from "./pages/InvestStep1";
import InvestStep2 from "./pages/InvestStep2";
import InvestStep3 from "./pages/InvestStep3";
import InvestStep4 from "./pages/InvestStep4";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPropertyForm from "./pages/AddProperty";
import VendorDashboard from "./pages/VendorDashboard";
import ChatBox from "./pages/ChatContainer";
import ChatButton from "./pages/Chatboxbottom";
import SellNFTPage from "./pages/sellNft";
import LuxuryPropertyMarketplace from "./pages/MarketPlace";
import Footer from "./components/layout/Footer";
import MarketPlaceCheckout1 from "./pages/marketplaceCheckout1";
import MarketPlaceCheckoutConfirmation from "./pages/marketplaceCheckout2";
import MarketPlaceCheckout2 from "./pages/marketplaceCheckout2";
import ChannelPartner from "./pages/ChannelPartner";
import ForgotPassword from "./components/auth/Forgotpass";
import ResetPassword from "./components/auth/Resetpassword";
import BecomeChannelPartner from "./pages/upgradetoChannnelp";
import VendorApplication from "./pages/VendorApplication";
import AdminVendorManagement from "./pages/AdminVendorManagement";
import ContactUs from "./pages/contact";
import AboutUs from "./pages/about";

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
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/invest/:propertyId" element={<InvestStep1 />} />
          <Route path="/invest/review" element={<InvestStep2 />} />
          <Route path="/invest/payment" element={<InvestStep3 />} />
          <Route path="/invest/checkout" element={<InvestStep4 />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/channelpartner/:id" element={<ChannelPartner />} />
          <Route path="/chatbox" element={<ChatBox ticketId="default-ticket-id" />} />
          <Route path="/sell/:id" element={<SellNFTPage />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/vendordashboard" element={<VendorDashboard />} />
          <Route path="/addproperty" element={<AdminPropertyForm />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/marketplace" element={<LuxuryPropertyMarketplace />} />
          <Route path="/upgrade-to-channelpartner" element={<BecomeChannelPartner />} />
          <Route path="/vendor-application" element={<VendorApplication />} />
          <Route path="/admin/vendor-management" element={<AdminVendorManagement />} />
          <Route path="/marketplace/buy" element={<MarketPlaceCheckout1 />} />
          <Route path="/marketplace/checkout" element={<MarketPlaceCheckout2 />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ChatButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
