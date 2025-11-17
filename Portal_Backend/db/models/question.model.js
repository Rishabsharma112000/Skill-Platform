const pool = require('../db');

class Question {
  static async create({ skill_id, text, options, difficulty = 'medium', created_by = null }) {
    const [questionResult] = await pool.execute(
      'INSERT INTO questions (skill_id, text, difficulty, created_by) VALUES (?, ?, ?, ?)',
      [skill_id, text, difficulty, created_by]
    );
    const questionId = questionResult.insertId;

    const optionPromises = options.map(option =>
      pool.execute(
        'INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)',
        [questionId, option.text, option.isCorrect]
      )
    );
    await Promise.all(optionPromises);

    return { id: questionId, skill_id, text, options, difficulty, created_by };
  }

  static async findById(id) {
    const [questions] = await pool.execute(
      'SELECT q.*, s.name as skill_name, u.name as created_by_name FROM questions q LEFT JOIN skills s ON q.skill_id = s.id LEFT JOIN users u ON q.created_by = u.id WHERE q.id = ?',
      [id]
    );
    if (!questions[0]) return null;

    const [options] = await pool.execute('SELECT id, text, is_correct FROM options WHERE question_id = ?', [id]);
    return { ...questions[0], options };
  }

  static async findAll({ page = 1, limit = 10, skillId, difficulty, q }) {
    let query = 'SELECT q.*, s.name as skill_name, u.name as created_by_name FROM questions q LEFT JOIN skills s ON q.skill_id = s.id LEFT JOIN users u ON q.created_by = u.id WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as count FROM questions q WHERE 1=1';
    const params = [];
    const countParams = [];

    if (skillId) { 
      query += ' AND q.skill_id = ?'; 
      countQuery += ' AND q.skill_id = ?'; 
      params.push(skillId);
      countParams.push(skillId);
    }
    if (difficulty) { 
      query += ' AND q.difficulty = ?'; 
      countQuery += ' AND q.difficulty = ?'; 
      params.push(difficulty);
      countParams.push(difficulty);
    }
    if (q) { 
      query += ' AND q.text LIKE ?'; 
      countQuery += ' AND q.text LIKE ?'; 
      params.push(`%${q}%`);
      countParams.push(`%${q}%`);
    }


    query += ' ORDER BY q.created_at DESC';

    const offset = (page - 1) * limit;
    query += ` LIMIT ${Number(offset)}, ${Number(limit)}`;

    const [questions] = await pool.execute(query, params);
    const [countRows] = await pool.execute(countQuery, countParams);
    const total = countRows[0].count;

    const questionsWithOptions = await Promise.all(questions.map(async question => {
      const [options] = await pool.execute('SELECT id, text, is_correct FROM options WHERE question_id = ?', [question.id]);
      return { ...question, options };
    }));

    return { data: questionsWithOptions, meta: { total, page: Number(page), limit: Number(limit) } };
  }

  static async update(id, { skill_id, text, options, difficulty, created_by }) {
    let questionQuery = 'UPDATE questions SET';
    const questionParams = [];
    const questionUpdates = [];

    if (skill_id) { questionUpdates.push('skill_id = ?'); questionParams.push(skill_id); }
    if (text) { questionUpdates.push('text = ?'); questionParams.push(text); }
    if (difficulty) { questionUpdates.push('difficulty = ?'); questionParams.push(difficulty); }
    if (created_by !== undefined) { questionUpdates.push('created_by = ?'); questionParams.push(created_by); }

    if (questionUpdates.length > 0) {
      questionQuery += ' ' + questionUpdates.join(', ') + ' WHERE id = ?';
      questionParams.push(id);
      await pool.execute(questionQuery, questionParams);
    }

    if (options && options.length > 0) {
      await pool.execute('DELETE FROM options WHERE question_id = ?', [id]);
      const optionPromises = options.map(option =>
        pool.execute(
          'INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)',
          [id, option.text, option.isCorrect]
        )
      );
      await Promise.all(optionPromises);
    }

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM options WHERE question_id = ?', [id]);
    const [result] = await pool.execute('DELETE FROM questions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Question;
