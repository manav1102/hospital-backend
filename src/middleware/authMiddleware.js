const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel.js");
const ApiLog=require("../models/ApiLog.js");

// ✅ Token Decoding Function
const decodeToken = (req) => {
    const token = req.header("Authorization");
    console.log("🛑 Received Token:", token);

    if (!token || !token.startsWith("Bearer ")) {
        throw new Error("No token, authorization denied");
    }

    const tokenWithoutBearer = token.replace("Bearer ", "").trim();
    console.log("✅ Token without Bearer:", tokenWithoutBearer);

    return jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
};

// ✅ JWT Authentication Middleware (For All Users)
const authMiddleware = async (req, res, next) => {
    console.log("🚀 Headers:", req.headers);

    try {
        const decoded = decodeToken(req);
        console.log("🔍 Decoded Token:", decoded);

        if (!decoded || !decoded.id || !decoded.role) {
            return res.status(401).json({ message: "Invalid token structure" });
        }

        const user = await User.findById(decoded.id).select("-password");
        console.log("✅ User from DB:", user);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Ensure userId is correctly assigned
        req.user = { ...user.toObject(), role: decoded.role, id: decoded.userId };
        
        console.log("🔹 Final req.user before next():", decoded.userId);

        next();
    } catch (error) {
        console.error("❌ Error in authMiddleware:", error.message);
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

// ✅ Admin Authorization Middleware
const adminAuth = (req, res, next) => {
    try {
        const decoded = decodeToken(req);
        console.log("🔍 Decoded Token:", decoded);
        
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

const hospitalAuth = (req, res, next) => {
    try {
        const decoded = decodeToken(req);
        console.log("🔍 Decoded Token:", decoded);
        
        if (decoded.role !== "hospital") {
            return res.status(403).json({ message: "Access denied. Hospital only." });
        }
        
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

const doctorAuth = (req, res, next) => {
    try {
        const decoded = decodeToken(req);
        console.log("🔍 Decoded Token:", decoded);
        
        if (decoded.role !== "hospital" && decoded.role !== "doctor") {
            return res.status(403).json({ message: "Access denied. Doctor and Hospital only." });
        }
        
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

// ✅ Generate JWT Token
const generateUserToken = (id, userId, role, email) => {
    return jwt.sign({ id: id,userId, role, email }, process.env.JWT_SECRET, { expiresIn: "365d" });
};


const apiLogger = async (req, res, next) => {
    try {
        const logEntry = new ApiLog({
            method: req.method,
            endpoint: req.originalUrl,
            requestBody: req.body,
            headers: req.headers,
            userId: req.userId || null, // Attach userId if authenticated
        });

        await logEntry.save(); // Save log to the database
    } catch (error) {
        console.error("❌ Error saving API log:", error.message);
    }

    next(); // Move to the next middleware
};

module.exports = { authMiddleware, adminAuth, hospitalAuth, generateUserToken, decodeToken, apiLogger, doctorAuth };
