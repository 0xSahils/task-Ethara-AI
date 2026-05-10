import api from './api.js';

export const tasksService = {
  getAll: (projectId, params) => api.get(`/projects/${projectId}/tasks`, { params }),
  create: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  getOne: (projectId, taskId) => api.get(`/projects/${projectId}/tasks/${taskId}`),
  update: (projectId, taskId, data) => api.put(`/projects/${projectId}/tasks/${taskId}`, data),
  delete: (projectId, taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRecent: () => api.get('/dashboard/recent'),
};
