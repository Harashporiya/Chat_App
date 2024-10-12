const mongoose = require("mongoose")
const loginUserAccept = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        unique:true,
    },
    profileImage:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s",
    },
    username:{
        type:String,
        required:true,
    }
}, {timestamps:true})

const LoginUserAccept = mongoose.model("LoginUserAccept", loginUserAccept);

module.exports = LoginUserAccept;