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
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    clinic: {
        type: String,
        required: true
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

// Patient Schema - defines the structure of patient data
const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    patientId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    }
});

// Patient Data Schema - defines the structure of patient health data
const patientDataSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
        trim: true,
        ref: 'Patient'
    },
    bloodPressure: {
        systolic: {
            type: Number,
            required: true,
            min: 50,
            max: 300
        },
        diastolic: {
            type: Number,
            required: true,
            min: 30,
            max: 200
        }
    },
    sugarLevel: {
        type: Number,
        required: true,
        min: 20,
        max: 600
    },
    heartRate: {
        type: Number,
        required: true,
        min: 30,
        max: 220
    },
    weight: {
        type: Number,
        required: true,
        min: 10,
        max: 500
    },
    recordedAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Doctor model
const Doctor = mongoose.model('Doctor', doctorSchema);

// Create and export the Patient model
const Patient = mongoose.model('Patient', patientSchema);

// Create and export the Patient Data model
const PatientData = mongoose.model('PatientData', patientDataSchema);

module.exports = { Doctor, Patient, PatientData };