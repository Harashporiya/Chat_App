const express = require("express");
const User = require("../model/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const multer = require("multer");
const path = require("path");

config();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    },
    fileFilter: fileFilter
});

// Signup Route
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

// Signin Route
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

// Get All Users
router.get("/all/users", async (req, res) => {
    try {
        const allUser = await User.find({})
        if (!allUser) {
            return res.status(404).json({ message: "Users not found" })
        }
        return res.status(200).json({ message: "All user fetch", allUser })
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch data" })
    }
});

// Get Single User
router.get('/user/:id', async (req, res) => {
    const params = req.params;
    const id = params.id;
    try {
        const UserIdBy = await User.findById({ _id: id })
        if (!UserIdBy) {
            return res.status(404).json({ message: "User not found" })
        }
        
        return res.status(200).json({ message: "User fetch", UserIdBy })
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch data" })
    }
});

// Update Profile Image
router.put("/update-profile-image/:id", upload.single('profileImage'), async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageUrl = `/public/assets/${req.file.filename}`;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profileImage: imageUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile image updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update profile image" });
    }
});

// Update Background Image
router.put("/update-background-image/:id", upload.single('backgroundImage'), async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageUrl = `/public/assets/${req.file.filename}`;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { backgroundImage: imageUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Background image updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update background image" });
    }
});

// Reset Profile Image
router.put("/reset-profile-image/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        
        const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s";
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profileImage: defaultImage },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile image reset to default",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to reset profile image" });
    }
});

// Reset Back ground  Image
router.put("/update-background-image/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        
        const defaultImage = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop"
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { backgroundImage: defaultImage },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Back ground image reset to default",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to reset back ground image" });
    }
});
module.exports = router;