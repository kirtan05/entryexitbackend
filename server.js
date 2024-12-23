


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const CryptoJS = require('crypto-js'); // Import CryptoJS for decryption

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
  const { encryptedData } = req.body;

  try {
    // Decrypt the AES encrypted data
    const AES_PASSWORD = process.env.AES_PASSWORD || 'nilgai24';
    const bytes = CryptoJS.AES.decrypt(encryptedData, AES_PASSWORD);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    // Parse decrypted data as JSON
    const userInfo = JSON.parse(decryptedData);

    const { sid } = userInfo;

    // Check if user exists in the database
    let user = await User.findOne({ sid });

    if (!user) {
      // If user does not exist, save the user info to the database
      user = new User(userInfo);
      await user.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to process the encrypted data' });
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
