import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const customError = {
            message:
                error.response?.data?.message ||
                error.message ||
                "An unexpected network error occurred.",
            status: error.response?.status || 500,
            original: error
        };
        return Promise.reject(customError);
    }
);

export const api = {
    // Health Check
    getHealth: async () => {
        const response = await apiClient.get("/health");
        return response.data;
    },

    // Analytics Endpoints (MongoDB Aggregations)
    getSummary: async () => {
        const response = await apiClient.get("/analytics/summary");
        return response.data.data;
    },

    getSubjects: async () => {
        const response = await apiClient.get("/analytics/subjects");
        return response.data.data;
    },

    getToppers: async () => {
        const response = await apiClient.get("/analytics/toppers");
        return response.data.data;
    },

    getResults: async () => {
        const response = await apiClient.get("/analytics/results");
        return response.data.data;
    },

    getPerformance: async () => {
        const response = await apiClient.get("/analytics/performance");
        return response.data.data;
    },

    getAttendance: async () => {
        const response = await apiClient.get("/analytics/attendance");
        return response.data.data;
    },

    // Student CRUD Endpoints
    getStudents: async ({ page = 1, limit = 10, search = "" } = {}) => {
        const params = { page, limit };
        if (search && search.trim()) {
            params.search = search.trim();
        }
        const response = await apiClient.get("/students", { params });
        return response.data;
    },

    getStudentById: async (id) => {
        const response = await apiClient.get(`/students/${id}`);
        return response.data.student;
    },

    createStudent: async (studentData) => {
        const response = await apiClient.post("/students", studentData);
        return response.data;
    },

    updateStudent: async (id, studentData) => {
        const response = await apiClient.put(`/students/${id}`, studentData);
        return response.data;
    },

    deleteStudent: async (id) => {
        const response = await apiClient.delete(`/students/${id}`);
        return response.data;
    }
};

export default api;
