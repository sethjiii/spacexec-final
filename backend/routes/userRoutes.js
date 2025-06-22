const express = require('express');
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
const { createChannelPartner, addLeadUserByChannelPartner, getChannelPartnerByUserId, getAllChannelPartner, upgradeUserToChannelPartner } = require('../controllers/channelPartnerController');

const userRouter = express.Router();

// User Authentication Routes
userRouter.post('/register', sendRegistrationLink);  // Register a new user
userRouter.post('/forgotpassword', forgotPassword);  // Register a new user
userRouter.post('/resetpassword', resetPassword);  // Register a new user
userRouter.get('/verify-registration/:token', completeRegistration);  // Register a new user
userRouter.post('/login', loginUser);  // User login
userRouter.post('/loginwithemail', loginWithEmailPassword);  // User login
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


// channel partener routes
userRouter.post('/channelpartner/create',createChannelPartner);
userRouter.post('/getallchannelpartner',getAllChannelPartner);
userRouter.post("/upgrade-user", upgradeUserToChannelPartner);
userRouter.post('/channelpartner/addleads',addLeadUserByChannelPartner);
userRouter.get('/channelpartner/getallleads/:userId',getChannelPartnerByUserId);
module.exports = userRouter;


async function sendData() {
    try {
      const response = await fetch('http://localhost:5001/some-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'Jay', age: 22 })
      });
  
      const data = await response.json();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
  
  sendData();

  
  const sendData1=async()=>{
    try{
        const res=await fetch('dafa',{
            method:'post',
            headers:{
                'content-Type':express.application
            }
        })

    }catch(error){
        console.log(error);
    }

  }