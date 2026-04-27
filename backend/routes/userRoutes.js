const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Import the Bouncer

router.post('/', registerUser); // Register
router.post('/login', loginUser); // Login

// NEW: Protected Profile Route
router.get('/profile', protect, getUserProfile); 

module.exports = router;