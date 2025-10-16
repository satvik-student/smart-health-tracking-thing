const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const { Doctor, Patient, PatientData, Notification } = require('./models');

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

// Helper function to send push notifications via Expo
async function sendPushNotification(expoPushToken, title, message, data = {}) {
    try {
        const pushMessage = {
            to: expoPushToken,
            sound: 'default',
            title: title,
            body: message,
            data: { ...data, type: 'notification' },
            priority: 'high',
            channelId: 'default',
        };

        const response = await axios.post('https://exp.host/--/api/v2/push/send', pushMessage, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        console.log('Push notification sent:', response.data);
        return response.data;
    } catch (error) {
        console.error('Push notification error:', error.response?.data || error.message);
        return null;
    }
}

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

// Patient Registration & Authentication Endpoints

// Register new patient
app.post('/api/patients/register', async (req, res) => {
    try {
        const { name, phone, password, age, gender } = req.body;

        // Validation
        if (!name || !phone || !password || !age || !gender) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        if (age < 1 || age > 120) {
            return res.status(400).json({ message: 'Age must be between 1 and 120' });
        }

        if (!['Male', 'Female', 'Other'].includes(gender)) {
            return res.status(400).json({ message: 'Invalid gender value' });
        }

        // Check if patient already exists
        const existingPatient = await Patient.findOne({ phone });
        if (existingPatient) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        // Hash password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new patient (patientId will be auto-generated by pre-save hook)
        const patient = new Patient({
            name,
            phone,
            password: hashedPassword,
            age,
            gender
        });

        await patient.save();

        res.status(201).json({
            message: 'Patient registered successfully',
            patient: {
                patientId: patient.patientId,
                name: patient.name,
                phone: patient.phone,
                age: patient.age,
                gender: patient.gender
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Patient login
app.post('/api/patients/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone and password are required' });
        }

        // Find patient by phone
        const patient = await Patient.findOne({ phone });
        if (!patient) {
            return res.status(401).json({ message: 'Invalid phone number or password' });
        }

        // Verify password
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(password, patient.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid phone number or password' });
        }

        res.json({
            message: 'Login successful',
            patient: {
                patientId: patient.patientId,
                name: patient.name,
                phone: patient.phone,
                age: patient.age,
                gender: patient.gender
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Save push token for patient
app.post('/api/patients/:patientId/push-token', async (req, res) => {
    try {
        const { patientId } = req.params;
        const { expoPushToken } = req.body;

        if (!expoPushToken) {
            return res.status(400).json({ message: 'expoPushToken is required' });
        }

        const patient = await Patient.findOneAndUpdate(
            { patientId },
            { expoPushToken },
            { new: true }
        );

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({ message: 'Push token saved successfully' });
    } catch (error) {
        console.error('Save push token error:', error);
        res.status(500).json({ message: 'Failed to save push token', error: error.message });
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

// -------------------- Notification Endpoints --------------------

// Create a notification (doctor to one or more patients)
// Body: { title, message, type?, priority?, doctorId, doctorName?, recipients: [patientId], scheduledFor? }
app.post('/api/notifications', async (req, res) => {
    try {
        const { title, message, type, priority, doctorId, doctorName, recipients, scheduledFor, metadata } = req.body;

        if (!title || !message || !doctorId || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ message: 'title, message, doctorId and at least one recipient are required' });
        }

        // Validate doctorId is a valid ObjectId and exists
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: 'Invalid doctorId' });
        }
        const doctorExists = await Doctor.exists({ _id: doctorId, isActive: true });
        if (!doctorExists) {
            return res.status(400).json({ message: 'Doctor not found or inactive' });
        }

        // Optional: ensure all recipient patientIds exist
        const count = await Patient.countDocuments({ patientId: { $in: recipients } });
        if (count !== recipients.length) {
            return res.status(400).json({ message: 'One or more recipients not found' });
        }

        const doc = new Notification({
            title,
            message,
            type,
            priority,
            doctorId,
            doctorName,
            recipients: recipients.map(pid => ({ patientId: pid })),
            scheduledFor,
            metadata
        });

        const saved = await doc.save();

        // Send push notifications to all recipients
        for (const recipientId of recipients) {
            const patient = await Patient.findOne({ patientId: recipientId });
            if (patient?.expoPushToken) {
                await sendPushNotification(
                    patient.expoPushToken,
                    title,
                    message,
                    {
                        notificationId: saved._id.toString(),
                        type: type || 'info',
                        priority: priority || 'normal',
                        doctorName: doctorName || 'Doctor'
                    }
                );
            }
        }

        res.status(201).json({ message: 'Notification created', notificationId: saved._id });
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ message: 'Failed to create notification', error: error.message });
    }
});

// Get notifications for a patient (most recent first)
app.get('/api/patients/:patientId/notifications', async (req, res) => {
    try {
        const { patientId } = req.params;
        const notifications = await Notification.find({ 'recipients.patientId': patientId })
            .sort({ createdAt: -1 })
            .select('title message type priority doctorId doctorName createdAt scheduledFor recipients');

        // For convenience, compute read status per notification for this patient
        const mapped = notifications.map(n => {
            const rec = n.recipients.find(r => r.patientId === patientId);
            return {
                id: n._id,
                title: n.title,
                message: n.message,
                type: n.type,
                priority: n.priority,
                doctorId: n.doctorId,
                doctorName: n.doctorName,
                createdAt: n.createdAt,
                scheduledFor: n.scheduledFor,
                readAt: rec?.readAt || null,
                deliveredAt: rec?.deliveredAt || null
            };
        });

        res.json(mapped);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
    }
});

// Mark a notification as read for a specific patient
app.post('/api/patients/:patientId/notifications/:notificationId/read', async (req, res) => {
    try {
        const { patientId, notificationId } = req.params;
        const updated = await Notification.findOneAndUpdate(
            { _id: notificationId, 'recipients.patientId': patientId },
            { $set: { 'recipients.$.readAt': new Date(), 'recipients.$.deliveredAt': new Date() } },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Notification not found for this patient' });
        }
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark as read', error: error.message });
    }
});

// API root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Health Tracker API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            doctors: '/api/doctors',
            patients: '/api/patients',
            patientRegister: '/api/patients/register',
            patientLogin: '/api/patients/login',
            createNotification: '/api/notifications',
            patientNotifications: '/api/patients/:patientId/notifications',
            markNotificationRead: '/api/patients/:patientId/notifications/:notificationId/read'
        }
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Server running on http://localhost:' + PORT));
