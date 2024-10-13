const express = require("express");
const RequestAccepts = require("../model/requestAccepts");
const router = express.Router();

router.post("/accepts", async(req,res)=>{
    const {username, acceptUserId, loginUsername, loginUserId} = req.body;
    try {
        const acceptsUser = await RequestAccepts.create({
            username,acceptUserId, loginUsername, loginUserId
        })
        return res.status(200).json({message:"Accept user data store successfull", acceptsUser})
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
})


router.get("/all/accepts", async(req,res)=>{
    try {
        const allAcceptsUser = await RequestAccepts.find();
        return res.status(200).json({message:"Fetch the data all, accepts friends", allAcceptsUser})
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
})

module.exports = router;