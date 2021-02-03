const moment = require('moment');

// Format Chat Message
function formatChatMessage(username, msg) {
    return {
        name: username,
        msg: msg,
        time: moment().format('h:mm a')
    };
};

module.exports = formatChatMessage;