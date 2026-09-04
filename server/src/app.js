const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const app = express();

app.use(helmet());
app.use(cors({
    origin: env.clientUrl,
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Online Bookstore API!' });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.statusCode || 500).json({
    message: error.statusCode
      ? error.message
      : "Internal server error",
  });
});

module.exports = app;