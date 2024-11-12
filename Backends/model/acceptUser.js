const mongoose = require("mongoose")
const acceptUser = new mongoose.Schema({
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
}, { timestamps: true });

const AcceptUser = mongoose.model("AcceptUser", acceptUser);

module.exports = AcceptUser;
