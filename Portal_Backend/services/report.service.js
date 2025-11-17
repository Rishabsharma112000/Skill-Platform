const QuizAttempt = require('../db/models/quizAttempt.model');
const { CustomError } = require('../middleware/error.middleware');

const reportService = {
  getUserPerformanceReport: async (userId, userRole, reqUserId) => {
    const targetUserId = userId || reqUserId;

    if (!targetUserId) {
      throw new CustomError('User ID is required for this report', 400);
    }
    if (userRole !== 'admin' && String(reqUserId) !== String(targetUserId)) {
      throw new CustomError('Forbidden: You can only view your own performance report', 403);
    }

    const report = await QuizAttempt.getUserPerformance(targetUserId);
    return report;
  },

  getAllUsersPerformanceReport: async () => {
    const usersPerformance = await QuizAttempt.getAllUsersPerformance();
    return usersPerformance;
  },


  getTimeBasedReport: async (timeframe) => {
    const report = await QuizAttempt.getTimeBasedReport(timeframe);
    return report;
  },
};

module.exports = reportService;
