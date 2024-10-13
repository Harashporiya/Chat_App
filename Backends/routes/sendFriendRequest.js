const express = require("express");
const sendFriend = require("../model/sendFriendRequest");

const router = express.Router();

router.post("/userId", async(req,res)=>{
    const {loginUserId, username, sentFriendId, sentFriendUsername} = req.body;
    try {
        const userNew =  new sendFriend({loginUserId, username, sentFriendId, sentFriendUsername});
        await userNew.save();
        return res.status(200).json({message:"User id store successfull", userNew})
    } catch (error) {
        return res.status(500).json({ error: 'Failed to store the user id' });
    }
})

router.get("/sent", async(req,res)=>{
    try {
        const userdata = await sendFriend.find({})
        if(!userdata){
            return res.status(404).json({message:"User Id id not found"})
        }
        return res.status(200).json({message:"All request fetch data",userdata})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
})

router.delete("/delete/:id", async(req,res)=>{
    const params = req.params;
    const id = params.id;
    console.log(id)
    try {
        const deleteId = await sendFriend.findByIdAndDelete(id);
        return res.status(200).json({message:"Friend request delete", deleteId})
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", details: error.message });
    }
})

module.exports = router