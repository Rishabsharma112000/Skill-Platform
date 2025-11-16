const pool = require('../db');
const redisClient = require('../../utils/redis');

class QuizAttempt {
  static async create({ user_id, skill_id, answers, totalScore, totalQuestions, percentage }) {
    const [attemptResult] = await pool.execute(
      'INSERT INTO quiz_attempts (user_id, skill_id, total_score, total_questions, percentage) VALUES (?, ?, ?, ?, ?)',
      [user_id, skill_id, totalScore, totalQuestions, percentage]
    );
    const quizAttemptId = attemptResult.insertId;

    const answerPromises = answers.map(answer =>
      pool.execute(
        'INSERT INTO quiz_answers (quiz_attempt_id, question_id, selected_option_id, is_correct, score) VALUES (?, ?, ?, ?, ?)',
        [quizAttemptId, answer.question_id, answer.selected_option_id, answer.is_correct, answer.score]
      )
    );
    await Promise.all(answerPromises);

    return { id: quizAttemptId, user_id, skill_id, answers, totalScore, totalQuestions, percentage };
  }

  static async findById(id) {
    const [attempts] = await pool.execute(
      'SELECT qa.*, u.name as user_name, s.name as skill_name FROM quiz_attempts qa LEFT JOIN users u ON qa.user_id = u.id LEFT JOIN skills s ON qa.skill_id = s.id WHERE qa.id = ?',
      [id]
    );
    if (!attempts[0]) return null;

    const [answers] = await pool.execute(
      'SELECT qza.question_id, qza.selected_option_id, qza.is_correct, qza.score, q.text as question_text, o.text as selected_option_text FROM quiz_answers qza LEFT JOIN questions q ON qza.question_id = q.id LEFT JOIN options o ON qza.selected_option_id = o.id WHERE quiz_attempt_id = ?',
      [id]
    );
    return { ...attempts[0], answers };
  }

  static async findAll({ userId, skillId, limit, offset }) {
    let query = 'SELECT qa.*, u.name as user_name, s.name as skill_name FROM quiz_attempts qa LEFT JOIN users u ON qa.user_id = u.id LEFT JOIN skills s ON qa.skill_id = s.id WHERE 1=1';
    const params = [];

    if (userId) { query += ' AND qa.user_id = ?'; params.push(userId); }
    if (skillId) { query += ' AND qa.skill_id = ?'; params.push(skillId); }

    if (limit) {
      query += ' LIMIT ?';
      params.push(Number(limit));
    }
    if (offset) {
      query += ' OFFSET ?';
      params.push(Number(offset));
    }

    const [attempts] = await pool.execute(query, params);

    const attemptsWithAnswers = await Promise.all(attempts.map(async attempt => {
      const [answers] = await pool.execute(
        'SELECT qza.question_id, qza.selected_option_id, qza.is_correct, qza.score, q.text as question_text, o.text as selected_option_text FROM quiz_answers qza LEFT JOIN questions q ON qza.question_id = q.id LEFT JOIN options o ON qza.selected_option_id = o.id WHERE quiz_attempt_id = ?',
        [attempt.id]
      );
      return { ...attempt, answers };
    }));

    return attemptsWithAnswers;
  }

  static async delete(id) {
    await pool.execute('DELETE FROM quiz_answers WHERE quiz_attempt_id = ?', [id]); 
    const [result] = await pool.execute('DELETE FROM quiz_attempts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getUserPerformance(userId) {
    const cacheKey = `report:userPerformance:${userId}`;
    
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const [rows] = await pool.execute(
      'SELECT s.name as skill_name, AVG(qa.percentage) as average_percentage FROM quiz_attempts qa JOIN skills s ON qa.skill_id = s.id WHERE qa.user_id = ? GROUP BY s.name',
      [userId]
    );
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows)); 
    return { skillPerformance: rows.map(row => ({ ...row, averageScore: row.average_percentage })) };
  }

  static async getSkillGapReport() {
    const cacheKey = 'report:skillGap';
    
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const [rows] = await pool.execute(
      'SELECT s.name as skill_name, AVG(qa.percentage) as average_percentage_across_users FROM quiz_attempts qa JOIN skills s ON qa.skill_id = s.id GROUP BY s.name',
      []
    );
    
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
    return rows;
  }

  static async getTimeBasedReport(timeframe = 'month') {
    const cacheKey = `report:timeBased:${timeframe}`;
    
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    let groupBy = '';
    let dateFormat = '';
    switch (timeframe) {
      case 'week':
        groupBy = "DATE_FORMAT(created_at, '%Y-%v')";
        dateFormat = '%Y-%v';
        break;
      case 'month':
      default:
        groupBy = "DATE_FORMAT(created_at, '%Y-%m')";
        dateFormat = '%Y-%m';
        break;
    }

    const query = `SELECT DATE_FORMAT(created_at, '${dateFormat}') as period, AVG(percentage) as average_percentage, COUNT(id) as total_attempts FROM quiz_attempts GROUP BY ${groupBy} ORDER BY period ASC`;
    const [rows] = await pool.execute(query);
    
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
    return rows;
  }

  static async clearReportCaches() {
    console.log("Clearing all quiz report caches...");
    const keys = await redisClient.keys('report:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cleared ${keys.length} report caches.`);
    } else {
      console.log('No report caches to clear.');
    }
  }
}

module.exports = QuizAttempt;
