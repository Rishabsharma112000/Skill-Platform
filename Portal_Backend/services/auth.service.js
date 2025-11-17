const User = require('../db/models/user.model');
const jwt = require('jsonwebtoken');

const signToken = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const authService = {
  registerUser: async ({ name, email, password, role }) => {
    const existing = await User.findByEmail(email);
    if (existing) {
      throw new Error('Email already used');
    }
    const user = await User.create({ name, email, password, role });
    const token = signToken(user);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  },

  loginUser: async ({ email, password }) => {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    console.log( user.password);
    
    const ok = await User.comparePassword(password, user.password);
    // const ok = password === user.password;
    console.log("okay " , ok);

    
    if (!ok) {
      throw new Error('Invalid password');
    }
    const token = signToken(user);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  },
};

module.exports = authService;
