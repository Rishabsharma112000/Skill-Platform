const Skill = require('../db/models/skill.model');
const { CustomError } = require('../middleware/error.middleware');

const skillService = {

  getSkills: async ({ page, limit, q }) => {
    const result = await Skill.findAll({ page, limit, q });
    return result;
  },

  getSkillsWithQuestions: async ({ page, limit, q }) => {
    const result = await Skill.findAllWithQuestions({ page, limit, q });
    return result;
  },

  getSkill: async (id) => {
    const skill = await Skill.findById(id);
    if (!skill) {
      throw new CustomError('Skill not found', 404);
    }
    return skill;
  },

};

module.exports = skillService;
