const userService = require('../services/users.service');
const { CustomError } = require('../middleware/error.middleware');


exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit, q, role } = req.query;
    const result = await userService.getUsers({ page, limit, q, role });
    res.json(result);
  } catch (err) {
    next(new CustomError('Failed to retrieve users', 500, err.message));
  }
};


exports.getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, email, role } = req.body;
    const user = await userService.updateUserById(id, { name, email, role });
    res.json(user);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return next(new CustomError('Email already in use', 400));
    }
    next(err);
  }
};


exports.deleteUserById = async (req, res, next) => {
  try {
    const result = await userService.deleteUserById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err); 
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getMyProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err); 
  }
};


exports.updateMyProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await userService.updateMyProfile(req.user.id, { name, email });
    res.json(user);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return next(new CustomError('Email already in use', 400));
    }
    next(err);
  }
};


exports.changeMyPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await userService.changeMyPassword(req.user.id, { oldPassword, newPassword });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
