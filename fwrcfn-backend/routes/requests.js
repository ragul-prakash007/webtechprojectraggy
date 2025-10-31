const express = require('express');
const {
    getRequests,
    createRequest,
    updateRequestStatus,
    getRequestStats
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getRequests)
    .post(protect, createRequest);

router.patch('/:id/status', protect, updateRequestStatus);
router.get('/stats', protect, authorize('admin'), getRequestStats);

module.exports = router;