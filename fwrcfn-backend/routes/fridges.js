const express = require('express');
const {
    getFridges,
    getFridge,
    createFridge,
    updateFridge,
    updateStock
} = require('../controllers/fridgeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getFridges)
    .post(protect, authorize('admin'), createFridge);

router.route('/:id')
    .get(getFridge)
    .put(protect, authorize('admin'), updateFridge);

router.patch('/:id/stock', protect, updateStock);

module.exports = router;