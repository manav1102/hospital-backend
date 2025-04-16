const express = require("express");
const { connectToDB } = require("../db.js");
const authRoutes = require("../src/routes/authRoutes.js");
const hospitalRoutes = require("../src/routes/hospitalRoutes.js");
const doctorRoutes = require("../src/routes/doctorRoutes.js");
const patientRoutes = require("../src/routes/patientRoutes.js");
const cors = require("cors");
require("dotenv").config();
const { apiLogger } = require("../src/middleware/authMiddleware.js");

const app = express();
connectToDB;

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(apiLogger);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patient", patientRoutes);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Connect DB before handling any request


module.exports = app;
