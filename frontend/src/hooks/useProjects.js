import { useState, useEffect, useCallback } from 'react';
import { projectsService } from '../services/projects.js';
import toast from 'react-hot-toast';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await projectsService.getAll();
      setProjects(res.data.projects);
    } catch (err) {
      toast.error(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (data) => {
    const res = await projectsService.create(data);
    setProjects((prev) => [res.data.project, ...prev]);
    return res.data.project;
  };

  const deleteProject = async (id) => {
    await projectsService.delete(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return { projects, loading, fetchProjects, createProject, deleteProject };
}
