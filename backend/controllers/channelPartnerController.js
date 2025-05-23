const channelPartnerModel = require("../models/channelPartnerModel");
const ChannelPartner = require("../models/channelPartnerModel");
const usersModel = require("../models/usersModel");
const bcrypt=require("bcrypt")
const COMMISSION_PERCENTAGE = 2; 

const createChannelPartner = async (req, res) => {
  try {
    const { name, mobile, email, company, location, addedBy, user_identity } =
      req.body;

    // user_identity->

    console.log(req.body);

    // Validate required fields
    if (!name || !mobile || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the channel partner already exists based on email or mobile
    const existingPartner = await ChannelPartner.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingPartner) {
      return res.status(400).json({
        message: "Channel partner with this email or mobile already exists",
      });
    }

    // Create new channel partner
    const newChannelPartner = new ChannelPartner({
      name,
      mobile,
      email,
      company: company ?? "", // optional field
      location: location ?? "", // optional field
      addedBy, // ID of the user who added the channel partner
      user_identity,
    });

    const savedChannelPartner = await newChannelPartner.save();

    const alreadySaveduser = await usersModel.findById(user_identity);

    if (!alreadySaveduser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update if channel_partner_id is not already set
    if (!alreadySaveduser.channel_partner_id) {
      alreadySaveduser.channel_partner_id = savedChannelPartner._id;
      await alreadySaveduser.save();
    }

    res.status(201).json({
      message: "Channel partner created successfully",
      channelPartner: savedChannelPartner,
    });
  } catch (error) {
    console.error("Error creating channel partner:", error);
    res
      .status(500)
      .json({ error: "Server error while creating channel partner" });
  }
};

function generateMeaningfulPassword(name) {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  const cleanName = name.split(" ")[0].toLowerCase(); // first name only, lowercase
  return `${cleanName}@${randomNum}`; // e.g., "john@4821"
}



const addLeadUserByChannelPartner = async (req, res) => {
  try {
    const { name, email, mobile,userId } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await usersModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const generatedPassword = generateMeaningfulPassword(name);
    console.log(generatedPassword);
    const savedUserAsWellAsCp=await usersModel.findById(userId);
    const channel_partner_id=savedUserAsWellAsCp.channel_partner_id;

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Generate default profile picture
    let profile_picture = `https://avatar.iran.liara.run/username?username=${name[0]}`;
    if (name.split(" ").length > 1) {
        let firstLetter = name.split(" ")[0][0];
        let lastLetter = name.split(" ")[1][0];
        profile_picture = `https://avatar.iran.liara.run/username?username=${firstLetter}+${lastLetter}`;
    }

    const newUser = new usersModel({
      name,
      email,
      phone:mobile,
      password: hashedPassword,
      my_channel_partner: channel_partner_id, // Make sure to hash this in a middleware
      date_of_joining: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }),
    profile_pic:profile_picture
    });

    const savedUser = await newUser.save();

    const updatedPartner = await ChannelPartner.findByIdAndUpdate(
        channel_partner_id,
      { $push: { usersAddedByPartner: savedUser._id } },
      { new: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({ message: "Channel partner not found" });
    }

    res.status(201).json({
      message: "User added under channel partner successfully",
      user: savedUser,
      generatedPassword, // send this to admin/frontend to share with user
      updatedPartner,
    });
  } catch (error) {
    console.error("Error adding lead user:", error);
    res.status(500).json({ error: "Server error while adding user" });
  }
};


const getChannelPartnerByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const user = await usersModel.findById(userId);
      if (!user || !user.channel_partner_id) {
        return res.status(404).json({ message: "User or associated channel partner not found" });
      }
  
      const channelPartner = await channelPartnerModel.findById(user.channel_partner_id)
      .populate({
        path: 'usersAddedByPartner',
        populate: {
          path: 'investedProperties.propertyId',
          model: 'Property'
        }
      });
    
      let totalCommission = 0;

      channelPartner.usersAddedByPartner.forEach(user => {
        user.investedProperties.forEach(inv => {
          const price = inv.propertyId?.price || 0;
          const share = inv.sharePercentage || 0;
          const investmentAmount = price * (share / 100); // assuming share is in %
          const commission = investmentAmount * (COMMISSION_PERCENTAGE / 100);
          totalCommission += commission;
        });
      });
      
      console.log(`Total commission for Channel Partner: ₹${totalCommission.toFixed(2)}`);
    
  
      if (!channelPartner) {
        return res.status(404).json({ message: "Channel partner not found" });
      }
  
      const leads = channelPartner.usersAddedByPartner.map((lead, index) => ({
        id: lead._id, // e.g., L-001
        name: lead.name,
        mobile: lead.phone,
        email: lead.email,
        status: lead.status || "active", // default to active if undefined
      }));
  
      res.status(200).json({
        message: "Leads fetched successfully",
        leads,
        totalCommission
      });
    } catch (error) {
      console.error("Error finding channel partner leads by user ID:", error);
      res.status(500).json({ message: "Server error while finding leads" });
    }
  };
  

module.exports = { createChannelPartner, addLeadUserByChannelPartner,getChannelPartnerByUserId };
