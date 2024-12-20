/** Express app for janus. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
// const wsRoutes = require('./routes/webSocket');
const {COMET_URL} = require('./config');
const {API_KEY} = require('./config')
const axios = require('axios');



const app = express();
const expressWs = require('express-ws')(app);

// app.use(cors());
app.use(express.json());
app.use(authenticateJWT);
// app.options('*', cors())

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/courses", courseRoutes);
// app.use("/api/ws", wsRoutes);

console.log(process.env.DATABASE_URL)

app.ws('/api/ws/chat', function(ws, req) {
  ws.on("message", async function(data) {
    if(typeof data === 'string') {
      const res = await axios({
        method: 'get',
        url: `${COMET_URL}groups/${data}/messages`,
        headers: {
            apiKey: API_KEY,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    })
    // console.log(res.data.data)
    ws.send(JSON.stringify(res.data.data));
    }
    else if(typeof data === 'object') {
      const {guid, text, uid} = data;
      await axios({
        method: 'post',
        url: `${COMET_URL}messages`,
        headers: {
            apiKey: API_KEY,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            onBehalfOf: username
        },
        data: {
            category: 'message',
            type: "text",
            data: {
                text: msg
            },
            receiver: guid,
            receiverType: "group",
        }
    })
    }
  })
  
})

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
  /** Generic error handler; anything unhandled goes here. */
  app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });
  
  module.exports = app;