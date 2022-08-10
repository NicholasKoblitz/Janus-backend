const app = require('../app')
const express = require("express");
const router = new express.Router();
const wsExpress = require('express-ws')(app);

app.ws('/chat', function(we, req) {
    ws.send("Test")
})

module.exports = wsExpress;






/**Send a message to the group */
// async sendMessage(guid, msg, username) {
//     await axios({
//         method: 'post',
//         url: `${COMET_URL}messages`,
//         headers: {
//             apiKey: API_KEY,
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//             onBehalfOf: username
//         },
//         data: {
//             category: 'message',
//             type: "text",
//             data: {
//                 text: msg
//             },
//             receiver: guid,
//             receiverType: "group",
//         }
//     })
// }