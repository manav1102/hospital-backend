const express = require("express");
const connectDB = require("./db");
const authRoutes = require("./src/routes/authRoutes.js");
const hospitalRoutes = require("./src/routes/hospitalRoutes.js");
const doctorRoutes = require("./src/routes/doctorRoutes.js");
const cors = require("cors");
require("dotenv").config();
const {apiLogger} = require("./src/middleware/authMiddleware.js");


const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for API security
app.use(apiLogger);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);


// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Server Listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
