const mongoose = require("mongoose")
const sendFriendRequest = new mongoose.Schema({
    loginUserId: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s",
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