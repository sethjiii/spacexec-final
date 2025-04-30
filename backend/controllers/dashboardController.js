const User = require("../models/usersModel");
const Investment = require("../models/propertyModels"); // Ensure you import the Investment model
const Portfolio = require("../models/NftTokenModel"); // Ensure you import the Portfolio model

const dashboarddata = async (req, res) => {
    try {
      const { userId } = req.params; // Get user ID from URL params
  
      // Fetch user and populate necessary data
      const user = await User.findById(userId)
        .select("-password") // Exclude sensitive fields
        .populate({
          path: "investedProperties.propertyId", // Populate the `propertyId` in `investedProperties`
        //   select: "title location price yield image type area", // Fields to retrieve from the referenced property document
        })
        .populate({
            path: "ownedTokens",
            populate: {
              path: "property", // This will populate the property field inside ownedTokens
              model: "Property",
            },
          }).populate("wishlist"); // Populate the ownedTokens field (adjust if necessary)

          // console.log(user);
      // If the user is not found
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(user.ownedTokens)

      const wishlist = user.wishlist.map((property) => ({
        id: property._id,
        title: property.title,
        location: property.location,
        price: property.price,
        yield: property.yield,
        minInvestment: property.offeringDetails?.minInvestment ?? 0, // Default value
        image: property.images?.[0] ?? "", // Handle missing images
        type: property.type,
        area: property.area,
        investedAmount: 1000, // Hardcoded?
        ownership: 0.2, // Hardcoded?
        returns: 3000, // Hardcoded?
        purchaseDate: property.createdAt,
      }));
      // Calculate total invested amount from owned tokens
      const totalInvestedFromTokens = user.ownedTokens.reduce((acc, token) => {
        return acc + (token.purchasePrice * token.sharesOwned); // Multiply purchasePrice by sharesOwned
      }, 0);

      const totalReturns = user.ownedTokens.reduce((acc, token) => {
        return acc + (token.calculatedReturn);
      }, 0);
    
  
      // Data for pie chart (residential/commercial etc.)
      const data = [
        { name: "Residential", value: 57 },
        { name: "Commercial", value: 33 },
        { name: "Vacation", value: 10 },
      ];


      // Data for monthly investment tracking (bar graph)
      const data1 = [
        { name: "Jan", invested: 5000, totalInvested: 5000, portfolioValue: 5200 },
        { name: "Feb", invested: 3000, totalInvested: 8000, portfolioValue: 8500 },
        { name: "Mar", invested: 2000, totalInvested: 10000, portfolioValue: 10200 },
        { name: "Apr", invested: 4000, totalInvested: 14000, portfolioValue: 14500 },
        { name: "May", invested: 3500, totalInvested: 17500, portfolioValue: 18000 },
        { name: "Jun", invested: 4500, totalInvested: 22000, portfolioValue: 22500 },
      ];

      const portfolio = user.ownedTokens
  .filter((token) => token.property) // Filter out tokens where property is missing
  .map((token) => ({
    nftToken: token.tokenId,
    id: token.property._id,
    title: token.property.name,
    location: token.property.location,
    price: token.property.price,
    yield: token.property.yield,
    minInvestment: token.property.offeringDetails?.minInvestment || 0,
    image: token.property.images?.[0] || "",
    type: token.property.type,
    area: token.property.area,
    investedAmount: token.purchasePrice,
    ownership: ((token.sharesOwned / token.property.totalShares) * 100).toFixed(2),
    returns: ((token.sharesOwned * token.property.pricePerShare) * (token.property.yield / 100)).toFixed(2),
    purchaseDate: token.createdAt,
  }));

      

      console.log("portfolio_");
      console.log(user.ownedTokens);
      

      const portfolio_ = user.investedProperties
  .filter((property) => property.propertyId) // Filter out deleted properties
  .map((property) => ({
    id: property.propertyId._id,
    title: property.propertyId.title,
    location: property.propertyId.location,
    price: property.propertyId.price,
    yield: property.propertyId.yield,
    minInvestment: property.propertyId.offeringDetails?.minInvestment || 0,
    image: property.propertyId.images?.[0] || "",
    type: property.propertyId.type,
    area: property.propertyId.area,
    investedAmount: 1000,
    ownership: 0.2,
    returns: 3000,
    purchaseDate: property.createdAt,
  }));

  
      // Define the response structure with user data and charts
      const response = {
        userData: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          joinedDate: user.createdAt,
          totalInvestments: user.investedProperties.length, // Calculate number of investments
          totalInvested: totalInvestedFromTokens, // Set totalInvested based on owned tokens
          totalReturns: totalReturns, // Sum of returns
          portfolio,
          wishlist, // Assuming wishlist is stored in the user model
          transactions: user.transactions || [], // Assuming transactions are stored in the user model
          notifications: user.notifications || [], // Assuming notifications are stored in the user model
        },
        charts: {
          pieChartData: data, // Data for the pie chart
          monthlyTrackData: data1, // Data for monthly investment tracking bar graph
        },
      };
  
    //   console.log(response)

      // Send the response
      res.status(200).json({
        message: "Dashboard data fetched successfully",
        data: response, // Return the calculated response
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  

module.exports = { dashboarddata };
