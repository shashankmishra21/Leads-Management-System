const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register User

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        //validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        // if already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password,
            role: role || "STAFF",
        });


        const token = generateToken(newUser);

        return res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                role: newUser.role,
            },
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "Server error while registering user",
        });
    }
};


// Login User

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Generate token
        const token = generateToken(user);

        // Send response
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            },
        });

    } catch (error) {

        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Server error while logging in",
        });

    }
};