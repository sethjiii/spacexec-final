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
const { auth, isAdmin, isVendor, isVendorOrAdmin } = require('../middlewares/verifyAuth');

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
userRouter.post('/logout',auth, logout);

// ========================
// Complaints / Support
// ========================
userRouter.post('/addcomplaint',auth,addComplaint);
userRouter.post('/addchat',auth, addChatToTicket);
userRouter.get('/getchat/:supportId',auth, findTicketBySupportId);
userRouter.get('/activetickets/:userId',auth,getActiveSupportTickets);

// ========================
// Dashboard & Profile
// ========================
userRouter.get('/dashboard/:userId', auth, dashboarddata);
userRouter.post('/verify-nft', auth, verifyNFTOwnership);
userRouter.get('/all', auth, isAdmin, getAllUsers); 
userRouter.delete('/delete/:userId', auth, isAdmin, deleteUser); 

// ========================
// Admin Routes
// ========================
userRouter.post('/admindashboard', auth, isAdmin, admindashboarddata);
userRouter.post('/admindashboard/usersdata', auth, isAdmin, alluserdata);
userRouter.post('/admindashboard/vendorsdata', auth, isAdmin, allvendordata);

// ========================
// Vendor Routes
// ========================
userRouter.post('/vendordashboard/:vendorId', auth, isVendor, vendordashboarddata);

// ========================
// Channel Partner Routes
// ========================
userRouter.post('/channelpartner/create', auth, createChannelPartner);
userRouter.post('/getallchannelpartner', auth, isAdmin, getAllChannelPartner); // ✅ only admins should fetch all
userRouter.post('/upgrade-user', auth, isAdmin, upgradeUserToChannelPartner); // ✅ admin action
userRouter.post('/channelpartner/addleads', auth, isVendorOrAdmin, addLeadUserByChannelPartner);
userRouter.get('/channelpartner/getallleads/:userId', auth, isVendorOrAdmin, getChannelPartnerByUserId);

// ========================
// Notifications Route
// ========================
userRouter.get('/notifications/:userId',auth, async (req, res) => {
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
userRouter.get('/:userId', auth,getUserProfile);

module.exports = userRouter;
