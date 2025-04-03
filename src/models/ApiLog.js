const mongoose = require("mongoose");

const apiLogSchema = new mongoose.Schema({
    method: { type: String, required: true }, // GET, POST, PUT, DELETE
    endpoint: { type: String, required: true }, // API URL
    requestBody: { type: Object, default: {} }, // Request body
    userId: { type: String, default: null }, // ID of the user making the request
    timestamp: { type: Date, default: Date.now } // Time of request
});

const ApiLog = mongoose.model("ApiLog", apiLogSchema);
module.exports = ApiLog;
