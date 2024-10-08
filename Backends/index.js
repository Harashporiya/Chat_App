const mongoose = require("mongoose")
const express = require("express")
const app = express()
const PORT = 6006;

mongoose.connect("mongodb://localhost:27017/chat_App")
.then(()=>{
    console.log("Mongodb Connect")
})
app.get("/", (req,res)=>{
    return res.send("Chat App")
})


app.listen(PORT,()=>console.log(`Server Started At PORT: ${PORT}`))