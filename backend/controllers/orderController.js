const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Needs Token)
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

        // Check if the cart is actually empty
        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        } 

        // Create the new order in the database
        const order = new Order({
            user: req.user.id, // Attached by our protect middleware
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error while creating order' });
    }
};
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Needs Token)
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
            
            // We mock the payment result to simulate what a real gateway returns
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