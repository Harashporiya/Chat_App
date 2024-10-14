const express = require("express");
const messageSent = require("../model/messageSend");
const router = express.Router();


router.post("/message", async(req,res)=>{
    const {loginUserId,loginUsername,sentUserId,sentUsername}=req.body;
    try {
        const messageCreate = await messageSent.create({
            loginUserId,loginUsername,sentUserId,sentUsername
        })

        return res.status(200).json({message:"Store successfull", messageCreate})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
})

router.get("/message")

module.exports = router;