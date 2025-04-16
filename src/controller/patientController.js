const Patient = require("../models/patientModel.js");
const User = require("../models/userModel.js");
const Doctor = require("../models/doctorModel.js");
const { authMiddleware, decodeToken } = require("../middleware/authMiddleware.js");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const addPatient = async (req, res) => {
    try {
        const patientData = req.body;

        // Validate required fields
        const requiredFields = ['fullName', 'email', 'password', 'dateOfBirth', 'admissionDate', 'phoneNumber', 'gender', 'age', 'patientType'];
        for (let field of requiredFields) {
            if (!patientData[field]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        // Check for duplicate email in User collection
        const existingUser = await User.findOne({ email: patientData.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Generate patientId
        const namePart = patientData.fullName.substring(0, 4).toUpperCase();
        const datePart = new Date().toISOString().slice(8, 10) + new Date().toISOString().slice(5, 7);
        const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        const patientId = `${namePart}${datePart}${randomPart}`;
        patientData.patientId = patientId;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(patientData.password, salt);

        // Get token data
        const decoded = decodeToken(req);
        const role = decoded.role;

        let hospitalId;
        let doctorId;

        if (role === 'doctor') {
            const doctor = await Doctor.findOne({ doctorId: decoded.userId });
            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
            hospitalId = doctor.hospitalId;
            doctorId = decoded.userId;

        } else if (role === 'hospital') {
            hospitalId = decoded.userId;
            doctorId = req.body.doctorId || null;
        } else {
            return res.status(403).json({ message: "Unauthorized role" });
        }

        if (!hospitalId) {
            return res.status(403).json({ message: "Unauthorized: Hospital ID not found" });
        }

        // Save patient and user inside a transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Create Patient document
            const patient = new Patient({
                ...patientData,
                password: hashedPassword,
                patientId,
                role: "patient",
                hospitalId,
                doctorId
            });
            await patient.save({ session });

            // Create User document
            const user = new User({
                userId: patientId,
                email: patientData.email,
                password: hashedPassword,
                role: 'patient',
                name: patientData.fullName
            });
            await user.save({ session });

            await session.commitTransaction();
            session.endSession();

            res.status(201).json({ message: "Patient added successfully", patient });

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.error("❌ Transaction error:", err.message);
            res.status(500).json({ message: "Failed to add patient", error: err.message });
        }

    } catch (error) {
        console.error("❌ Error in addPatient:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getAllPatients = async (req, res) => {
    try {
        const decoded = decodeToken(req);
        const role = decoded.role;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let filter = {};

        if (role === 'doctor') {
            // For doctor: fetch patients by doctorId = token userId
            filter.doctorId = decoded.userId;
        } else if (role === 'hospital') {
            // For hospital: if query.doctorId present, filter by it
            filter.hospitalId = decoded.userId;
            if (req.query.doctorId) {
                filter.doctorId = req.query.doctorId;
            }
        } else {
            return res.status(403).json({ message: "Unauthorized role" });
        }

        const patients = await Patient.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Patient.countDocuments(filter);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Patients fetched successfully",
            data: patients,
            pagination: {
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                pageSize: limit,
            },
        });

    } catch (err) {
        console.error("❌ Error in getAllPatients:", err.message);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// ✅ Get Patient by ID
const getPatientById = async (req, res) => {
    try {
        const { patientId } = req.params;

        const patient = await Patient.findOne({ patientId });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: "Patient details fetched successfully",
            data: patient,
        });
    } catch (err) {
        console.error("❌ Error in getPatientById:", err.message);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// ✅ Edit Patient
const editPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        const patient = await Patient.findOneAndUpdate(
            { patientId },
            req.body,
            { new: true }
        );

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ message: "Patient updated successfully", patient });
    } catch (err) {
        console.error("❌ Error in editPatient:", err.message);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// ✅ Delete Patient
const deletePatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        const patient = await Patient.findOneAndDelete({ patientId });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (err) {
        console.error("❌ Error in deletePatient:", err.message);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

module.exports = {
    addPatient,
    getAllPatients,
    getPatientById,
    editPatient,
    deletePatient,
};
