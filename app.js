const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const http = require('http');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// View - Public Directory
app.use(express.static(__dirname + '/public'));

// Connect to MongoDB
const db = require('./config/keys');
const { emit } = require('./models/Users');
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB: ' + db.mongoURI))
    .catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('successMsg');
    res.locals.errorMsg = req.flash('errorMsg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/chat', require('./routes/chat'));

// Chat Web Socket
const formatChatMessage = require('./utils/chatMessage');
const { userJoin, userLeave, getCurrentUser, getRoomUsers } = require('./utils/chatUsers');
const chatbot = 'ChatBot';

io.on('connection', socket => {

    // Join Room Flow
    socket.on('joinRoom', ({ username, room }) => {
        // Join Room
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome Current User
        socket.emit('message', formatChatMessage(chatbot, 'Welcome'));

        // Broadcast New Connection
        socket.broadcast.to(user.room).emit('message', formatChatMessage(chatbot, `${user.username} has joined the chat`));

        // Send List Of Connected Users
        io.to(user.room).emit('connectedUsers', getRoomUsers(user.room));
    });

    // New Message Flow
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatChatMessage(msg.name, msg.msg));
    });

    // User Disconnection Flow
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            // User Left Message
            io.to(user.room).emit('message', formatChatMessage(chatbot, `${user.username} has left the chat`));

            // Send List Of Connected Users
            io.to(user.room).emit('connectedUsers', getRoomUsers(user.room));
        }
    })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, console.log('Server listen on port: ' + PORT));