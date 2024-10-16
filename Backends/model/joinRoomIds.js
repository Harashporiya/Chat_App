const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    users : [String],
    updatedAt: [String]
}, { timestamps: true });

const join_room = mongoose.model("join_room", messageSchema);

module.exports = join_room;
