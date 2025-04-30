const propertyModels = require("../models/propertyModels");
const moment = require("moment");
const SalesModel = require("../models/SalesModel");

const vendordashboarddata = async (req, res) => {
    try {
      const { vendorId } = req.params;
  
      // 1. Fetch all properties listed by the vendor
      const vendorListings = await propertyModels.find({ primary_lister: vendorId });
  
      // 2. Format vendor's property listings
      const formattedVendorListing = vendorListings.map((property) => ({
        id: property._id,
        title: property.title,
        location: property.location,
        price: property.price,
        yield: property.yield,
        minInvestment: property.offeringDetails?.minInvestment ?? 0,
        image: property.images?.[0] ?? "",
        type: property.type,
        area: property.area,
        investedAmount: 1000, // Placeholder
        ownership: 0.2,       // Placeholder
        returns: 3000,        // Placeholder
        purchaseDate: property.createdAt,
      }));
  
      // Count total number of properties
      const totalProperties = vendorListings.length;
  
      // 3. Fetch vendor sales document
      const vendorSales = await SalesModel.findOne({ user: vendorId, role: "vendor" });
  
      // 4. Extract past 12 months sales for graph + Calculate total revenue/income for all time
      const past12MonthsSales = [];
      let totalIncome = 0;
      let totalRevenue = 0;
  
      const currentMonth = moment();
  
      // Check if monthlyData exists
      const monthlyDataMap = vendorSales?.monthlyData || new Map();
  
      // Loop through past 12 months for monthly breakdown
      for (let i = 0; i < 12; i++) {
        const monthKey = currentMonth.clone().subtract(i, 'months').format("MM-YYYY");
  
        const monthData = monthlyDataMap.get(monthKey);
  
        past12MonthsSales.push({
          month: monthKey,
          income: monthData?.totalIncome || 0,
          revenue: monthData?.totalRevenue || 0,
          salesCount: monthData?.salesCount || 0,
          transactionCount: monthData?.transactions?.length || 0,
        });
      }
  
      // Loop through all entries to calculate overall totals
      for (const [key, monthData] of monthlyDataMap.entries()) {
        totalIncome += monthData?.totalIncome || 0;
        totalRevenue += monthData?.totalRevenue || 0;
      }
  
      // 5. Return all dashboard data
      return res.status(200).json({
        vendorId,
        listings: formattedVendorListing,
        totalProperties,
        salesSummary: past12MonthsSales.reverse(),
        totalIncome,
        totalRevenue,
      });
  
    } catch (error) {
      console.error("Error fetching vendor dashboard data:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

module.exports = {vendordashboarddata};
