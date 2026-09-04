const { registerUser, loginUser, getCurrentUser } = require("../services/authService");

const register = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const user = await loginUser(req.body);
        res.status(200).json({
            message: "User logged in successfully",
            ...user,
        });
    } catch (error) {
        next(error);
    }
};

const me = async (req, res, next) => {
    try {
        const user = await getCurrentUser(req.user.id);
        res.status(200).json({
            message: "Current user retrieved successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, me };