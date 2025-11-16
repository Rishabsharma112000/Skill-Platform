const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000"; // Fallback for development if .env is not configured.
// IMPORTANT: Please create a .env file in the portal_frontend_app directory with:
// REACT_APP_FRONTEND_URL=http://localhost:4000
// (or your actual backend URL)

const API_ROUTES = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
  },
  USERS: {
    GET_ALL: `${API_BASE_URL}/api/users`,
    GET_ME: `${API_BASE_URL}/api/users/me`,
    UPDATE_ME: `${API_BASE_URL}/api/users/me`,
    CHANGE_MY_PASSWORD: `${API_BASE_URL}/api/users/me/password`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
    UPDATE_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
    DELETE_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
  },
  SKILLS: {
    CREATE: `${API_BASE_URL}/api/skills`,
    GET_ALL: `${API_BASE_URL}/api/skills`,
    GET_WITH_QUESTIONS: `${API_BASE_URL}/api/skills-with-questions`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/skills/${id}`,
    UPDATE_BY_ID: (id) => `${API_BASE_URL}/api/skills/${id}`,
    DELETE_BY_ID: (id) => `${API_BASE_URL}/api/skills/${id}`,
  },
  QUESTIONS: {
    CREATE: `${API_BASE_URL}/api/questions`,
    GET_ALL: `${API_BASE_URL}/api/questions`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/questions/${id}`,
    UPDATE_BY_ID: (id) => `${API_BASE_URL}/api/questions/${id}`,
    DELETE_BY_ID: (id) => `${API_BASE_URL}/api/questions/${id}`,
  },
  QUIZZES: {
    START: (skillId) => `${API_BASE_URL}/api/skills/${skillId}/quiz`,
    SUBMIT_ATTEMPT: `${API_BASE_URL}/api/quizzes/attempt`,
    GET_HISTORY: `${API_BASE_URL}/api/quizzes/history`,
  },
  REPORTS: {
    GET_USER_PERFORMANCE: (userId) => `${API_BASE_URL}/api/reports/users/${userId}/performance`,
    GET_MY_PERFORMANCE: `${API_BASE_URL}/api/reports/me/performance`,
    GET_SKILL_GAP: `${API_BASE_URL}/api/reports/skill-gap`,
    GET_TIME_BASED: `${API_BASE_URL}/api/reports/time-based`,
  },
};

export default API_ROUTES;
