const Skill = require('../db/models/skill.model');
const { CustomError } = require('../middleware/error.middleware');

const skillService = {
  createSkill: async ({ name, description }) => {
    const existing = await Skill.findByName(name);
    if (existing) {
      throw new CustomError('Skill with this name already exists', 400);
    }
    const skill = await Skill.create({ name, description });
    return skill;
  },

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

  updateSkill: async (id, { name, description }) => {
    const updated = await Skill.update(id, { name, description });
    if (!updated) {
      throw new CustomError('Skill not found or no changes made', 404);
    }
    const skill = await Skill.findById(id);
    return skill;
  },

  deleteSkill: async (id) => {
    const deleted = await Skill.delete(id);
    if (!deleted) {
      throw new CustomError('Skill not found', 404);
    }
    return { success: true, message: 'Skill deleted successfully' };
  },
};

module.exports = skillService;
