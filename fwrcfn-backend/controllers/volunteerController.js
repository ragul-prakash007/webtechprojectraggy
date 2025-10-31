const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

// @desc    Get all volunteers
// @route   GET /api/volunteers
// @access  Private/Admin
const getVolunteers = async (req, res) => {
    try {
        const { status, district } = req.query;
        
        let query = {};
        if (status) query.status = status;

        const volunteers = await Volunteer.find(query)
            .populate('user', 'name email phone address')
            .sort({ tasksCompleted: -1 });

        // Filter by district if provided
        let filteredVolunteers = volunteers;
        if (district) {
            filteredVolunteers = volunteers.filter(volunteer => 
                volunteer.user.address.district === district
            );
        }

        res.json({
            success: true,
            count: filteredVolunteers.length,
            data: filteredVolunteers
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Get volunteer stats
// @route   GET /api/volunteers/stats
// @access  Private/Admin
const getVolunteerStats = async (req, res) => {
    try {
        const totalVolunteers = await Volunteer.countDocuments();
        const activeVolunteers = await Volunteer.countDocuments({ status: 'Active' });
        
        const districtStats = await Volunteer.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $group: {
                    _id: '$userData.address.district',
                    count: { $sum: 1 },
                    active: {
                        $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalVolunteers,
                activeVolunteers,
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
    getVolunteers,
    getVolunteerStats
};