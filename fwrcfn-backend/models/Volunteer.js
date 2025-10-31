const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    availability: {
        type: String,
        enum: ['Full Time', 'Part Time', 'Weekends', 'Emergency Only'],
        default: 'Part Time'
    },
    specialization: [{
        type: String,
        enum: ['Food Collection', 'Distribution', 'Coordination', 'Transport', 'All']
    }],
    areas: [{
        type: String,
        enum: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem']
    }],
    tasksCompleted: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    vehicle: {
        hasVehicle: Boolean,
        type: String,
        capacity: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'On Leave'],
        default: 'Active'
    },
    lastActive: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema);