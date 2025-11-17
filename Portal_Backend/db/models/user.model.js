const pool = require('../db');
const bcrypt = require('bcryptjs');
const { BCRYPT_SALT_ROUNDS = 10 } = process.env;

class User {
  static async create({ name, email, password, role = 'user' }) {
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_ROUNDS));
      hashedPassword = await bcrypt.hash(password, salt);
    }
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
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

  static async update(id, { name, email, password, role }) {
    let query = 'UPDATE users SET';
    const params = [];
    const updates = [];

    if (name) { updates.push('name = ?'); params.push(name); }
    if (email) { updates.push('email = ?'); params.push(email); }
    if (role) { updates.push('role = ?'); params.push(role); }
    if (password !== undefined) { // Only hash if password is explicitly provided
      let hashedPassword = null;
      if (password) { // If password is provided and not null/empty, hash it
        const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_ROUNDS));
        hashedPassword = await bcrypt.hash(password, salt);
      }
      updates.push('password = ?');
      params.push(hashedPassword);
    }

    if (updates.length === 0) return null; 

    query += ' ' + updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
