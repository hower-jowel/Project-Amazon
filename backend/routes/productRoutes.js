const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts); 
router.post('/', protect, createProduct); 

// Get single product by ID
router.get('/:id', getProductById); 

// NEW: Admin tools to update and delete
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;