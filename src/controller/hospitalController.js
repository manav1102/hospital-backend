const Hospital = require("../models/hospitalModel.js");
const User = require("../models/userModel.js");
const Doctor=require("../models/doctorModel.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addHospital = async (req, res) => {
    try {

        // ✅ Generate unique hospital ID (3 letters + DDMM)
        const namePart = req.body.hospitalName.substring(0, 3).toUpperCase();
        const datePart = new Date().toISOString().slice(8, 10) + new Date().toISOString().slice(5, 7);
        const hospitalId = `${namePart}${datePart}`;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // ✅ Create & Save Hospital
        const hospital = new Hospital({ ...req.body, password: hashedPassword, hospitalId, role: "hospital" });
        await hospital.save();

        const user = new User({
            userId: hospitalId,
            email: req.body.email,
            password: hashedPassword, // Make sure to hash the password before saving
            role: 'hospital', // Fixed role as 'hospital'
            name: req.body.hospitalName // Assuming hospital name will be used as user name
        });
        await user.save();

        res.status(201).json({ message: "Hospital added successfully", hospital });
    } catch (error) {
        console.error("❌ Error in addHospital:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// ✅ Get All Hospitals
const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json({ status: 200, success: true, message: 'All Hospital fetched successfully', data: hospitals });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getHospitalById = async (req, res) => {
    try {
        const { hospitalId } = req.params;

        console.log("Requested Hospital ID:", hospitalId); // Debugging

        const hospital = await Hospital.findOne({ hospitalId }); // Search by hospitalId field
        console.log("Hospital Found:", hospital); // Debugging

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        res.status(200).json(hospital);
    } catch (err) {
        console.error("Error fetching hospital:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const editHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;

        console.log("Received Hospital ID:", hospitalId); // Debugging

        // Use `findOneAndUpdate` to search by `hospitalId` (not `_id`)
        const hospital = await Hospital.findOneAndUpdate(
            { hospitalId },  // Search by custom hospitalId field
            req.body,
            { new: true }     // Return updated document
        );

        console.log("Updated Hospital:", hospital); // Debugging

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        res.status(200).json({ message: "Hospital updated successfully", hospital });
    } catch (err) {
        console.error("Error updating hospital:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// ✅ Delete Hospital (Admin Only)
const deleteHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;

        console.log("Received Hospital ID:", hospitalId); // Debugging

        // Use `findOneAndDelete` to delete by `hospitalId`
        const hospital = await Hospital.findOneAndDelete({ hospitalId });
        const user = await User.findOneAndDelete({ userId: hospitalId });
        const doctor = await Doctor.findOneAndDelete({ hospitalId: hospitalId });



        console.log("Deleted Hospital:", hospital); // Debugging

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        res.status(200).json({ message: "Hospital deleted successfully" });
    } catch (err) {
        console.error("Error deleting hospital:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


module.exports = { addHospital, getAllHospitals, editHospital, deleteHospital, getHospitalById };

