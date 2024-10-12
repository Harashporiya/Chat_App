const express = require("express");
const LoginUserAccept = require("../model/LoginUserSend");

const router = express.Router();

router.post("/userId", async(req,res)=>{
    const {userId, username} = req.body;
    if(!userId){
        return req.status(404).json({message:"Error user id is required"});
    }
    try {
        const userNew =  new LoginUserAccept({userId, username});
        await userNew.save();
        return res.status(200).json({message:"User id store successfull", userNew})
    } catch (error) {
        return res.status(500).json({ error: 'Failed to store the user id' });
    }
})

router.get("/sent", async(req,res)=>{
    try {
        const userdata = await LoginUserAccept.find({})
        if(!userdata){
            return res.status(404).json({message:"User Id id not found"})
        }
        return res.status(200).json({message:"All request fetch data",userdata})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
})

module.exports = router