const mongoose = require('mongoose');
require('dotenv').config();

const { Patient } = require('./models');

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

// Create test patient
const createTestPatient = async () => {
    try {
        // Check if test patient already exists
        const existingPatient = await Patient.findOne({ patientId: 'P001' });
        
        if (existingPatient) {
            console.log('Test patient already exists:', existingPatient);
            return existingPatient;
        }

        // Create new test patient
        const testPatient = new Patient({
            name: 'Test Patient',
            patientId: 'P001',
            phone: '1234567890'
        });

        const savedPatient = await testPatient.save();
        console.log('Test patient created successfully:', savedPatient);
        return savedPatient;

    } catch (error) {
        console.error('Error creating test patient:', error);
    }
};

// Main function
const main = async () => {
    await connectDB();
    await createTestPatient();
    
    console.log('\n✅ Test patient setup complete!');
    console.log('Patient ID: P001');
    console.log('Name: Test Patient');
    console.log('Phone: 1234567890');
    console.log('\nThe doctor can now fill in health data for this patient.');
    
    // Close the connection
    mongoose.connection.close();
};

// Run the script
main().catch(error => {
    console.error('Script failed:', error);
    mongoose.connection.close();
});