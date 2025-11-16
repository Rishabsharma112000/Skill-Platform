const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
  },
  USERS: {
    GET_ALL: '/api/users',
    GET_ME: '/api/users/me',
    UPDATE_ME: '/api/users/me',
    CHANGE_MY_PASSWORD: '/api/users/me/password',
    GET_BY_ID: (id) => `/api/users/${id}`,
    UPDATE_BY_ID: (id) => `/api/users/${id}`,
    DELETE_BY_ID: (id) => `/api/users/${id}`,
  },
  SKILLS: {
    CREATE: '/api/skills',
    GET_ALL: '/api/skills',
    GET_WITH_QUESTIONS: '/api/skills-with-questions',
    GET_BY_ID: (id) => `/api/skills/${id}`,
    UPDATE_BY_ID: (id) => `/api/skills/${id}`,
    DELETE_BY_ID: (id) => `/api/skills/${id}`,
  },
  QUESTIONS: {
    CREATE: '/api/questions',
    GET_ALL: '/api/questions',
    GET_BY_ID: (id) => `/api/questions/${id}`,
    UPDATE_BY_ID: (id) => `/api/questions/${id}`,
    DELETE_BY_ID: (id) => `/api/questions/${id}`,
  },
  QUIZZES: {
    START: (skillId) => `/api/skills/${skillId}/quiz`,
    SUBMIT_ATTEMPT: '/api/quizzes/attempt',
    GET_HISTORY: '/api/quizzes/history',
  },
  REPORTS: {
    GET_USER_PERFORMANCE: (userId) => `/api/reports/users/${userId}/performance`,
    GET_MY_PERFORMANCE: '/api/reports/me/performance',
    GET_SKILL_GAP: '/api/reports/skill-gap',
    GET_TIME_BASED: '/api/reports/time-based',
  },
};

export default API_ROUTES;
