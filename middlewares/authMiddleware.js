const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // bearer token
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token is required' });
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
}

function verifyManagerRole(req, res, next) {
    // Assuming the user object is attached to the request
    const user = req.user;

    // Check if user is not a manager
    if (user.role !== 'manager') {
        return res.status(403).json({ message: 'Access denied. You are not authorized to perform this action.' });
    }

    // If user is a manager, proceed to the next middleware or route handler
    next();
}

module.exports = { verifyToken, verifyManagerRole };
