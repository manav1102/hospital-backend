const User = require("../models/userModel");

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }
}

module.exports = new UserRepository();
