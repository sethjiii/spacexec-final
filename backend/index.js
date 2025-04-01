const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');

const nftRouter = require('./routes/nftRoutes')
const userRouter = require('./routes/userRoutes')
const propertyRouter = require('./routes/propertyRoutes'); // Fixed import

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(
    cors({
        // https://53c4-2401-4900-a18c-58f4-cdd4-8bcc-f50d-1323.ngrok-free.app/health
      origin: "http://51.79.146.251:8080", // Update this to match your frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // Allows cookies & authentication headers
    })
  );
// app.use(cors()); // Enable CORS for cross-origin requests
app.use(helmet()); // Security middleware
app.use(morgan('dev')); // HTTP request logger

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running!' });
});

// API Routes
app.use('/api/nft', nftRouter);
app.use('/api/users', userRouter);
app.use('/api/properties', propertyRouter); // Corrected import usage

// 404 Route Not Found Handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, error: 'API Route Not Found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

// Server Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
