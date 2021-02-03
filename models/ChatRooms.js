const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const ChatRoom = mongoose.model('Room', ChatRoomSchema);

module.exports = ChatRoom;