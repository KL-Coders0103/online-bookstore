const env = require("./config/env");
const app = require("./app");
const connectDB = require("./config/database");

const startServer = async () => {
    await connectDB();
    const server = app.listen(env.port, () => {
        console.log(`Server running on port ${env.port}`);
    });

    server.on("error", (error) => {
        console.error("Error starting server:", error);
        process.exit(1);
    });
};

startServer();