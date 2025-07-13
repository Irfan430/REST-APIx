# 🚀 Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Set Up Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB URI (or use default for local MongoDB)
# MONGODB_URI=mongodb://localhost:27017/messagebot
```

## 3. Start MongoDB (if running locally)
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

## 4. Start the Server
```bash
npm start
```

## 5. Access the Application
- **Web Interface**: http://localhost:3000
- **API Documentation**: Check README.md for all endpoints

## 6. Test the API (Optional)
```bash
# In a new terminal window
npm test
```

## 🎯 Quick API Tests

### Teach the Bot
```bash
curl -X POST http://localhost:3000/api/teach \
  -H "Content-Type: application/json" \
  -d '{"input": "hello", "reply": "Hi there! How can I help you?"}'
```

### Get a Response
```bash
curl "http://localhost:3000/api/message?text=hello"
```

### Check Stats
```bash
curl http://localhost:3000/api/stats
```

### Delete a Message
```bash
curl -X DELETE http://localhost:3000/api/delete \
  -H "Content-Type: application/json" \
  -d '{"input": "hello"}'
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check if port 27017 is available
- Verify MONGODB_URI in .env file

### Port Already in Use
- Change PORT in .env file
- Kill existing process: `lsof -ti:3000 | xargs kill -9`

### Can't Access Web Interface
- Ensure server is running on correct port
- Check firewall settings
- Try accessing http://127.0.0.1:3000 instead

## 📁 Project Structure
```
message-bot-api/
├── server.js          # Main server file
├── package.json       # Dependencies
├── views/index.ejs    # Web interface
├── .env              # Environment variables
├── localdb.json      # Auto-generated local cache
└── README.md         # Full documentation
```

## 🌍 Deploy to Production
See README.md for detailed deployment instructions for:
- Render
- Vercel
- Manual server deployment

**Happy Coding!** 🤖✨