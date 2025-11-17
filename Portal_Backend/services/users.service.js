const User = require('../db/models/user.model');
const { CustomError } = require('../middleware/error.middleware');

const userService = {
  getUsers: async ({ page, limit, q, role }) => {
    const result = await User.findAll({ page, limit, q, role });
    return result;
  },

  getUserById: async (id) => {
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    delete user.password;
    return user;
  },

  getMyProfile: async (id) => {
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    delete user.password;
    return user;
  },

};

module.exports = userService;
