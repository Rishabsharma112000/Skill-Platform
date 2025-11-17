const Question = require('../db/models/question.model');
const QuizAttempt = require('../db/models/quizAttempt.model');
const { CustomError } = require('../middleware/error.middleware');

const quizService = {
  submitQuizAttempt: async ({ userId, skill_id, responses }) => {
    const qIds = responses.map(r => r.question_id);
    const questions = await Promise.all(qIds.map(id => Question.findById(id)));
    const questionMap = new Map(questions.map(q => [q.id, q]));

    let totalScore = 0;
    const answers = responses.map(r => {
      const q = questionMap.get(r.question_id);
      if (!q) throw new CustomError(`Question with ID ${r.question_id} not found`, 404);

      const selectedOption = q.options.find(opt => opt.id === r.selected_option_id);
      if (!selectedOption) throw new CustomError(`Option with ID ${r.selected_option_id} not found for question ${r.question_id}`, 404);

      const isCorrect = selectedOption.is_correct;
      const score = isCorrect ? 1 : 0;
      if (isCorrect) totalScore += score;
      return {
        question_id: q.id,
        selected_option_id: selectedOption.id,
        is_correct: isCorrect,
        score
      };
    });

    const totalQuestions = responses.length;
    const percentage = totalQuestions ? (totalScore / totalQuestions) * 100 : 0;

    const attempt = await QuizAttempt.create({
      user_id: userId,
      skill_id: skill_id,
      answers,
      totalScore,
      totalQuestions,
      percentage
    });

    return attempt;
  },

  getQuizQuestions: async (skillId) => {
    const questions = await Question.findAll({ skillId, limit: 5 });
    if (!questions || questions.length === 0) {
      throw new CustomError('No questions found for this skill', 404);
    }
    return questions;
  },
};

module.exports = quizService;
