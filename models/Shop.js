// models/Shop.js
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        ],
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
);

module.exports = mongoose.model('Shop', shopSchema);
