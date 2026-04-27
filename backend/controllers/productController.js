const Product = require('../models/Product');
const User = require('../models/User'); // We need this to find Admins
const Notification = require('../models/Notification'); // Our new model!
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public (Anyone can see products)
const getProducts = async (req, res) => {
    try {
        // 1. Get filter values from the URL (e.g., /api/products?keyword=ps5&category=electronics)
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i', // 'i' means case-insensitive (ps5 vs PS5 doesn't matter)
            },
        } : {};

        const category = req.query.category ? { category: req.query.category } : {};

        // 2. Combine the filters
        const products = await Product.find({ ...keyword, ...category });
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Only Sellers or Admins)
const createProduct = async (req, res) => {
    try {
        // Security Check: Only let sellers or admins add inventory
        if (req.user.role !== 'seller' && req.user.role !== 'admin' && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied: Only sellers or admins can create products' });
        }

        const { name, price, description, image, brand, category, countInStock } = req.body;

        const product = new Product({
            user: req.user.id, // This comes from our authMiddleware!
            name,
            price,
            description,
            image,
            brand,
            category,
            countInStock,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error. Invalid ID format.' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, image, brand, category, countInStock } = req.body;
        
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // OWNERSHIP & ADMIN CHECK: 
        // 1. Is the person logged in NOT the creator of the product?
        // 2. AND is the person logged in NOT an Admin?
        if (product.user.toString() !== req.user.id && req.user.role !== 'admin' && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized! You must be the seller or an Admin.' });
        }

        // Update fields if they exist in the request, otherwise keep the old ones
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        // ... (Keep your existing ownership check and field updates) ...
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

        const updatedProduct = await product.save();

        // --- NEW: LOW STOCK NOTIFICATION LOGIC ---
        if (updatedProduct.countInStock <= 5) {
            let message = `Low Stock Alert: ${updatedProduct.name} only has ${updatedProduct.countInStock} left!`;
            if (updatedProduct.countInStock === 0) {
                message = `Out of Stock: ${updatedProduct.name} is completely sold out!`;
            }

            // 1. Notify the Seller
            await Notification.create({
                user: updatedProduct.user,
                message: message
            });

            // 2. Notify all Admins
            const admins = await User.find({ role: 'admin' }); // Or isAdmin: true, depending on your setup
            for (let i = 0; i < admins.length; i++) {
                // Don't send a duplicate if the seller IS the admin
                if (admins[i]._id.toString() !== updatedProduct.user.toString()) {
                    await Notification.create({
                        user: admins[i]._id,
                        message: message
                    });
                }
            }
            
            // Console log just so we can see it working in the terminal!
            console.log(`🔔 NOTIFICATION TRIGGERED: ${message}`);
        }
        // -----------------------------------------

        res.json(updatedProduct);
        
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Seller or Admin only)
const deleteProduct = async (req, res) => {
    try {
        // 1. Find the product first
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 2. OWNERSHIP & ADMIN CHECK
        if (product.user.toString() !== req.user.id && req.user.role !== 'admin' && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized! You must be the seller or an Admin.' });
        }

        // 3. If they pass the check, delete the product
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
};