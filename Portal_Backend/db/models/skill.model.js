const pool = require('../db');

class Skill {

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM skills WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByName(name) {
    const [rows] = await pool.execute('SELECT * FROM skills WHERE name = ?', [name]);
    return rows[0];
  }

  static async findAll({ page = 1, limit = 10, q }) {
    let query = 'SELECT id, name, description, created_at FROM skills WHERE 1=1';
    const params = [];

    if (q) {
      query += ' AND name LIKE ?';
      params.push(`%${q}%`);
    }

    query += ' ORDER BY name ASC';

    const offset = (page - 1) * limit;
    query += ` LIMIT ${Number(offset)}, ${Number(limit)}`;

    const [rows] = await pool.execute(query, params);

    let countQuery = 'SELECT COUNT(*) as count FROM skills WHERE 1=1';
    const countParams = [];
    if (q) {
      countQuery += ' AND name LIKE ?';
      countParams.push(`%${q}%`);
    }

    const [countRows] = await pool.execute(countQuery, countParams);
    const total = countRows[0].count;

    return { data: rows, meta: { total, page: Number(page), limit: Number(limit) } };
  }

  static async findAllWithQuestions({ page = 1, limit = 10, q }) {
    let query = `
      SELECT s.id, s.name, s.description, s.created_at
      FROM skills s
      INNER JOIN questions q ON s.id = q.skill_id
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      query += ' AND s.name LIKE ?';
      params.push(`%${q}%`);
    }

    query += ' GROUP BY s.id ORDER BY s.name ASC';

    const offset = (page - 1) * limit;
    query += ` LIMIT ${Number(offset)}, ${Number(limit)}`;

    const [rows] = await pool.execute(query, params);

    let countQuery = `
      SELECT COUNT(DISTINCT s.id) as count
      FROM skills s
      INNER JOIN questions q ON s.id = q.skill_id
      WHERE 1=1
    `;
    const countParams = [];
    if (q) {
      countQuery += ' AND s.name LIKE ?';
      countParams.push(`%${q}%`);
    }

    const [countRows] = await pool.execute(countQuery, countParams);
    const total = countRows[0] ? countRows[0].count : 0;

    return { data: rows, meta: { total, page: Number(page), limit: Number(limit) } };
  }

}

module.exports = Skill;
