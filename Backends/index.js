const mongoose = require("mongoose");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const userRouter = require("./routes/user");
const acceptUserRoute = require("./routes/acceptUser");
const sendFriendRequest = require("./routes/sendFriendRequest");
const requestUser = require("./routes/requestAccepts");
const joinRoomRouter = require("./routes/joinRoomIds");
const messageRouter = require("./routes/message");
const User = require("./model/user");


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
app.use("/api", joinRoomRouter);
app.use("/api", messageRouter)

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

// const app1 = 'http://localhost:3003'



// Socket.io event handlers
io.on("connection", (socket) => {
  // const userId = socket.handshake.auth.userId;
  // console.log(socket)
  // console.log(`User ${userId} connected`);
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ joinRoomId}) => {
    const roomName = joinRoomId;
    socket.join(roomName);
    console.log(`User ${socket.id} joined room ${roomName}`);
  });

  socket.on("send_message", ({ joinRoomId,message }) => {
    const roomName = joinRoomId;
    console.log(roomName)
    console.log(`Sending message to room ${roomName}:`, message);
    io.to(roomName).emit("receive_message", {  message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const ioi= new Server(server);
ioi.on("connection", async(socket) => {
  const userId = socket.handshake.auth.userId;
  await User.findByIdAndUpdate({_id:userId},{$set:{is_online:1}});
  // console.log(socket)
  console.log(`User ${userId} connected`);
  console.log("User connected:", socket.id);

  socket.on("disconnect", async() => {
    const userId = socket.handshake.auth.userId;
    console.log("User disconnected:", socket.id);
    await User.findByIdAndUpdate({_id:userId},{$set:{is_online:0}});
  });
});

// Authorization
app.get("/user/data", async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(' ')[1]; 
  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await User.findOne({_id:decoded.user}); 
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ email: user.email, username: user.username });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});
// Start the server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));