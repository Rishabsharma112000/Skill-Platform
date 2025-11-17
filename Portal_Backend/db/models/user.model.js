const pool = require('../db');
const bcrypt = require('bcryptjs');
const { BCRYPT_SALT_ROUNDS = 10 } = process.env;

class User {
  static async create({ name, email, password, role = 'user' }) {
    // const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_ROUNDS));
    // const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return { id: result.insertId, name, email, role };
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async findAll({ page = 1, limit = 10, q, role }) {
    let query = 'SELECT id, name, email, role, created_at FROM users WHERE 1=1';
    const params = [];

    if (q) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${q}%`);
      params.push(`%${q}%`);
    }
    if (role) { query += ' AND role = ?'; params.push(role); }

    query += ' ORDER BY created_at DESC';

    const offset = (page - 1) * limit;
    query += ` LIMIT ${Number(offset)}, ${Number(limit)}`;

    const [rows] = await pool.execute(query, params);

    let countQuery = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
    const countParams = [];
    if (q) {
      countQuery += ' AND (name LIKE ? OR email LIKE ?)';
      countParams.push(`%${q}%`);
      countParams.push(`%${q}%`);
    }
    if (role) { countQuery += ' AND role = ?'; countParams.push(role); }

    const [countRows] = await pool.execute(countQuery, countParams);
    const total = countRows[0].count;

    return { data: rows, meta: { total, page: Number(page), limit: Number(limit) } };
  }

}

module.exports = User;
