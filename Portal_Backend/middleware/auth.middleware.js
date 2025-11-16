const jwt = require('jsonwebtoken');
const User = require('../db/models/user.model'); 
const { JWT_SECRET } = process.env;
const { CustomError } = require('./error.middleware'); 

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) return next(new CustomError('Unauthorized', 401));
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id); 
    if(!user) return next(new CustomError('Invalid token', 401));
    delete user.password; 
    req.user = user;
    next();
  } catch(err){
    return next(new CustomError('Invalid token', 401));
  }
};
