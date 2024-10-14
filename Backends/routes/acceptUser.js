const express = require("express");
const AcceptUser = require("../model/acceptUser");
const router = express.Router();

router.post("/userId", async (req, res) => {
    const { loginUserId, username, sentFriendId, sentFriendUsername } = req.body;
    
    // console.log(req.body);
    
    try {
        const userNew = await AcceptUser.create({ loginUserId, username, sentFriendId, sentFriendUsername });
        // console.log(userNew);
        return res.status(200).json({ message: "User id stored successfully", userNew });
    } catch (error) {
        console.error("Error storing user id:", error);
        return res.status(500).json({ error: 'Failed to store the user id', details: error.message });
    }
});

router.get("/sent", async (req, res) => {
    try {
        const userdata = await AcceptUser.find({});
        if (userdata.length === 0) {
            return res.status(404).json({ message: "No user data found" });
        }
        return res.status(200).json({ message: "All request fetch data", userdata });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Internal server error", details: error.message });
    }
});

router.delete("/delete/:id", async(req,res)=>{
    const params = req.params;
    const id = params.id;
    // console.log(id)
    try {
        const deleteId = await AcceptUser.findByIdAndDelete(id);
        return res.status(200).json({message:"Friend request delete", deleteId})
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", details: error.message });
    }
})

module.exports = router;