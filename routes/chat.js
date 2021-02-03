const express = require('express');
const router = express.Router();

const ChatRoom = require('../models/ChatRooms');

const { ensureAuthenticated } = require('../config/auth');

// Chat Home
router.get('/home', ensureAuthenticated, (req, res) =>
    ChatRoom.find({}, 'name', (err, rooms) => {
        if (err) { console.log(err) }
        else {
            const roomList = [];
            rooms.forEach(room => { roomList.push(room.name); });

            res.render('chatHome', { roomList: roomList });
        }
    })
);

// Chat Room
router.get('/:room', ensureAuthenticated, (req, res) => {
    res.render('chatRoom', {
        name: req.user.name,
        room: req.params.room
    })
});

// Create Room
router.post('/home', ensureAuthenticated, (req, res) => {
    const errors = [];
    const requestedRoomName = req.body.roomName;

    // Check If Room Exists
    ChatRoom.findOne({ name: requestedRoomName })
        .then(roomName => {
            if (roomName) {

                errors.push({ msg: 'Room Exists' });
                res.render('chatHome', {
                    errors
                })
            } else {
                const newRoom = new ChatRoom({
                    name: requestedRoomName,
                    creator: req.user.name
                });

                // Save New Room
                newRoom.save()
                    .then(room => {
                        req.flash('successMsg', `New Room ${newRoom.name} Created`);
                        res.redirect(`/chat/${newRoom.name}`)
                    })
                    .catch(err => console.log(err))
            }
        })
        ;
});

module.exports = router;