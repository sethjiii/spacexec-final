const User = require("../models/usersModel");
const Token = require("../models/NftTokenModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { sendSpaceXecJoiningEmail, sendVerificationEmail, sendForgotPasswordEmailWithExpiry } = require("../middlewares/nodemailer");

const resetPassword = async (req, res) => {
    const { email, token, password } = req.body;
  console.log(req.body)
    try {
      // Find user by email and matching reset token which is not expired
      const user = await User.findOne({
        email,
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
  
      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update user password and remove reset token fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Server error, please try again later" });
    }
  };
  
// Register a new user

const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User with that email not found" });
      }
  
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpire = Date.now() + 3600000; // 1 hour
  
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpire;
      await user.save();
  
      const resetUrl = `http://localhost:8080/reset-password?token=${resetToken}&email=${email}`;
  
      const message = `
        <h1>Password Reset Request</h1>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset for your SpaceXec account.</p>
        <p>Please click the link below to reset your password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
      `;
      const name=email.split('@')[0];
  
      await sendForgotPasswordEmailWithExpiry(name,email,resetUrl);
  
      res.json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Server error, please try again later" });
    }
  };
  

const sendRegistrationLink = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      // Check for required fields
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }
  
      // Generate encrypted token with user data
      const token = jwt.sign({ name, email, password, role }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });
  
    //   const registrationLink = `http://localhost:5000/api/users/verify-registration/${token}`;
  
      const userData = {
        name, email, password, role
      };
      
      sendVerificationEmail(userData);
  
      res.status(200).json({ message: "Registration link sent successfully" });
    } catch (error) {
      console.error("Error sending registration email:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const completeRegistration = async (req, res) => {
    try {
      const token = req.params.token;
  
      // 1. Decode token
      const { name, email, password, role } = jwt.verify(token, process.env.JWT_SECRET);
  
      // 2. Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // 3. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 4. Create profile pic
      let profile_picture = `https://avatar.iran.liara.run/username?username=${name[0]}`;
      if (name.split(" ").length > 1) {
        let firstLetter = name.split(" ")[0][0];
        let lastLetter = name.split(" ")[1][0];
        profile_picture = `https://avatar.iran.liara.run/username?username=${firstLetter}+${lastLetter}`;
      }
  
      // 5. Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
        profile_pic: profile_picture,
        date_of_joining: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
  
      await newUser.save();
  
      // 6. Issue final login token
      const authToken = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "50d" }
      );
  
      res.status(201).json({
        message: "User registered successfully!",
        token: authToken,
        user: newUser,
      });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(400).json({ message: "Invalid or expired link", error: err.message });
    }
  };
  
const logout = async (req, res) => {
  try {
    console.log("logout");
    // Clear the JWT cookie
    res.clearCookie("token");

    // Optionally, destroy the session if you're using sessions
    // req.session.destroy();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password, googleUser } = req.body; // Handle both login types

    let user;

    // 🔹 Google Sign-In Handling
    if (googleUser) {
      const { uid, email, displayName, photoURL, emailVerified } = googleUser;

      if (!emailVerified) {
        return res.status(400).json({ error: "Email not verified" });
      }

      // Check if the user already exists in the database
      user = await User.findOne({ email });

      if (!user) {
        // If new Google user, create an account
        user = new User({
          name: displayName,
          email,
          profile_pic: photoURL,
          google_uid: uid,
          role: "user", // Default role for new Google users
        });

        await user.save();
        sendSpaceXecJoiningEmail(displayName, email);
      }
    } else {
      // 🔹 Normal Email/Password Login
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // Find user in the database
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email" });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
    }

    // 🔹 Set token expiration based on role
    let expiresIn;
    switch (user.role) {
      case "admin":
        expiresIn = 6 * 60 * 60 * 1000; // 6 hours
        break;
      case "vendor":
        expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      case "channel-partner":
        expiresIn = 10 * 24 * 60 * 60 * 1000; // 10 days
        break;
      default:
        expiresIn = 30 * 24 * 60 * 60 * 1000; // 30 days
    }

    // 🔹 Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Extract user details
    const { _id, name, profile_pic, role } = user;
    const u_email = user.email;

    // 🔹 Set authentication cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: expiresIn,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // 🔹 Send response (now includes `name` and `email`)
    res
      .status(200)
      .json({ token, _id, name, profile_pic, role, email: u_email });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

const loginWithEmailPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Set token expiration based on role
    let expiresIn;
    switch (user.role) {
      case "admin":
        expiresIn = 6 * 60 * 60 * 1000;
        break;
      case "vendor":
        expiresIn = 7 * 24 * 60 * 60 * 1000;
        break;
      case "channel-partner":
        expiresIn = 10 * 24 * 60 * 60 * 1000;
        break;
      default:
        expiresIn = 30 * 24 * 60 * 60 * 1000;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    const { _id, name, profile_pic, role } = user;

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: expiresIn,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res
      .status(200)
      .json({ token, _id, name, profile_pic, role, email: user.email });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify if a user owns NFTs (fragmented ownership validation)
const verifyNFTOwnership = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    // Check if user owns at least one NFT for the property
    const token = await Token.findOne({ owner: userId, property: propertyId });
    if (!token) {
      return res
        .status(403)
        .json({ message: "User does not own any shares in this property" });
    }

    res.status(200).json({ message: "User is a verified NFT owner", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user account (only if no NFTs are owned)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if user owns any NFTs
    const ownedTokens = await Token.findOne({ owner: userId });
    if (ownedTokens) {
      return res
        .status(403)
        .json({ message: "User cannot be deleted while owning NFTs" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Export all functions in a common export format
module.exports = {
  logout,
  sendRegistrationLink,
  completeRegistration,
  loginUser,
  getUserProfile,
  verifyNFTOwnership,
  getAllUsers,
  deleteUser,
  loginWithEmailPassword,
  forgotPassword,
  resetPassword
};
