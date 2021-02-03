const chatForm = document.getElementById('inputChatForm');
const inputChatMessage = document.getElementById('inputChatMessage');
const connectedUsers = document.getElementById('connectedUsers');
const userIsTyping = document.getElementById('userIsTyping');
const socket = io();

// Join Room
socket.emit('joinRoom', {
    username: name,
    room: room
});

// Get List Of Connected Users
socket.on('connectedUsers', users => {
    outputConnectedUsers(users);
});

// Message From Server
socket.on('message', message => {
    outputMessage(message);
    inputChatMessage.scrollTop = inputChatMessage.scrollHeight;
});

// Display User Is Typing
socket.on('isTyping', message => {
    userIsTyping.innerHTML = message || '';
});


// Submit Message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.inputChatMessage.value;

    // Emit Message to Server
    socket.emit('chatMessage', {
        name: name,
        msg: msg
    });

    // Stop Typing
    socket.emit('stopTyping');

    e.target.elements.inputChatMessage.value = '';
    e.target.elements.inputChatMessage.focus();
});

// Output Message to HTML
function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="messageMetadata">${msg.name} <span>${msg.time}</span></p>
    <p class="text">
    ${msg.msg}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
};

// Output Connected Users to HTML
function outputConnectedUsers(users) {
    connectedUsers.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join(' ')}`;
};

// User Is Typing
function typing() {
    if (inputChatMessage.value.length > 0) {
        socket.emit('typing');
    } else {
        socket.emit('stopTyping');
    }
};