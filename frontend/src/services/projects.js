import api from './api.js';

export const projectsService = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  getOne: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),

  // Members
  getMembers: (id) => api.get(`/projects/${id}/members`),
  addMember: (id, data) => api.post(`/projects/${id}/members`, data),
  updateMemberRole: (id, memberId, data) => api.put(`/projects/${id}/members/${memberId}`, data),
  removeMember: (id, memberId) => api.delete(`/projects/${id}/members/${memberId}`),
};
