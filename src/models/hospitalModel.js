const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
    hospitalId: { type: String, required: true, unique: true },
    hospitalName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    establishedYear: { type: Number },
    address: { type: String, required:true },
    hospitalType: { type: String, required:true },
    password: { type: String, required:true },
    role: { type: String, required: true },
    status: { type: String, required: true, default:"Active" },
    image: { type: String }  // URL or Base64
}, { timestamps: true });

module.exports = mongoose.model("Hospital", hospitalSchema);
