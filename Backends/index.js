const mongoose = require("mongoose");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const userRouter = require("./routes/user");
const acceptUserRoute = require("./routes/acceptUser");
const sendFriendRequest = require("./routes/sendFriendRequest");
const requestUser = require("./routes/requestAccepts");
const messageRouter = require("./routes/joinRoomIds");

const app = express();
const PORT = process.env.PORT || 6060;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/chat_App", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => res.send("Chat App"));
app.use("/api", userRouter);
app.use("/api", acceptUserRoute);
app.use("/api/friend", sendFriendRequest);
app.use("/api", requestUser);
app.use("/api", messageRouter);

// Create HTTP server
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ sentIdUser}) => {
    const roomName = sentIdUser;
    socket.join(roomName);
    console.log(`User ${socket.id} joined room ${roomName}`);
  });

  socket.on("send_message", ({ sentIdUser,message }) => {
    const roomName = sentIdUser;
    console.log(`Sending message to room ${roomName}:`, message);
    io.to(roomName).emit("receive_message", {  message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));