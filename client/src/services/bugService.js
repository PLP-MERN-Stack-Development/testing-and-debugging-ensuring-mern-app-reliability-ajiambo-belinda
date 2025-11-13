import api from './api';

export const bugService = {
  // Get all bugs
  getBugs: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/bugs?${params}`);
    return response.data;
  },

  // Get bug by ID
  getBug: async (id) => {
    const response = await api.get(`/bugs/${id}`);
    return response.data;
  },

  // Create new bug
  createBug: async (bugData) => {
    const response = await api.post('/bugs', bugData);
    return response.data;
  },

  // Update bug
  updateBug: async (id, bugData) => {
    const response = await api.put(`/bugs/${id}`, bugData);
    return response.data;
  },

  // Delete bug
  deleteBug: async (id) => {
    const response = await api.delete(`/bugs/${id}`);
    return response.data;
  },

  // Update bug status
  updateBugStatus: async (id, status) => {
    const response = await api.patch(`/bugs/${id}/status`, { status });
    return response.data;
  },

  // Get bugs by project
  getBugsByProject: async (projectId) => {
    const response = await api.get(`/bugs/project/${projectId}`);
    return response.data;
  },
};