const mongoose = require("mongoose");

/**
 * Connect to MongoDB using the connection string in process.env.MONGO.
 * Keeps credentials secure and handles connection lifecycle events.
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO;

        if (!mongoURI) {
            console.error("MongoDB connection error: MONGO environment variable is not defined.");
            process.exit(1);
        }

        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
