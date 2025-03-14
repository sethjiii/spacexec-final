const User = require('../models/usersModel');
const Token = require('../models/NftTokenModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// User login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)

        // Check if user exists
        const user = await User.findOne({ email });
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
    registerUser,
    loginUser,
    getUserProfile,
    verifyNFTOwnership,
    getAllUsers,
    deleteUser
};
