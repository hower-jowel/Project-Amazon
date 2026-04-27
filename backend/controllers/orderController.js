const Order = require('../models/Order');
const Product = require('../models/Product'); // Required to update the stock

// @desc    Create new order & Decrease stock
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        // Check if the cart is empty
        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        } 

        // 1. Create the new order record
        const order = new Order({
            user: req.user.id,
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        // 2. THE FIX: Update the stock for each product in the order
        // We use item.product because your frontend sends the ID under the name "product"
        for (const item of orderItems) {
            const product = await Product.findById(item.product); 
            
            if (product) {
                product.countInStock -= item.qty; // Subtract bought quantity from inventory
                await product.save();
                console.log(`✅ Stock Decreased: ${product.name} is now ${product.countInStock}`);
            } else {
                console.log(`❌ Product not found for ID: ${item.product}`);
            }
        }

        res.status(201).json(createdOrder);
        
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ message: 'Server Error while creating order' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order to paid (Mock version)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            
            // Mock payment result
            order.paymentResult = {
                id: 'mock_transaction_123',
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                email_address: req.user.email,
            };
            
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { addOrderItems, getOrderById, getMyOrders, updateOrderToPaid };