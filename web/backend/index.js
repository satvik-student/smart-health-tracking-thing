const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const { Doctor, Patient, PatientData } = require('./models');

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
        const { name, phone, email, password, clinic } = req.body;
        
        // Validate password
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        
        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ phone });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor with this phone number already exists' });
        }

        // Hash password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new doctor
        const doctor = new Doctor({
            name,
            phone,
            email,
            password: hashedPassword,
            clinic
        });

        await doctor.save();
        res.status(201).json({ 
            message: 'Doctor created successfully', 
            doctor: {
                id: doctor._id,
                name: doctor.name,
                phone: doctor.phone,
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
        const doctors = await Doctor.find({ isActive: true }, 'name phone clinic createdAt');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
    }
});

// 3. Doctor Login
app.post('/api/doctors/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        // Find doctor by phone
        const doctor = await Doctor.findOne({ phone, isActive: true });
        if (!doctor) {
            return res.status(401).json({ message: 'Invalid phone number or password' });
        }

        // Verify password
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid phone number or password' });
        }

        // Return doctor info (excluding password)
        res.json({
            message: 'Login successful',
            doctor: {
                id: doctor._id,
                name: doctor.name,
                phone: doctor.phone,
                clinic: doctor.clinic
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// 4. Get doctor by phone
app.get('/api/doctors/:phone', async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ phone: req.params.phone, isActive: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // Don't return password
        const { password, ...doctorWithoutPassword } = doctor.toObject();
        res.json(doctorWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch doctor', error: error.message });
    }
});

// 5. Update doctor
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

// 6. Delete doctor (soft delete)
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

// Patient Endpoints
// 1. Get all patients
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get patient by ID
app.get('/api/patients/:patientId', async (req, res) => {
    try {
        const patient = await Patient.findOne({ patientId: req.params.patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Add new patient health data
app.post('/api/patients/:patientId/data', async (req, res) => {
    try {
        const { patientId } = req.params;
        const { bloodPressure, sugarLevel, heartRate, weight } = req.body;

        // Check if patient exists
        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Create new health data entry
        const patientData = new PatientData({
            patientId,
            bloodPressure,
            sugarLevel,
            heartRate,
            weight
        });

        const savedData = await patientData.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. Get patient health data history
app.get('/api/patients/:patientId/data', async (req, res) => {
    try {
        const { patientId } = req.params;
        
        // Check if patient exists
        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const healthData = await PatientData.find({ patientId }).sort({ recordedAt: -1 });
        res.json(healthData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Update patient health data record
app.put('/api/patients/data/:recordId', async (req, res) => {
    try {
        const { recordId } = req.params;
        const { bloodPressure, sugarLevel, heartRate, weight } = req.body;
        
        // Find and update the health data record
        const updatedRecord = await PatientData.findByIdAndUpdate(
            recordId,
            {
                bloodPressure,
                sugarLevel,
                heartRate,
                weight,
                recordedAt: new Date() // Update the timestamp
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedRecord) {
            return res.status(404).json({ error: 'Health record not found' });
        }

        res.json(updatedRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 6. Delete patient health data record
app.delete('/api/patients/data/:recordId', async (req, res) => {
    try {
        const { recordId } = req.params;
        
        // Find and delete the health data record
        const deletedRecord = await PatientData.findByIdAndDelete(recordId);
        if (!deletedRecord) {
            return res.status(404).json({ error: 'Health record not found' });
        }

        res.json({ message: 'Health record deleted successfully', deletedRecord });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
