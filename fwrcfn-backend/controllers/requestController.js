const FoodRequest = require('../models/FoodRequest');

// @desc    Get all food requests
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
    try {
        const { status, district, urgency } = req.query;
        
        let query = {};
        if (status) query.status = status;
        if (district) query['location.district'] = district;
        if (urgency) query.urgency = urgency;

        // If user is not admin, show only their requests
        if (req.user.role === 'user') {
            query.user = req.user.id;
        }

        const requests = await FoodRequest.find(query)
            .populate('user', 'name email phone')
            .populate('assignedVolunteer', 'name phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Create food request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
    try {
        // Add user to request
        req.body.user = req.user.id;
        
        const request = await FoodRequest.create(req.body);
        
        // Populate user details
        await request.populate('user', 'name email phone');

        res.status(201).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private
const updateRequestStatus = async (req, res) => {
    try {
        const { status, assignedVolunteer } = req.body;
        
        const updateData = { status };
        if (assignedVolunteer) updateData.assignedVolunteer = assignedVolunteer;
        if (status === 'Completed') updateData.completionTime = new Date();

        const request = await FoodRequest.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('user', 'name email phone')
         .populate('assignedVolunteer', 'name phone');

        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: 'Request not found' 
            });
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/requests/stats
// @access  Private/Admin
const getRequestStats = async (req, res) => {
    try {
        const totalRequests = await FoodRequest.countDocuments();
        const pendingRequests = await FoodRequest.countDocuments({ status: 'Pending' });
        const completedRequests = await FoodRequest.countDocuments({ status: 'Completed' });
        
        // District-wise distribution
        const districtStats = await FoodRequest.aggregate([
            {
                $group: {
                    _id: '$location.district',
                    count: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalRequests,
                pendingRequests,
                completedRequests,
                districtStats
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

module.exports = {
    getRequests,
    createRequest,
    updateRequestStatus,
    getRequestStats
};