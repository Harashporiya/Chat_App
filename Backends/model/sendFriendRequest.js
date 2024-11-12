const mongoose = require("mongoose")
const sendFriendRequest = new mongoose.Schema({
    loginUserId: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        
    },
    username: {
        type: String,
        required: true,
    },
    sentFriendId: {
        type: String,
        required: true,
    },
    sentFriendUsername: {
        type: String,
        required: true,
    }
}, {timestamps:true})

const sendFriend = mongoose.model("sendFriend", sendFriendRequest);

module.exports = sendFriend;