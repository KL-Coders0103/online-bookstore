const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authenticate = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if(!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const token = authorization.split(' ')[1];

        if(!token) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const decoded = jwt.verify(token, env.jwtSecret);

        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}

module.exports = authenticate;