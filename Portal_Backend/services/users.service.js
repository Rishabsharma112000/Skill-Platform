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

  updateUserById: async (id, { name, email, role }) => {
    const updated = await User.update(id, { name, email, role });
    if (!updated) {
      throw new CustomError('User not found or no changes made', 404);
    }
    const user = await User.findById(id);
    delete user.password;
    return user;
  },

  deleteUserById: async (id) => {
    const deleted = await User.delete(id);
    if (!deleted) {
      throw new CustomError('User not found', 404);
    }
    return { success: true, message: 'User deleted successfully' };
  },

  getMyProfile: async (id) => {
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    delete user.password;
    return user;
  },

  updateMyProfile: async (id, { name, email }) => {
    const updated = await User.update(id, { name, email });
    if (!updated) {
      throw new CustomError('User not found or no changes made', 404);
    }
    const user = await User.findById(id);
    delete user.password;
    return user;
  },

  changeMyPassword: async (id, { oldPassword, newPassword }) => {
    if (!oldPassword || !newPassword) {
      throw new CustomError('oldPassword and newPassword required', 400);
    }
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    const ok = await User.comparePassword(oldPassword, user.password);
    if (!ok) {
      throw new CustomError('Old password is incorrect', 400);
    }
    await User.update(id, { password: newPassword });
    return { success: true, message: 'Password updated' };
  },
};

module.exports = userService;
