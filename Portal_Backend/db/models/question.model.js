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

  static async findAll({ skillId, difficulty, limit, offset }) {
    let query = 'SELECT q.*, s.name as skill_name, u.name as created_by_name FROM questions q LEFT JOIN skills s ON q.skill_id = s.id LEFT JOIN users u ON q.created_by = u.id WHERE 1=1';
    const params = [];

    if (skillId) { query += ' AND q.skill_id = ?'; params.push(skillId); }
    if (difficulty) { query += ' AND q.difficulty = ?'; params.push(difficulty); }

    const offsetVal = offset ? Number(offset) : 0;
    if (limit) {
      query += ` LIMIT ${offsetVal}, ${Number(limit)}`;
    }

    const [questions] = await pool.execute(query, params);

    const questionsWithOptions = await Promise.all(questions.map(async question => {
      const [options] = await pool.execute('SELECT id, text, is_correct FROM options WHERE question_id = ?', [question.id]);
      return { ...question, options };
    }));

    return questionsWithOptions;
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
