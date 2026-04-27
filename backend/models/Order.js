const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        // 1. Who bought it? (Linked to the User model)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // 2. What did they buy? (An array of cart items)
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product', // Linked to the Product model
                },
            },
        ],
        // 3. Where is it going?
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        // 4. How are they paying? (e.g., PayPal, Stripe)
        paymentMethod: {
            type: String,
            required: true,
        },
        // 5. Payment gateway response details (Useful later for Phase 4)
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        // 6. The Math
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        // 7. Tracking Status
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true, // Automatically logs when the order was created
    }
);

module.exports = mongoose.model('Order', orderSchema);