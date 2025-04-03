const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const { generateUserToken } = require("../middleware/authMiddleware");

// ✅ Register User (Admin / Hospital / Doctor)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // ✅ Generate unique Doctor ID (First 3 letters + DDMM)
        const namePart = name.substring(0, 3).toUpperCase();
        const datePart = new Date().toISOString().slice(8, 10) + new Date().toISOString().slice(5, 7);
        const userId = `${namePart}${datePart}`;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create New User
        user = new User({
            userId,
            name,
            email,
            password: hashedPassword,
            role, // 'admin', 'hospital', or 'doctor'
        });

        await user.save();

        // Generate Token
        const token = generateUserToken(user._id, user.role, user.email);
        res.status(201).json({ message: "User registered successfully", token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        // Validate Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        // Generate Token
        const token = generateUserToken(user._id, user.userId, user.role,user.email);

        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { registerUser, loginUser };
