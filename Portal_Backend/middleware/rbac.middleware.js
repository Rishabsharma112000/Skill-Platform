const { CustomError } = require('./error.middleware'); // Import CustomError

module.exports = (requiredRole) => (req, res, next) => {
    if(!req.user) return next(new CustomError('Unauthorized', 401));
    if(req.user.role !== requiredRole) return next(new CustomError('Forbidden', 403));
    next();
  };
  