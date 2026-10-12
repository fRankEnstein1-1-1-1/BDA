const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
    };

    res.status(200).json({
        success: true,
        message: "Student Performance Analytics API is operational",
        database: states[dbState] || "unknown",
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use("/api/students", studentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server due to database connection error:", error.message);
        process.exit(1);
    }
};

startServer();