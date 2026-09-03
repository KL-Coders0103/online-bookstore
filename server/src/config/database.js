const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
    try {
        await mongoose.connect(env.mongoUri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;