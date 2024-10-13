const express = require("express");
const RequestAccepts = require("../model/requestAccepts");
const router = express.Router();

router.post("/accepts", async(req,res)=>{
    const {username, acceptUserId} = req.body;
    try {
        const acceptsUser = await RequestAccepts.create({
            username,acceptUserId
        })
        return res.status(200).json({message:"Accept user data store successfull", acceptsUser})
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
})

module.exports = router;