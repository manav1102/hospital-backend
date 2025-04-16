const Doctor = require("../models/doctorModel.js");
const User = require("../models/userModel.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { authMiddleware, decodeToken } = require("../middleware/authMiddleware.js");


const addDoctor = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Full name, email, and password are required." });
        }
        const decoded = decodeToken(req);
        const hospitalId = decoded.userId;

        if (!hospitalId) {
            return res.status(403).json({ message: "Unauthorized: Hospital ID missing from token" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        // ✅ Generate unique Doctor ID
        const namePart = fullName.substring(0, 3).toUpperCase();
        const datePart = new Date().toISOString().slice(8, 10) + new Date().toISOString().slice(5, 7);
        const doctorId = `${namePart}${datePart}`;

        // ✅ Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // ✅ Create and Save Doctor
        const doctor = new Doctor({
            doctorId: doctorId,
            ...req.body,
            password: hashedPassword,
            role: "doctor",
            hospitalId,  // This is extracted from the token
        });

        await doctor.save();
        // ✅ Create and Save User
        const user = new User({
            userId: doctorId,
            name: fullName,
            email,
            password: hashedPassword,
            role: "doctor",
        });
        await user.save();



        res.status(201).json({ message: "Doctor added successfully", doctor });
    } catch (error) {
        console.error("❌ Error in addDoctor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// ✅ Get All Hospitals
const getAllDoctors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default page = 1
        const limit = parseInt(req.query.limit) || 10; // Default limit = 10

        const decoded = decodeToken(req);
        const hospitalId = decoded.userId;

        const skip = (page - 1) * limit;

        const doctor = await Doctor.find({hospitalId})
            .sort({ createdAt: -1 }) // Latest first
            .skip(skip)
            .limit(limit);

        const total = await Doctor.countDocuments(); // Total hospitals

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Doctors fetched successfully',
            data: doctor,
            pagination: {
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                pageSize: limit,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const { doctorId } = req.params;

        console.log("Requested Doctor ID:", doctorId); // Debugging

        const doctor = await Doctor.findOne({ doctorId }); // Search by hospitalId field
        console.log("Doctor Found:", doctor); // Debugging

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json(doctor);
    } catch (err) {
        console.error("Error fetching doctor:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const editDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        console.log("Received Doctor ID:", doctorId);

        const doctor = await Doctor.findOneAndUpdate(
            { doctorId },
            req.body,
            { new: true }
        );

        console.log("Updated Doctor:", doctor);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor updated successfully", doctor });
    } catch (err) {
        console.error("Error updating doctor:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// ✅ Delete Doctor (Hospital Only)
const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        console.log("Received Doctor ID:", doctorId); // Debugging

        const doctor = await Doctor.findOneAndDelete({ doctorId });
        const user = await User.findOneAndDelete({ userId: doctorId });


        console.log("Deleted Doctor:", doctor); // Debugging

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (err) {
        console.error("Error deleting doctor:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const getDoctorList = async (req, res) => {
    try {
        const doctors = await Doctor.find({}, 'doctorId fullName').sort({ createdAt: -1 });

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Doctor list fetched successfully',
            data: doctors
        });
    } catch (err) {
        console.error("Error fetching doctor list:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};



module.exports = { addDoctor, getAllDoctors, editDoctor, deleteDoctor, getDoctorById, getDoctorList };

