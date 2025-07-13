# 🤖 Message Bot API

A complete Node.js + Express REST API project with a beautiful web interface for teaching and managing message-response pairs. The bot can learn any custom input-response combinations and provides ultra-fast responses using a hybrid MongoDB + local JSON storage system.

## ✨ Features

### 🎯 Core Functionality
- **Teach Custom Responses**: Train the bot with any input-response pair
- **Delete Responses**: Remove specific taught message pairs
- **Chat Interface**: Test responses in real-time
- **Statistics**: View total count of taught messages
- **Hybrid Storage**: MongoDB for persistence + local JSON for speed

### 🏗️ Technical Features
- **Ultra-Fast Responses**: Local JSON cache for instant lookup
- **Data Persistence**: MongoDB ensures no data loss on server restart
- **Auto-Sync**: Local cache rebuilds from MongoDB on startup
- **Production Ready**: Configured for Render, Vercel deployment
- **Modern UI**: Beautiful, responsive web interface
- **API-First**: Full REST API with CORS support

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- MongoDB running locally or MongoDB Atlas account

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd message-bot-api
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

3. **Start the Server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

4. **Access the Application**
   - Web Interface: `http://localhost:3000`
   - API Base URL: `http://localhost:3000/api`

## 🌐 API Endpoints

### 📝 Teaching Messages
```http
POST /api/teach
Content-Type: application/json

{
  "input": "Hello there",
  "reply": "Hi! How can I help you today?"
}
```

### 🗑️ Deleting Messages
```http
DELETE /api/delete
Content-Type: application/json

{
  "input": "Hello there"
}
```

### 💬 Getting Responses
```http
GET /api/message?text=Hello there
```

Response:
```json
{
  "success": true,
  "input": "Hello there",
  "reply": "Hi! How can I help you today!",
  "found": true
}
```

### 📊 Statistics
```http
GET /api/stats
```

Response:
```json
{
  "success": true,
  "totalMessages": 15,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 📋 All Messages
```http
GET /api/all
```

Response:
```json
{
  "success": true,
  "messages": [
    {
      "input": "hello",
      "reply": "Hi there! How can I help you?"
    }
  ]
}
```

## 🎨 Web Interface

The web interface provides a beautiful, user-friendly way to interact with the bot:

### 📚 Teaching Section
- Input field for the trigger text
- Textarea for the response
- Live preview of taught messages
- Quick delete buttons for each message pair

### 🗑️ Delete Section
- Simple form to remove specific responses
- Confirmation feedback

### 💬 Chat Section
- Real-time chat interface
- Test responses immediately
- Clear conversation history

### 📊 Footer Stats
- Live count of total taught messages
- Updates automatically after each operation

## 🚢 Deployment

### Render Deployment

1. **Create a Render Account** at [render.com](https://render.com)

2. **Create a New Web Service**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Environment Variables**
   - Add `MONGODB_URI` with your MongoDB Atlas connection string
   - Add `PORT` (optional, Render sets this automatically)

4. **Deploy**
   - Render will automatically deploy your app
   - Your app will be available at `https://your-app-name.onrender.com`

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   # Enter your MongoDB connection string
   ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### Manual Server Deployment

1. **Server Setup**
   ```bash
   # On your server
   git clone <repository-url>
   cd message-bot-api
   npm install
   ```

2. **Environment Variables**
   ```bash
   # Create .env file
   MONGODB_URI=mongodb://localhost:27017/messagebot
   PORT=3000
   ```

3. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start server.js --name message-bot
   pm2 save
   pm2 startup
   ```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/messagebot` |
| `PORT` | Server port | No | `3000` |

### MongoDB Setup

#### Local MongoDB
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod
```

#### MongoDB Atlas (Cloud)
1. Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Replace `<password>` and `<dbname>` in connection string
5. Add to `.env` file

Example connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/messagebot?retryWrites=true&w=majority
```

## 📁 Project Structure

```
message-bot-api/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── views/
│   └── index.ejs          # Web interface template
├── localdb.json           # Local JSON cache (auto-generated)
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── Procfile               # Render deployment config
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🔄 Data Flow

1. **Startup**: Server loads all messages from MongoDB into `localdb.json`
2. **Teaching**: New messages saved to both MongoDB and local JSON
3. **Querying**: Responses fetched from local JSON for speed
4. **Deleting**: Messages removed from both MongoDB and local JSON
5. **Restart**: Local JSON rebuilt from MongoDB automatically

## 🛠️ Development

### Available Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Install dependencies
npm install
```

### Adding Features

The codebase is well-structured and commented. Key files:

- `server.js`: Main application logic
- `views/index.ejs`: Web interface
- Database operations are in the main server file
- API endpoints are clearly separated

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify `MONGODB_URI` in `.env`
   - Ensure network access for MongoDB Atlas

2. **Port Already in Use**
   - Change `PORT` in `.env`
   - Kill existing process: `kill -9 $(lsof -t -i:3000)`

3. **Local Database Not Loading**
   - Check MongoDB connection
   - Verify file permissions
   - Restart the server

4. **Deployment Issues**
   - Ensure all environment variables are set
   - Check build logs for errors
   - Verify MongoDB Atlas IP whitelist

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the error logs in your console
3. Ensure all environment variables are properly set
4. Verify your MongoDB connection

## 🎯 Use Cases

- **Customer Support Bot**: Train with FAQ responses
- **Educational Tool**: Teach responses for learning
- **Personal Assistant**: Custom command responses
- **Team Communication**: Internal bot for common queries
- **API Integration**: Use as backend for chat applications

---

**Happy Botting!** 🤖✨