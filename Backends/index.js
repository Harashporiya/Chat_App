const mongoose = require("mongoose")
const express = require("express")
const app = express()
const PORT = 6006;
const userRouter = require("./routes/user")
const acceptUserRoute = require("./routes/acceptUser")
const loginUserRouter = require("./routes/LoginUserSend")

mongoose.connect("mongodb://localhost:27017/chat_App",{})
.then(()=>{
    console.log("Mongodb Connect")
})
app.get("/", (req,res)=>{
    return res.send("Chat App")
})
app.use(express.json())
app.use("/api", userRouter);
app.use("/api", acceptUserRoute);
app.use("/api/login", loginUserRouter)

app.listen(PORT,()=>console.log(`Server Started At PORT: ${PORT}`))