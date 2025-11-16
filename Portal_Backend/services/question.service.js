const Question = require('../db/models/question.model');
const { CustomError } = require('../middleware/error.middleware');

const questionService = {
  createQuestion: async ({ questionText, options, skillId, created_by }) => {
    const payload = { text: questionText, options, skill_id: skillId, created_by };
    const question = await Question.create(payload);
    return question;
  },

  getQuestions: async ({ page, limit, skillId, difficulty, q }) => {
    const result = await Question.findAll({ page, limit, skillId, difficulty, q });
    return result;
  },

  getQuestion: async (id) => {
    const question = await Question.findById(id);
    if (!question) {
      throw new CustomError('Question not found', 404);
    }
    return question;
  },

  updateQuestion: async (id, { questionText, options, skillId, difficulty }) => {
    const payload = { text: questionText, options, skill_id: skillId, difficulty };
    const updated = await Question.update(id, payload);
    if (!updated) {
      throw new CustomError('Question not found or no changes made', 404);
    }
    const question = await Question.findById(id);
    return question;
  },

  deleteQuestion: async (id) => {
    const deleted = await Question.delete(id);
    if (!deleted) {
      throw new CustomError('Question not found', 404);
    }
    return { success: true, message: 'Question deleted successfully' };
  },
};

module.exports = questionService;
