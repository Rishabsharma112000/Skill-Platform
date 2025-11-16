const quizService = require('../services/quizzes.service');
const { CustomError } = require('../middleware/error.middleware');

exports.submitAttempt = async (req, res, next) => {
  const userId = req.user.id;
  const { skill_id, responses } = req.body;
  try {
    const attempt = await quizService.submitQuizAttempt({ userId, skill_id, responses });
    res.status(201).json(attempt);
  } catch (err) {
    next(err);
  }
};

exports.getQuizQuestions = async (req, res, next) => {
  try {
    const { id: skillId } = req.params;
    const questions = await quizService.getQuizQuestions(skillId);
    res.status(200).json(questions);
  } catch (err) {
    next(err); 
  }
};