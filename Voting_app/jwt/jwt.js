const { config } = require('dotenv');
const jwt = require('jsonwebtoken');


// Middleware for authenticating JWT tokens
const jwtAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.data = decoded;  // Attach the decoded payload to req.data
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = {
    jwtAuthMiddleware
};