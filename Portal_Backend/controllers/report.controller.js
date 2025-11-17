const reportService = require('../services/report.service');
const { CustomError } = require('../middleware/error.middleware');

exports.getUserPerformanceReport = async (req, res, next) => {
  try {
    const userId =  req.user.id;
    if (!userId) {
      throw new CustomError('User ID is required', 400);
    }
    const report = await reportService.getUserPerformanceReport(userId, req.user.role, req.user.id);
    res.json(report);
  } catch (err) {
    next(err); 
  }
};

exports.getAllUsersPerformanceReport = async (req, res, next) => {
  try{
    const usersReport = await reportService.getAllUsersPerformanceReport();
    res.json(usersReport);
  }
  catch (err) {
    next(err);
  }
};

exports.getSkillGapReport = async (req, res, next) => {
  try {
    const report = await reportService.getSkillGapReport(req.user.id); // Pass authenticated user's ID
    res.json(report);
  } catch (err) {
    next(new CustomError('Failed to retrieve skill gap report', 500, err.message));
  }
};

exports.getTimeBasedReport = async (req, res, next) => {
  try {
    const { timeframe } = req.query;
    const report = await reportService.getTimeBasedReport(timeframe);
    res.json(report);
  } catch (err) {
    next(new CustomError('Failed to retrieve time-based report', 500, err.message)); 
  }
};
