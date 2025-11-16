const questionService = require('../services/question.service');
const { CustomError } = require('../middleware/error.middleware');

exports.createQuestion = async (req, res, next) => {
  try {
    const { questionText, options, skillId } = req.body;
    const question = await questionService.createQuestion({ questionText, options, skillId, created_by: req.user.id });
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

exports.getQuestions = async (req, res, next) => {
  try {
    const { page, limit, skillId, difficulty, q } = req.query;
    const result = await questionService.getQuestions({ page, limit, skillId, difficulty, q });
    res.json(result);
  } catch (err) {
    next(new CustomError('Failed to retrieve questions', 500, err.message));
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    const question = await questionService.getQuestion(req.params.id);
    res.json(question);
  } catch (err) {
    next(err);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionText, options, skillId, difficulty } = req.body;
    const question = await questionService.updateQuestion(id, { questionText, options, skillId, difficulty });
    res.json(question);
  } catch (err) {
    next(new CustomError('Failed to update question', 500, err.message));
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const result = await questionService.deleteQuestion(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
