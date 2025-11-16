const skillService = require('../services/skills.service');
const { CustomError } = require('../middleware/error.middleware');

exports.createSkill = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const skill = await skillService.createSkill({ name, description });
    res.status(201).json(skill);
  } catch (err) {
    next(err); 
  }
};

exports.getSkills = async (req, res, next) => {
  try {
    const { page, limit, q } = req.query;
    const result = await skillService.getSkills({ page, limit, q });
    res.json(result);
  } catch (err) {
    next(new CustomError('Failed to retrieve skills', 500, err.message));
  }
};

exports.getSkillsWithQuestions = async (req, res, next) => {
  try {
    const { page, limit, q } = req.query;
    const result = await skillService.getSkillsWithQuestions({ page, limit, q });
    res.json(result);
  } catch (err) {
    next(new CustomError('Failed to retrieve skills with questions', 500, err.message));
  }
};

exports.getSkill = async (req, res, next) => {
  try {
    const skill = await skillService.getSkill(req.params.id);
    res.json(skill);
  } catch (err) {
    next(err); 
  }
};

exports.updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const skill = await skillService.updateSkill(id, { name, description });
    res.json(skill);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return next(new CustomError('Skill name already in use', 400));
    }
    next(err); 
  }
};

exports.deleteSkill = async (req, res, next) => {
  try {
    const result = await skillService.deleteSkill(req.params.id);
    res.json(result);
  } catch (err) {
    next(err); 
  }
};
