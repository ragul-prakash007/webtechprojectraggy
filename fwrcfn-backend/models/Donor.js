const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add donor name']
    },
    type: {
        type: String,
        enum: ['Restaurant', 'Hotel', 'Marriage Hall', 'Hostel', 'Bakery', 'Individual', 'Catering'],
        required: true
    },
    contact: {
        email: String,
        phone: {
            type: String,
            required: true
        },
        person: String
    },
    address: {
        street: String,
        city: String,
        district: {
            type: String,
            enum: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
            required: true
        },
        pincode: String
    },
    specialty: String,
    donationFrequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Occasional'],
        default: 'Occasional'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Suspended'],
        default: 'Pending'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    totalDonations: {
        type: Number,
        default: 0
    },
    lastDonation: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Donor', donorSchema);