const express = require("express");
const User = require("../model/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body; 
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = await User.create({
      username,
      email,
      password: hashPassword,
    });
    const token = jwt.sign(
      { user: createUser._id },
      process.env.secretKey,
      { expiresIn: "2d" }
    );
    return res
      .status(200)
      .json({ message: "Create Account Successful", createUser, token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ message: "Password does not match" });
    }
    const token = jwt.sign(
      { user: user._id },
      process.env.secretKey,
      { expiresIn: "2d" }
    );
    return res
      .status(200)
      .json({ message: "Signin Successful", user, token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all/users", async(req,res)=>{
  try {
    const allUser = await User.find({})
    if(!allUser){
      return res.status(404).json({message:"Users not found"})
    }
    return res.status(200).json({message:"All user fetch", allUser})
  } catch (error) {
    return res.status(500).json({message:"Failed the fetch data"})
  }
})

router.get('/user/:id', async(req,res)=>{
  const params =  req.params;
  const id= params.id;
  console.log(id)
  try {
    const UserIdBy = await User.findById({_id:id})
    if(!UserIdBy){
      return res.status(404).json({message:"Users not found"})
    }
    return res.status(200).json({message:"User fetch", UserIdBy})
  } catch (error) {
    return res.status(500).json({message:"Failed the fetch data"})
  }
})

module.exports = router;