const mongoose = require('mongoose');

// Doctor Schema - defines the structure of doctor data
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    specialization: {
        type: String,
        required: true,
        enum: ['General Medicine', 'Cardiology', 'Diabetes', 'Pediatrics', 'Gynecology', 'Orthopedics', 'Community Health', 'Other']
    },
    clinic: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        trim: true
    },
    experience: {
        type: Number,
        min: 0,
        max: 50
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Doctor model
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = { Doctor };