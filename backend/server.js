const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); 



dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.use('/api/users', userRoutes);

// Mount product route
app.use('/api/products', productRoutes);

// Mount order route
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));