const express = require("express");
const doctorController = require("../controller/doctorController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// ✅ Routes (Only Admins Can Add/Edit/Delete)
router.route("/add")
    .post(authMiddleware.hospitalAuth ,doctorController.addDoctor);  // Add hospital

router.route("/all")
    .get(authMiddleware.hospitalAuth,doctorController.getAllDoctors);  // Get all hospitals

router.route("/getById/:doctorId")
    .get(authMiddleware.hospitalAuth, doctorController.getDoctorById)   // Get hospital by ID
    .put(authMiddleware.hospitalAuth, doctorController.editDoctor)      // Edit hospital
    .delete(authMiddleware.hospitalAuth, doctorController.deleteDoctor);// Delete hospital

router.route("/getDoctorLight")
    .get(authMiddleware.hospitalAuth ,doctorController.getDoctorList);  


module.exports = router;
