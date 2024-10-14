const mongoose = require("mongoose")
const express = require("express")
const app = express()
const PORT = 6006;
const userRouter = require("./routes/user")
const acceptUserRoute = require("./routes/acceptUser")
const sendFriendRequest = require("./routes/sendFriendRequest")
const requestUser = require("./routes/requestAccepts")
const messageRouter = require("./routes/messageSend")
const {Server} = require("socket.io")
const {createServer} = require("http");
const cors = require("cors")

mongoose.connect("mongodb://localhost:27017/chat_App",{})
.then(()=>{
    console.log("Mongodb Connect")
})

const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:6006",
        methods:["GET", "POST"],
        credentials:true,
    }
})

io.on("connection", (socket) => {
  console.log("user connect", socket.id);

  socket.on("join_room", (data) => {
    const { loginUserId, sentUserId } = data;
    const roomName = [loginUserId, sentUserId].join('_');
    socket.join(roomName);
    console.log(`User ${socket.id} joined room ${roomName}`);
  });

  socket.on("send_message", (data) => {
    const { loginUserId, sentUserId, message } = data;
    const roomName = [loginUserId, sentUserId].join('_');
    io.to(roomName).emit("receive_message", { senderId: loginUserId, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

app.get("/", (req,res)=>{
    return res.send("Chat App")
})

app.use(cors())
app.use(express.json())
app.use("/api", userRouter);
app.use("/api", acceptUserRoute);
app.use("/api/friend", sendFriendRequest)
app.use("/api", requestUser)
app.use("/api", messageRouter)

server.listen(PORT,()=>console.log(`Server Started At PORT: ${PORT}`))