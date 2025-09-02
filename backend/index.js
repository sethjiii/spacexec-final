const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");

// Routers
const nftRouter = require("./routes/nftRoutes");
const userRouter = require("./routes/userRoutes");
const propertyRouter = require("./routes/propertyRoutes");
const vendorRouter = require("./routes/vendorRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS setup from env
const allowedOrigins = [
  process.env.FRONTEND_URL, // dev frontend
  process.env.PROD_FRONTEND_URL, // prod frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());
app.use(morgan("dev"));

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "🚀 Server is running!" });
});

// API Routes
app.use("/api/nft", nftRouter);
app.use("/api/users", userRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/vendors", vendorRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "API Route Not Found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
