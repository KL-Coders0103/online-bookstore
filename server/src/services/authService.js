const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const registerUser = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail});
    
    if(existingUser) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;  
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};

const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if(!passwordMatches){
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
        userId: user._id.toString(),
        role: user.role,
        },
        env.jwtSecret,
        { expiresIn: '1h' }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    };
};

const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if(!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};

module.exports = { registerUser, loginUser, getCurrentUser };