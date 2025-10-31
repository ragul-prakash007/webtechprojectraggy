const express = require('express');
const { getDonors, createDonor, updateDonorStatus } = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getDonors)
    .post(createDonor);

router.patch('/:id/status', protect, authorize('admin'), updateDonorStatus);

module.exports = router;