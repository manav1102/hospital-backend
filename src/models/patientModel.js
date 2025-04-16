const { required } = require('joi');
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId:{type:String, required: true},
  fullName: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String },
  address: { type: String },
  bloodGroup: { type: String },
  emergencyContactName: { type: String },
  emergencyContactNumber: { type: String },
  maritalStatus: { type: String },
  admissionDate: { type: Date, required: true },
  dischargeDate: { type: Date },
  patientType: { type: String, enum: ['Inpatient', 'Outpatient'], required: true },
  consultingDoctor: { type: String },
  medicalHistory: { type: String },
  currentSymptoms: { type: String },
  allergies: { type: String },
  insuranceProvider: { type: String },
  insurancePolicyNumber: { type: String },
  photo: { type: String },
  roomOrWardNumber: { type: String },
  nationality: { type: String },
  occupation: { type: String },
  hospitalId: { type: String, required: true },
  doctorId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
