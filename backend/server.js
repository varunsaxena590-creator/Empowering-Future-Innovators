/**
 * @file server.js
 * @description Main Express server — Zorvex Institute Backend API
 * Runs on PORT 5001 (matches frontend VITE_API_URL)
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// ─── Socket.IO Setup ───────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', methods: ['GET', 'POST'] },
});

// Attach io to app so routes can use it
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join_chat', (sessionId) => socket.join(sessionId));
  socket.on('send_message', async (data) => {
    const { sessionId, message, sender } = data;
    try {
      const Chat = require('./models/Chat');
      const chat = await Chat.findOneAndUpdate(
        { sessionId },
        {
          $push: { messages: { sender, text: message, timestamp: new Date() } },
          lastActivity: new Date(),
          $setOnInsert: { sessionId, status: 'active' },
        },
        { upsert: true, new: true }
      );
      io.to(sessionId).emit('receive_message', { sender, text: message, timestamp: new Date() });
    } catch (e) {
      console.error('Socket message error:', e.message);
    }
  });
});

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── MongoDB Connection ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27018/zorvex_college')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err.message));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/courses',     require('./routes/courses'));
app.use('/api/students',    require('./routes/students'));
app.use('/api/contact',     require('./routes/contact'));
app.use('/api/gallery',     require('./routes/gallery'));
app.use('/api/faculty',     require('./routes/faculty'));
app.use('/api/notices',     require('./routes/notices'));
app.use('/api/results',     require('./routes/results'));
app.use('/api/placements',  require('./routes/placements'));
app.use('/api/alumni',      require('./routes/alumni'));
app.use('/api/reviews',     require('./routes/reviews'));
app.use('/api/analytics',   require('./routes/analytics'));
app.use('/api/assistant',   require('./routes/assistant'));
app.use('/api/attendance',  require('./routes/attendance'));
app.use('/api/chat',        require('./routes/chat'));

// ─── Health Check ─────────────────────────────────────────────────────────────
// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(require('./middleware/errorHandler'));

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

app.get('/api/status', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const dbName = mongoose.connection.name || 'zorvex_college';

  res.json({
    success: true,
    message: 'Zorvex Institute API is running',
    port: PORT,
    checkedAt: new Date().toISOString(),
    frontend: { status: 'running', message: 'Frontend is served separately.' },
    backend: { status: 'running', message: 'Backend API is responding normally.' },
    database: {
      status: dbState === 1 ? 'running' : dbState === 2 ? 'checking' : 'warning',
      state: dbStateMap[dbState] || 'unknown',
      message: dbState === 1
        ? `MongoDB connected (${dbName})`
        : dbState === 2
          ? 'MongoDB connecting...'
          : 'MongoDB not connected. Check if MongoDB is running on port 27018.',
      name: dbState === 1 ? dbName : 'unavailable',
    },
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
