// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const Vendor = require("../models/vendorModel");

// Base middleware: verifies token and attaches user
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Admin check
const isAdmin = (req, res, next) => {
    console.log("req.user.role")
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Vendor check
const isVendor = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Access denied. Vendor role required" });
    }

    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    if (vendor.status !== "active") {
      return res
        .status(403)
        .json({
          message: "Vendor account is not active",
          status: vendor.status,
        });
    }

    if (!vendor.isVerified) {
      return res.status(403).json({ message: "Vendor account not verified" });
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    console.error("Error in isVendor middleware:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Vendor or Admin check
const isVendorOrAdmin = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return next();
    }
    if (req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Access denied. Vendor or admin role required" });
    }
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }
    if (vendor.status !== "active") {
      return res
        .status(403)
        .json({
          message: "Vendor account is not active",
          status: vendor.status,
        });
    }
    if (!vendor.isVerified) {
      return res.status(403).json({ message: "Vendor account not verified" });
    }
    req.vendor = vendor;
    next();
  } catch (error) {
    console.error("Error in isVendorOrAdmin middleware:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { auth, isAdmin, isVendor, isVendorOrAdmin };
