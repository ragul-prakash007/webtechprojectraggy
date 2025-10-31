const Fridge = require('../models/Fridge');

// @desc    Get all fridges
// @route   GET /api/fridges
// @access  Public
const getFridges = async (req, res) => {
    try {
        const { district, status } = req.query;
        
        let query = {};
        if (district) query['location.district'] = district;
        if (status) query.status = status;

        const fridges = await Fridge.find(query)
            .populate('manager', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: fridges.length,
            data: fridges
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Get single fridge
// @route   GET /api/fridges/:id
// @access  Public
const getFridge = async (req, res) => {
    try {
        const fridge = await Fridge.findById(req.params.id)
            .populate('manager', 'name email phone');

        if (!fridge) {
            return res.status(404).json({ 
                success: false,
                message: 'Fridge not found' 
            });
        }

        res.json({
            success: true,
            data: fridge
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Create fridge
// @route   POST /api/fridges
// @access  Private/Admin
const createFridge = async (req, res) => {
    try {
        const fridge = await Fridge.create(req.body);
        
        res.status(201).json({
            success: true,
            data: fridge
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Update fridge
// @route   PUT /api/fridges/:id
// @access  Private/Admin
const updateFridge = async (req, res) => {
    try {
        const fridge = await Fridge.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!fridge) {
            return res.status(404).json({ 
                success: false,
                message: 'Fridge not found' 
            });
        }

        res.json({
            success: true,
            data: fridge
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Update fridge stock
// @route   PATCH /api/fridges/:id/stock
// @access  Private
const updateStock = async (req, res) => {
    try {
        const { items, currentStock } = req.body;
        
        const updateData = {};
        if (items) updateData.items = items;
        if (currentStock !== undefined) updateData.currentStock = currentStock;

        const fridge = await Fridge.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!fridge) {
            return res.status(404).json({ 
                success: false,
                message: 'Fridge not found' 
            });
        }

        res.json({
            success: true,
            data: fridge
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

module.exports = {
    getFridges,
    getFridge,
    createFridge,
    updateFridge,
    updateStock
};