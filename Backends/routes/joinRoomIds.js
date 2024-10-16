const express = require("express");
const join_room = require("../model/joinRoomIds");
const router = express.Router();

router.post("/joinroom", async (req, res) => {
    const { loginUserId, sentUserId } = req.body;
    // console.log(sentUserId);
    try {
        const existingRoom = await join_room.findOne({
            users : { $all: [loginUserId,sentUserId]}
        })
        if(existingRoom){
            // console.log(existingRoom);
            return res.status(200).json({
                message : "room already exist",
                room : existingRoom
            })
        }
        const room = await join_room.create({
            users : [loginUserId,sentUserId]
        });
        return res.status(200).send({
            message : "room created succesfully",
            room
        })
    } catch (error) {
        
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/message", async (req, res) => {
    try {
        const messages = await join_room.find();
        return res.status(200).json(messages);
    } catch (error) {
       
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
