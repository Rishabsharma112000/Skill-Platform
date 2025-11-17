const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth.controller');
const skillsCtrl = require('../controllers/skills.controller');
const questionsCtrl = require('../controllers/question.controller');
const quizzesCtrl = require('../controllers/quizzes.controller');
const usersCtrl = require('../controllers/users.controller');
const reportCtrl = require('../controllers/report.controller');

const auth = require('../middleware/auth.middleware');
const permit = require('../middleware/rbac.middleware');


// AUTH
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);


// USERS (ADMIN + SELF)

// Admin: list users
router.get('/users', auth, permit('admin'), usersCtrl.getUsers);

// Logged-in user profile
router.get('/users/me', auth, usersCtrl.getMyProfile);

// Logged-in user update profile
router.put('/users/me', auth, usersCtrl.updateMyProfile);

// Logged-in user change password
router.put('/users/me/password', auth, usersCtrl.changeMyPassword);

// Admin: get single user
router.get('/users/:id', auth, permit('admin'), usersCtrl.getUserById);

// Admin: update user
router.put('/users/:id', auth, permit('admin'), usersCtrl.updateUserById);

// Admin: delete user
router.delete('/users/:id', auth, permit('admin'), usersCtrl.deleteUserById);

// SKILLS

router.post('/skills', auth, permit('admin'), skillsCtrl.createSkill);
router.get('/skills', auth, skillsCtrl.getSkills);
router.get('/skills/:id', auth, skillsCtrl.getSkill);
router.put('/skills/:id', auth, permit('admin'), skillsCtrl.updateSkill);
router.delete('/skills/:id', auth, permit('admin'), skillsCtrl.deleteSkill);


// QUESTIONS

router.post('/questions', auth, permit('admin'), questionsCtrl.createQuestion);
router.get('/questions', auth, questionsCtrl.getQuestions);
router.get('/questions/:id', auth, questionsCtrl.getQuestion);
router.put('/questions/:id', auth, permit('admin'), questionsCtrl.updateQuestion);
router.delete('/questions/:id', auth, permit('admin'), questionsCtrl.deleteQuestion);

router.get('/skills-with-questions', auth, skillsCtrl.getSkillsWithQuestions);


// QUIZZES

router.get('/skills/:id/quiz', auth, quizzesCtrl.getQuizQuestions);
router.post('/quizzes/attempt', auth, quizzesCtrl.submitAttempt);


// REPORTS

// Admin: 
router.get('/reports/users/performance', auth, permit('admin'), reportCtrl.getAllUsersPerformanceReport);
// User: 
router.get('/reports/me/performance', auth, reportCtrl.getUserPerformanceReport);

// Admin: 
router.get('/reports/skill-gap', auth, permit('admin'), reportCtrl.getSkillGapReport);

// Admin: 
router.get('/reports/time-based', auth, permit('admin'), reportCtrl.getTimeBasedReport);

module.exports = router;
