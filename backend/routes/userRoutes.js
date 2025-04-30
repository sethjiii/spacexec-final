const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    verifyNFTOwnership,
    getAllUsers,
    deleteUser,
    logout
} = require('../controllers/userController');
const { dashboarddata } = require('../controllers/dashboardController');
const { admindashboarddata, alluserdata, allvendordata } = require('../controllers/adminDashboardController');
const { addComplaint, getActiveSupportTickets, findTicketBySupportId, addChatToTicket } = require('../controllers/supprtController');
const { vendordashboarddata } = require('../controllers/vendorDashboardController');

const userRouter = express.Router();

// User Authentication Routes
userRouter.post('/register', registerUser);  // Register a new user
userRouter.post('/login', loginUser);  // User login
userRouter.post('/logout', logout);  // User login

// complains 
userRouter.post('/addcomplaint',addComplaint)
userRouter.post('/addchat',addChatToTicket)
userRouter.get('/getchat/:supportId',findTicketBySupportId)
userRouter.get('/activetickets/:userId',getActiveSupportTickets)

// User Profile & Ownership
userRouter.get('/:userId', getUserProfile);  // Get user profile
userRouter.get('/dashboard/:userId', dashboarddata);  // Get user profile
userRouter.post('/verify-nft', verifyNFTOwnership);  // Verify if user owns NFTs
userRouter.get('/all', getAllUsers);  // Get all users
userRouter.delete('/delete/:userId', deleteUser);  // Delete user (if no NFTs are owned)



// admin routes
userRouter.post('/admindashboard',admindashboarddata);
userRouter.post('/admindashboard/usersdata',alluserdata);
userRouter.post('/admindashboard/vendorsdata',allvendordata);

// vendor routes
userRouter.post('/vendordashboard/:vendorId',vendordashboarddata);
module.exports = userRouter;
