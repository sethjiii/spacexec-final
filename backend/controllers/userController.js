const User = require('../models/usersModel');
const Token = require('../models/NftTokenModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate default profile picture
        let profile_picture = `https://avatar.iran.liara.run/username?username=${name[0]}`;
        if (name.split(" ").length > 1) {
            let firstLetter = name.split(" ")[0][0];
            let lastLetter = name.split(" ")[1][0];
            profile_picture = `https://avatar.iran.liara.run/username?username=${firstLetter}+${lastLetter}`;
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user", // Default role is 'user'
            profile_pic: profile_picture,
            date_of_joining: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        });

        await newUser.save();

        // Generate JWT token
        const expiresIn = 50 * 24 * 60 * 60 * 1000; // 50 days
        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn });

        res.status(201).json({ message: "User registered successfully!", token, user: newUser });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error", error: error.message });
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
            }
        } else {
            // 🔹 Normal Email/Password Login
            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
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
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn });

        // Extract user details
        const { _id, name, profile_pic, role } = user;
        const u_email=user.email;

        // 🔹 Set authentication cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: expiresIn,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        // 🔹 Send response (now includes `name` and `email`)
        res.status(200).json({ token, _id, name, profile_pic, role, email:u_email });

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

        res.status(200).json({ token, _id, name, profile_pic, role, email: user.email });

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
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const user = await User.findById(userId).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Verify if a user owns NFTs (fragmented ownership validation)
const verifyNFTOwnership = async (req, res) => {
    try {
        const { userId, propertyId } = req.body;

        // Check if user owns at least one NFT for the property
        const token = await Token.findOne({ owner: userId, property: propertyId });
        if (!token) {
            return res.status(403).json({ message: 'User does not own any shares in this property' });
        }

        res.status(200).json({ message: 'User is a verified NFT owner', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete user account (only if no NFTs are owned)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;

        // Check if user owns any NFTs
        const ownedTokens = await Token.findOne({ owner: userId });
        if (ownedTokens) {
            return res.status(403).json({ message: 'User cannot be deleted while owning NFTs' });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Export all functions in a common export format
module.exports = {
    logout,
    registerUser,
    loginUser,
    getUserProfile,
    verifyNFTOwnership,
    getAllUsers,
    deleteUser,
    loginWithEmailPassword
};
