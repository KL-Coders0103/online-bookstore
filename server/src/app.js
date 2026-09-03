const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require("./config/env");
const app = express();

app.use(helmet());
app.use(cors({
    origin: env.clientUrl,
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Online Bookstore API!' });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

module.exports = app;