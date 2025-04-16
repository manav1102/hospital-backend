const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    doctorId: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true},
    photo: { type: String },
    password: { type: String, required: true },
    role: { type: String, required: true },
    specialization: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: Number, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    consultationFee: { type: Number },

    availableDays: { type: [String], required: true },
    workingHours: { type: String, required: true },
    appointmentDuration: { type: Number },

    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },

    hospitalId: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Doctor", doctorSchema);
