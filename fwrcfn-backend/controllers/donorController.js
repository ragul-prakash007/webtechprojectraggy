const Donor = require('../models/Donor');

// @desc    Get all donors
// @route   GET /api/donors
// @access  Public
const getDonors = async (req, res) => {
    try {
        const { type, status, district } = req.query;
        
        let query = {};
        if (type) query.type = type;
        if (status) query.status = status;
        if (district) query['address.district'] = district;

        const donors = await Donor.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: donors.length,
            data: donors
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Create donor
// @route   POST /api/donors
// @access  Public
const createDonor = async (req, res) => {
    try {
        const donor = await Donor.create(req.body);
        
        res.status(201).json({
            success: true,
            data: donor
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Update donor status
// @route   PATCH /api/donors/:id/status
// @access  Private/Admin
const updateDonorStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const donor = await Donor.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!donor) {
            return res.status(404).json({ 
                success: false,
                message: 'Donor not found' 
            });
        }

        res.json({
            success: true,
            data: donor
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

module.exports = {
    getDonors,
    createDonor,
    updateDonorStatus
};