/** Express app for janus. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
// const wsRoutes = require('./routes/webSocket');


const app = express();
const expresWs = require('express-ws')(app);

app.use(cors());
app.use(express.json());
app.use(authenticateJWT);
app.options('*', cors())

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/courses", courseRoutes);
// app.use("/api/ws", wsRoutes);



app.ws('/api/ws/chat', function(we, req) {
  ws.on("message", function(msg) {
      console.log(msg)
  })
  ws.send("Test")
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