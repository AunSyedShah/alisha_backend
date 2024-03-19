const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middlewares/authMiddleware');

// Function to generate access token
function generateAccessToken(user) {
    return jwt.sign({ username: user.username, role: user.role, user_id:user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
}

// Function to generate refresh token
function generateRefreshToken(user) {
    return jwt.sign({ username: user.username, role: user.role }, '12345', { expiresIn: '7d' });
}

// Define the route handler for retrieving user information
router.get('/user', verifyToken, async (req, res) => {
    try {
        // Extract the user object from the request object (set by the verifyToken middleware)
        const user = req.user;
        console.log(user);

        // Find the user in the database based on the username obtained from the JWT payload
        const foundUser = await User.findOne({ username: user.username });

        // Check if user exists
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user exists, return user information
        res.status(200).json(foundUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ message: 'Username, password, and role are required' });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).json({ message: 'Logged in successfully', accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }
    jwt.verify(refreshToken, 'refreshTokenSecret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        const accessToken = generateAccessToken(user);
        res.status(200).json({ accessToken });
    });
});

router.post('/logout', verifyToken, (req, res) => {
    // Implement logout logic here if needed
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
