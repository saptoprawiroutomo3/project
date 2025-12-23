const app = require('./src/app');
const http = require('http');
const socketIo = require('socket.io');

console.log('🚀 Starting server...');
console.log('🔍 Environment:', process.env.NODE_ENV);
console.log('🔍 Port:', process.env.PORT || 3001);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      // Allow localhost for development
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      
      // Allow GitHub Codespaces domains
      if (origin.includes('.app.github.dev') || origin.includes('.githubpreview.dev')) {
        return callback(null, true);
      }
      
      // Allow specific client URL from env
      if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      
      // Default allow for development
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      
      callback(null, false);
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('send_message', (data) => {
    socket.to(data.chatId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const port = process.env.PORT || 3002;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
