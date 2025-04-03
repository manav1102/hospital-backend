const express = require("express");
const hospitalController = require("../controller/hospitalController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// ✅ Routes (Only Admins Can Add/Edit/Delete)
router.route("/add")
    .post(authMiddleware.adminAuth,hospitalController.addHospital);  // Add hospital

router.route("/all")
    .get(authMiddleware.adminAuth,hospitalController.getAllHospitals);  // Get all hospitals

router.route("/getById/:hospitalId")
    .get(authMiddleware.adminAuth, hospitalController.getHospitalById)   // Get hospital by ID
    .put(authMiddleware.adminAuth, hospitalController.editHospital)      // Edit hospital
    .delete(authMiddleware.adminAuth, hospitalController.deleteHospital);// Delete hospital

module.exports = router;
