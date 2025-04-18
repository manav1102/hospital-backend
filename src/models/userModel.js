const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: false, unique: false },
  name: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
