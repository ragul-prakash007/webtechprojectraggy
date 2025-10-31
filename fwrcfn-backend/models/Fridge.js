const mongoose = require('mongoose');

const fridgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add fridge name']
    },
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        district: {
            type: String,
            enum: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
            required: true
        },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    capacity: {
        type: String,
        enum: ['Small', 'Medium', 'Large'],
        required: true
    },
    currentStock: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['Operational', 'Maintenance', 'Closed'],
        default: 'Operational'
    },
    operatingHours: {
        open: String,
        close: String,
        is24Hours: {
            type: Boolean,
            default: false
        }
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        name: String,
        quantity: Number,
        expiry: Date,
        addedOn: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Fridge', fridgeSchema);