const express = require('express');
const { getVolunteers, getVolunteerStats } = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin'), getVolunteers);
router.get('/stats', protect, authorize('admin'), getVolunteerStats);

module.exports = router;