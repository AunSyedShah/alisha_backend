// routes/shopRoutes.js
const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const { verifyToken, verifyManagerRole } = require('../middlewares/authMiddleware');
const { serializeShops } = require("../utils/serializeShops.js")

// Get all shops
router.get('/shops', verifyToken, async (req, res) => {
    try {
        const { user } = req;
        const { role } = user;
        let shops = null;
        if (role == 'manager') {
            // shops only for logged in user
            shops = await Shop.find({ manager: user.user_id }).populate('products').populate('manager', 'username');
        }
        else if (role == 'customer') {
            shops = await Shop.find().populate('products').populate('manager', 'username');

        }
        // console.log(shops)
        // const serializedShops = serializeShops(shops);
        // console.log(serializedShops)
        res.json(shops);
        // res.json(serializedShops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Get single shop by ID
router.get('/shops/:id', async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('manager', 'username');
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add a new shop
router.post('/shops', verifyToken, verifyManagerRole, async (req, res) => {
    try {
        const { name, products } = req.body;
        const shop = new Shop({ name, manager: req.user.user_id, products });
        await shop.save();
        res.status(201).json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update a shop
router.put('/shops/:id', verifyToken, verifyManagerRole, async (req, res) => {
    try {
        const { name, products } = req.body;
        const updatedShop = await Shop.findByIdAndUpdate(req.params.id, { name, products }, { new: true });
        res.json(updatedShop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete a shop
router.delete('/shops/:id', verifyToken, verifyManagerRole, async (req, res) => {
    try {
        await Shop.findByIdAndDelete(req.params.id);
        res.json({ message: 'Shop deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
