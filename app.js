require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const shopRoutes = require('./routes/shopRoutes.js');
const cors = require('cors');

const app = express(); // initialize express
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/auth_demo').then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));
async function connectToDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/auth_demo');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}
connectToDB();

app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', shopRoutes);
app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`)
});
