const express = require("express");
const patientController = require("../controller/patientController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// ✅ Routes (Only Doctor and Hospital Can Add/Edit/Delete)
router.route("/add")
    .post(authMiddleware.doctorAuth,patientController.addPatient);  // Add hospital

router.route("/all")
    .get(authMiddleware.doctorAuth,patientController.getAllPatients);  // Get all hospitals

router.route("/getById/:patientId")
    .get(authMiddleware.doctorAuth, patientController.getPatientById)   // Get hospital by ID
    .put(authMiddleware.doctorAuth, patientController.editPatient)      // Edit hospital
    .delete(authMiddleware.doctorAuth, patientController.deletePatient);// Delete hospital

module.exports = router;
