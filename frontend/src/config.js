// Backend API configuration
const API_BASE_URL = 'http://localhost:8000';

const API_ENDPOINTS = {
    // Auth endpoints
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    me: `${API_BASE_URL}/auth/me`,

    // AI endpoints
    generateWorkout: `${API_BASE_URL}/ai/generate-workout`,
    generateNutrition: `${API_BASE_URL}/ai/generate-nutrition`,
    chat: `${API_BASE_URL}/ai/chat`,

    // Health endpoints (NEW - ADD THESE TWO LINES)
    healthLog: `${API_BASE_URL}/ai/health/log`,
    healthHistory: `${API_BASE_URL}/ai/health/history`,

    // Test endpoint
    test: `${API_BASE_URL}/ai/test`
};

export default API_ENDPOINTS;