const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' // Who is receiving this notification?
    },
    message: { 
        type: String, 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false // Starts as unread!
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);