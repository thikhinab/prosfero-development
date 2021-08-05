const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const path = require("path");
const app = express();
const http = require("http");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

//Authentication
require("./auth/auth");

// Middleware
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan("common"));

//Database connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongo database connection established successfully");
});

// Routes used
const usersRouter = require("./routes/users");
app.use("/api/v1/users", usersRouter);

const profileRouter = require("./routes/profile");
app.use(
  "/api/v1/profile",
  passport.authenticate("jwt", { session: false }),
  profileRouter
);

const postsRouter = require("./routes/posts");
app.use(
  "/api/v1/posts",
  passport.authenticate("jwt", { session: false }),
  postsRouter
);

const requestsRouter = require("./routes/requests");
app.use(
  "/api/v1/requests",
  passport.authenticate("jwt", { session: false }),
  requestsRouter
);

const conversationRouter = require("./routes/conversation");
app.use(
  "/api/v1/conversations",
  passport.authenticate("jwt", { session: false }),
  conversationRouter
);

const messageRouter = require("./routes/message");
app.use(
  "/api/v1/messages",
  passport.authenticate("jwt", { session: false }),
  messageRouter
);

const botRouter = require("./routes/telebots");
app.use(
  "/api/v1/telebots",
  passport.authenticate("jwt", { session: false }),
  botRouter
);

const archiveRouter = require("./routes/archivedposts");
app.use(
  "/api/v1/archive",
  passport.authenticate("jwt", { session: false }),
  archiveRouter
);

const adminRouter = require("./routes/admin");
app.use(
  "/api/v1/admin",
  passport.authenticate("jwt", { session: false }),
  adminRouter
);

// For testing
// app.use(express.static("./client/build"));
// app.get("/*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });

// For Deployment
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("./client/build"));
//   app.get("/*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

//Telebot
const bot = require("./telebot");
bot.start();

//Socket functions and variables
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId == userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// socket connection and disconnection
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    const user = getUser(recieverId);

    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // when disconnected
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
