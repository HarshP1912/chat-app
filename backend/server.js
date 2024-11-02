const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
dotenv.config();
connectDB();

app.use(express.json()); //to accept json data

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server Started on port ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", // Ensure this matches your frontend's address
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(`User ${userData._id} connected`);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    if (!chat || !chat.users) {
      console.log("chat or chat.users is undefined");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      console.log(`Sending message to user ${user._id}`);
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("User disconnected", socket.id);
    socket.leave(userData._id);
  });
});

app.get("/", (req, res) => {
  res.send("API IS RUNNING");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.use(notFound);
app.use(errorHandler);
