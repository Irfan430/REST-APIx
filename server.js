const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/messagebot';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// MongoDB Schema
const messageSchema = new mongoose.Schema({
  input: { type: String, required: true, unique: true },
  reply: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Local JSON database file path
const LOCAL_DB_PATH = path.join(__dirname, 'localdb.json');

// In-memory cache for ultra-fast lookup
let localCache = {};

// Initialize local database from MongoDB
async function initializeLocalDB() {
  try {
    console.log('🔄 Initializing local database from MongoDB...');
    
    // Fetch all messages from MongoDB
    const messages = await Message.find({});
    
    // Create local cache object
    const localData = {};
    messages.forEach(msg => {
      localData[msg.input.toLowerCase()] = msg.reply;
    });
    
    // Save to local JSON file
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localData, null, 2));
    
    // Load into memory cache
    localCache = localData;
    
    console.log(`✅ Local database initialized with ${messages.length} message pairs`);
  } catch (error) {
    console.error('❌ Error initializing local database:', error);
    // If there's an error, create empty local database
    fs.writeFileSync(LOCAL_DB_PATH, '{}');
    localCache = {};
  }
}

// Helper function to update local database
function updateLocalDB() {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localCache, null, 2));
  } catch (error) {
    console.error('❌ Error updating local database:', error);
  }
}

// API Routes

// Get message response
app.get('/api/message', (req, res) => {
  const { text } = req.query;
  
  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }
  
  const inputKey = text.toLowerCase();
  const reply = localCache[inputKey];
  
  if (reply) {
    res.json({ 
      success: true, 
      input: text, 
      reply: reply,
      found: true 
    });
  } else {
    res.json({ 
      success: true, 
      input: text, 
      reply: 'I don\'t know how to respond to that yet. You can teach me!',
      found: false 
    });
  }
});

// Teach new message-response pair
app.post('/api/teach', async (req, res) => {
  try {
    const { input, reply } = req.body;
    
    if (!input || !reply) {
      return res.status(400).json({ error: 'Both input and reply are required' });
    }
    
    const inputKey = input.toLowerCase();
    
    // Save to MongoDB (upsert - update if exists, create if not)
    await Message.findOneAndUpdate(
      { input: inputKey },
      { input: inputKey, reply: reply },
      { upsert: true, new: true }
    );
    
    // Update local cache
    localCache[inputKey] = reply;
    updateLocalDB();
    
    res.json({ 
      success: true, 
      message: 'Message pair taught successfully',
      input: input,
      reply: reply
    });
  } catch (error) {
    console.error('❌ Error teaching message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete message-response pair
app.delete('/api/delete', async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }
    
    const inputKey = input.toLowerCase();
    
    // Delete from MongoDB
    const result = await Message.deleteOne({ input: inputKey });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Remove from local cache
    delete localCache[inputKey];
    updateLocalDB();
    
    res.json({ 
      success: true, 
      message: 'Message pair deleted successfully',
      input: input
    });
  } catch (error) {
    console.error('❌ Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stats
app.get('/api/stats', (req, res) => {
  const totalCount = Object.keys(localCache).length;
  res.json({ 
    success: true, 
    totalMessages: totalCount,
    timestamp: new Date().toISOString()
  });
});

// Web Interface Routes

// Main page
app.get('/', (req, res) => {
  const totalCount = Object.keys(localCache).length;
  res.render('index', { totalCount });
});

// Get all taught messages (for admin view)
app.get('/api/all', (req, res) => {
  const messages = Object.entries(localCache).map(([input, reply]) => ({
    input,
    reply
  }));
  res.json({ success: true, messages });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    totalMessages: Object.keys(localCache).length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Web interface: http://localhost:${PORT}`);
  console.log(`📡 API endpoints: http://localhost:${PORT}/api`);
  
  // Initialize local database on startup
  await initializeLocalDB();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});