const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const { Doctor } = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Initialize database connection
connectDB();

// Doctor Database Endpoints
// 1. Create a new doctor
app.post('/api/doctors', async (req, res) => {
    try {
        const { name, phone, email, specialization, clinic, licenseNumber, experience } = req.body;
        
        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ phone });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor with this phone number already exists' });
        }

        // Create new doctor
        const doctor = new Doctor({
            name,
            phone,
            email,
            specialization,
            clinic,
            licenseNumber,
            experience: experience ? parseInt(experience) : undefined
        });

        await doctor.save();
        res.status(201).json({ 
            message: 'Doctor created successfully', 
            doctor: {
                id: doctor._id,
                name: doctor.name,
                phone: doctor.phone,
                specialization: doctor.specialization,
                clinic: doctor.clinic
            }
        });
    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).json({ message: 'Failed to create doctor', error: error.message });
    }
});

// 2. Get all doctors
app.get('/api/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find({ isActive: true }, 'name phone specialization clinic experience createdAt');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
    }
});

// 3. Get doctor by phone
app.get('/api/doctors/:phone', async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ phone: req.params.phone, isActive: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch doctor', error: error.message });
    }
});

// 4. Update doctor
app.put('/api/doctors/:phone', async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate(
            { phone: req.params.phone }, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ message: 'Doctor updated successfully', doctor });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update doctor', error: error.message });
    }
});

// 5. Delete doctor (soft delete)
app.delete('/api/doctors/:phone', async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate(
            { phone: req.params.phone }, 
            { isActive: false }, 
            { new: true }
        );
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete doctor', error: error.message });
    }
});

// In-memory store for patients (keeping existing functionality): { phone: { readings: [...] , meta: {...} } }
const store = {};

app.post('/patients/:phone/readings', (req,res)=>{
  const phone = req.params.phone;
  const payload = req.body;
  if(!store[phone]) store[phone] = {readings:[], meta:{}};
  store[phone].readings.push({ts:Date.now(), ...payload});
  res.status(201).json({ok:true});
});

app.get('/patients/:phone/readings', (req,res)=>{
  const phone = req.params.phone;
  const data = store[phone] || {readings:[]};
  res.json(data);
});

app.get('/health', (req,res)=> res.json({ok:true, uptime: process.uptime()}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Page routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Server running on http://localhost:' + PORT));
