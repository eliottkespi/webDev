const inputNewRoom = document.getElementById('newRoomDiv');
const inputRoom = document.getElementById('inputRoom')
const selectRoom = document.getElementById('selectRoom');
const newRoomForm = document.getElementById('newRoomForm');


function goToRoom() {
    if (selectRoom.value !== 'newRoom') {
        location = selectRoom.value;
    }
};

function displayNewRoomOptions() {
    if (inputNewRoom.style.display === 'none') {
        inputNewRoom.style.display = 'block';
    } else {
        inputNewRoom.style.display = 'none';
    }
};