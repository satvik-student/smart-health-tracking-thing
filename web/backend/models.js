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
        unique: true,
        trim: true,
        sparse: true  // Allow null/undefined until pre-save hook sets it
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 120
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Counter Schema for auto-incrementing patientId
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Pre-validate hook to auto-generate patientId starting from P002 (runs before validation)
patientSchema.pre('validate', async function(next) {
    const patient = this;
    if (patient.patientId) {
        return next();
    }

    try {
        const counter = await Counter.findByIdAndUpdate(
            'patientId',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        
        const seqNumber = counter.seq + 1; // Start from P002
        patient.patientId = `P${String(seqNumber).padStart(3, '0')}`;
        next();
    } catch (error) {
        next(error);
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

module.exports = { Doctor, Patient, PatientData, Counter };