// Simple MongoDB connection test
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        console.log('Connection string:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connection successful!');
        
        // Test creating a simple document
        const testSchema = new mongoose.Schema({ name: String });
        const Test = mongoose.model('Test', testSchema);
        
        const doc = new Test({ name: 'Connection Test' });
        await doc.save();
        console.log('✅ Test document created successfully!');
        
        await mongoose.connection.close();
        console.log('✅ Connection closed successfully!');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();