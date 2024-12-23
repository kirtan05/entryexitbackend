
const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const cors = require('cors');

// Initialize Express app

const app = express();

app.use(bodyParser.json());

app.use(cors());

// MongoDB connection

const dbURI = 'mongodb+srv://entryexit:nilgai24@entryexit.l0w8kgt.mongodb.net/?retryWrites=true&w=majority&appName=entryexit';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

.then(() => console.log('Connected to MongoDB'))

.catch(err => console.error(err));

// Define Schemas and Models

const userSchema = new mongoose.Schema({

institute: String,

name: String,

email: String,

phone: String,

roll: String,

gender: String,

sid: String,

});

const logSchema = new mongoose.Schema({

sid: String,

venue: String,

actionType: String,

timestamp: { type: Date, default: Date.now },

});

const User = mongoose.model('User', userSchema);

const EntryLog = mongoose.model('EntryLog', logSchema);

// API Endpoints

// Get user details

app.post('/api/getUser', async (req, res) => {

const { sid } = req.body;

try {

const user = await User.findOne({ sid });

if (user) {

res.json({ success: true, user });

} else {

res.json({ success: false, message: 'User not found' });

}

} catch (error) {

console.error(error);

res.status(500).json({ success: false, message: 'Server error' });

}

});

// Log entry/exit

app.post('/api/logEntry', async (req, res) => {

const { sid, venue, actionType } = req.body;

try {

const newLog = new EntryLog({ sid, venue, actionType });

await newLog.save();

res.json({ success: true, message: 'Entry logged successfully' });

} catch (error) {

console.error(error);

res.status(500).json({ success: false, message: 'Failed to log entry' });

}

});

// Start the server
async function insertSampleUser() {

    const sampleUser = new User({
    
    institute: 'Sample Institute',
    
    name: 'John Doe',
    
    email: 'johndoe@example.com',
    
    phone: '1234567890',
    
    roll: '20XXABCDEF',
    
    gender: 'Male',
    
    sid: 'sample_sid_123',
    
    });
    
    await sampleUser.save();
    
    console.log('Sample user inserted');
    
    }
    
    // Call the function and then comment it out after running once
    
    insertSampleUser();
    
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log(`Server started on port ${PORT}`);

});
