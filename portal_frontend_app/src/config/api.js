
const API_BASE_URL = "https://skill-platform-production-808e.up.railway.app"

const API_ROUTES = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
  },
  USERS: {
    GET_ALL: `${API_BASE_URL}/api/users`,
  },
  SKILLS: {
    GET_ALL: `${API_BASE_URL}/api/skills`,
    GET_WITH_QUESTIONS: `${API_BASE_URL}/api/skills-with-questions`,
  },
  QUESTIONS: {
    CREATE: `${API_BASE_URL}/api/questions`,
    GET_ALL: `${API_BASE_URL}/api/questions`,
    UPDATE_BY_ID: (id) => `${API_BASE_URL}/api/questions/${id}`,
    DELETE_BY_ID: (id) => `${API_BASE_URL}/api/questions/${id}`,
  },
  QUIZZES: {
    START: (skillId) => `${API_BASE_URL}/api/skills/${skillId}/quiz`,
    SUBMIT_ATTEMPT: `${API_BASE_URL}/api/quizzes/attempt`,
  },
  REPORTS: {
    GET_MY_PERFORMANCE: `${API_BASE_URL}/api/reports/me/performance`,
    GET_ALL_USER_PERFORMANCE: `${API_BASE_URL}/api/reports/users/performance`,
  },
};

export default API_ROUTES;
