const mongoose = require("mongoose")
const messageSchema = new mongoose.Schema({
    loginUserId:{
        type:String,
        required:true,
    },
    loginUsername:{
        type:String,
        required:true,
    },
    sentUserId:{
        type:String,
        required:true,
    },
    sentUsername:{
        type:String,
        required:true,
    }
}, {timestamps:true});

const messageSent = mongoose.model("messageSent", messageSchema);

module.exports = messageSent;