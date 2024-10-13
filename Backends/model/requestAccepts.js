const { Schema, model } = require("mongoose");

const requestSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    acceptUserId:{
        type:String,
        required:true,
    },
    profileImage: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s",
    },
    loginUsername:{
        type:String,
        required:true,
    },
    loginUserId:{
        type:String,
        required:true,
    }
}, {timestamps:true})

const RequestAccepts = model("RequestAccepts", requestSchema);
module.exports = RequestAccepts;