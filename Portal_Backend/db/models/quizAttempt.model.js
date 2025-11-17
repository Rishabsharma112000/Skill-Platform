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
    const [rows] = await pool.execute(
      'SELECT s.name as skill_name, AVG(qa.percentage) as average_percentage FROM quiz_attempts qa JOIN skills s ON qa.skill_id = s.id WHERE qa.user_id = ? GROUP BY s.name',
      [userId]
    );

    return { skillPerformance: rows.map(row => ({ ...row, averageScore: row.average_percentage })) };
  }

  static async getAllUsersPerformance() {
    const [rows] = await pool.execute(
      'SELECT u.id as user_id, u.name as user_name, s.name as skill_name, AVG(qa.percentage) as average_percentage FROM quiz_attempts qa JOIN skills s ON qa.skill_id = s.id JOIN users u ON qa.user_id = u.id WHERE u.role = \'user\' GROUP BY u.id, u.name, s.name ORDER BY u.name, s.name'
    );
    
    const usersPerformance = {};
    rows.forEach(row => {
      if (!usersPerformance[row.user_id]) {
        usersPerformance[row.user_id] = {
          id: row.user_id,
          name: row.user_name,
          skillPerformance: [],
        };
      }
      usersPerformance[row.user_id].skillPerformance.push({
        skillName: row.skill_name,
        averagePercentage: parseFloat(row.average_percentage),
      });
    });
    
    return Object.values(usersPerformance);
  }


  // static async clearReportCaches() {
  //   console.log("Clearing all quiz report caches...");
  //   const keys = await redisClient.keys('report:*');
  //   if (keys.length > 0) {
  //     await redisClient.del(keys);
  //     console.log(`Cleared ${keys.length} report caches.`);
  //   } else {
  //     console.log('No report caches to clear.');
  //   }
  // }

  static async clearReportCaches() {
    console.log("Clearing all quiz report caches...");
    
    let cursor = '0';
    let keys = [];
    do {
      const [newCursor, scannedKeys] = await redisClient.scan(cursor, 'MATCH', 'report:*');
      cursor = newCursor;
      keys = keys.concat(scannedKeys);
    } while (cursor !== '0'); 
  
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cleared ${keys.length} report caches.`);
    } else {
      console.log('No report caches to clear.');
    }
  }
  
}

module.exports = QuizAttempt;
