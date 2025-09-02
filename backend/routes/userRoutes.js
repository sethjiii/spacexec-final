const express = require('express');
const User = require('../models/usersModel'); // ✅ Make sure this matches your actual filename exactly

const {
    registerUser,
    loginUser,
    getUserProfile,
    verifyNFTOwnership,
    getAllUsers,
    deleteUser,
    logout,
    loginWithEmailPassword,
    sendRegistrationLink,
    completeRegistration,
    forgotPassword,
    resetPassword
} = require('../controllers/userController');

const { dashboarddata } = require('../controllers/dashboardController');
const { admindashboarddata, alluserdata, allvendordata } = require('../controllers/adminDashboardController');
const { addComplaint, getActiveSupportTickets, findTicketBySupportId, addChatToTicket } = require('../controllers/supprtController');
const { vendordashboarddata } = require('../controllers/vendorDashboardController');
const { 
    createChannelPartner, 
    addLeadUserByChannelPartner, 
    getChannelPartnerByUserId, 
    getAllChannelPartner, 
    upgradeUserToChannelPartner 
} = require('../controllers/channelPartnerController');

const userRouter = express.Router();

// ========================
// Auth Routes
// ========================
userRouter.post('/register', sendRegistrationLink);
userRouter.post('/forgotpassword', forgotPassword);
userRouter.post('/resetpassword', resetPassword);
userRouter.get('/verify-registration/:token', completeRegistration);
userRouter.post('/login', loginUser);
userRouter.post('/loginwithemail', loginWithEmailPassword);
userRouter.post('/logout', logout);

// ========================
// Complaints / Support
// ========================
userRouter.post('/addcomplaint', addComplaint);
userRouter.post('/addchat', addChatToTicket);
userRouter.get('/getchat/:supportId', findTicketBySupportId);
userRouter.get('/activetickets/:userId', getActiveSupportTickets);

// ========================
// Dashboard & Profile
// ========================
userRouter.get('/dashboard/:userId', dashboarddata);
userRouter.post('/verify-nft', verifyNFTOwnership);
userRouter.get('/all', getAllUsers);
userRouter.delete('/delete/:userId', deleteUser);

// ========================
// Admin Routes
// ========================
userRouter.post('/admindashboard', admindashboarddata);
userRouter.post('/admindashboard/usersdata', alluserdata);
userRouter.post('/admindashboard/vendorsdata', allvendordata);

// ========================
// Vendor Routes
// ========================
userRouter.post('/vendordashboard/:vendorId', vendordashboarddata);

// ========================
// Channel Partner Routes
// ========================
userRouter.post('/channelpartner/create', createChannelPartner);
userRouter.post('/getallchannelpartner', getAllChannelPartner);
userRouter.post('/upgrade-user', upgradeUserToChannelPartner);
userRouter.post('/channelpartner/addleads', addLeadUserByChannelPartner);
userRouter.get('/channelpartner/getallleads/:userId', getChannelPartnerByUserId);

// ========================
// Notifications Route
// ========================
userRouter.get('/notifications/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("notifications");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const notifications = user.notifications || [];
        const unreadCount = notifications.filter(n => !n.read).length;

        res.json({ notifications, unreadCount });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

// ========================
// User Profile (keep last to avoid route conflicts)
// ========================
userRouter.get('/:userId', getUserProfile);

module.exports = userRouter;
