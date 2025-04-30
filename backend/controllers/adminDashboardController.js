const NftTokenModel = require("../models/NftTokenModel");
const propertyModels = require("../models/propertyModels");
const TicketsModel = require("../models/TicketsModel");
const usersModel = require("../models/usersModel");

const admindashboarddata = async (req, res) => {
  try {
    // total revenue
    let total_revenue = await NftTokenModel.aggregate([
      {
        $group: {
          _id: null, // Use null to aggregate over all documents
          total: { $sum: "$purchasePrice" }, // Use $purchasePrice with a $ sign
        },
      },
    ]);
    total_revenue = total_revenue[0].total;

    console.log(total_revenue);
    const usercount = await usersModel.countDocuments();

    const userRoleCounts = await usersModel.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const formattedUserRoleCounts = {};
    userRoleCounts.forEach((item) => {
      formattedUserRoleCounts[item._id] = item.count;
    });

    const propertycount = await propertyModels.countDocuments();

    const propertyStatusCounts = await propertyModels.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const formattedPropertyStatusCounts = {};
    propertyStatusCounts.forEach((item) => {
      formattedPropertyStatusCounts[item._id] = item.count;
    });

    // pie chart data
    const propertyChartCounts = await propertyModels.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const formattedPropertyChartCounts = {};
    propertyChartCounts.forEach((item) => {
      formattedPropertyChartCounts[item._id] = item.count;
    });

    console.log(formattedPropertyChartCounts);

    // const formatted_pie = [];

    // Object.entries(formattedPropertyChartCounts).forEach(([key, value]) => {
    //   formatted_pie.push({
    //     name: key,
    //     value: value,
    //   });
    // });

    // console.log(formatted_pie);

    // support analytics
    const support_count = await TicketsModel.countDocuments();

    const ticketStatusCounts = await TicketsModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const formattedTicketStatusCounts = {};
    ticketStatusCounts.forEach((item) => {
      formattedTicketStatusCounts[item._id] = item.count;
    });

    const tickets = await TicketsModel.find()
      .populate({ path: "complainer", select: "name email phone" })
      .sort({ createdAt: -1 });

    const formattedSupportTickets = tickets.map((ticket, index) => {
      return {
        id: ticket.support_id, // Or use ticket._id.toString() for unique Mongo IDs
        subject: ticket.subject,
        chats: ticket.chats,
        status: ticket.status,
        customer: ticket.complainer?.name || "Unknown",
        priority: "high", // You can customize this logic
        created: timeSince(ticket.createdAt) + " ago", // Helper to format time
      };
    });

    const admin_params = {
      total_revenue,
      total_users: usercount,
      total_properties: propertycount,
      usersByRole: formattedUserRoleCounts,
      propertiesByStatus: formattedPropertyStatusCounts,
      formattedTicketStatusCounts,
      support_count,
      
    };

    const dashboardStats = {
      admin_params,
      support_tickets: formattedSupportTickets,
      formatted_pie:formattedPropertyChartCounts
    };

    console.log(dashboardStats);

    res.status(200).json(dashboardStats);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const alluserdata = async (req, res) => {
  try {
    const users = await usersModel.find({}, 'name email phone investedProperties createdAt role');

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role:user.role,
      phone: user.phone || "N/A",
      investments: user.investedProperties?.length || 0,
      joinedDate: new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const allvendordata = async (req, res) => {
  try {
    const users = await usersModel.find(
      { role: 'vendor' },
      'isVerified name email phone investedProperties createdAt role'
    );

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      type: user.role,
      status: user.isVerified,
      ratings: "5",
      phone: user.phone || "N/A",
      properties: user.investedProperties?.length || 0,
      joinedDate: new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching vendor data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Helper function to format time difference
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes";
  return Math.floor(seconds) + " seconds";
}

module.exports = { admindashboarddata,alluserdata,allvendordata};
