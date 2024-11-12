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
        type:String
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