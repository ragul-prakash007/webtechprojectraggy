const mongoose = require('mongoose');

const foodRequestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        name: String,
        quantity: String,
        category: String
    }],
    location: {
        address: {
            type: String,
            required: true
        },
        city: String,
        district: {
            type: String,
            enum: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
            required: true
        },
        pincode: String
    },
    peopleCount: {
        type: Number,
        required: true,
        min: 1
    },
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Emergency'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    assignedVolunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    specialRequirements: String,
    completionTime: Date
}, {
    timestamps: true
});

// Generate request ID before saving
foodRequestSchema.pre('save', async function(next) {
    if (!this.requestId) {
        const count = await mongoose.model('FoodRequest').countDocuments();
        this.requestId = `REQ-${(count + 1).toString().padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('FoodRequest', foodRequestSchema);