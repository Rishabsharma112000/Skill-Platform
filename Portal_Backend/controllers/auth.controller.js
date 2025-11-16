const authService = require('../services/auth.service');
const { CustomError } = require('../middleware/error.middleware');

exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const { token, user } = await authService.registerUser({ name, email, password, role });
    res.status(201).json({ token, user });
  } catch (err) {
    next(new CustomError(err.message, 400));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await authService.loginUser({ email, password });
    res.json({ token, user });
  } catch (err) {
    next(new CustomError(err.message, 400));
  }
};
