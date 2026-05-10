import { useState, useEffect, useCallback } from 'react';
import { tasksService } from '../services/tasks.js';
import toast from 'react-hot-toast';

export function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await tasksService.getAll(projectId);
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data) => {
    const res = await tasksService.create(projectId, data);
    setTasks((prev) => [res.data.task, ...prev]);
    return res.data.task;
  };

  const updateTask = async (taskId, data) => {
    const res = await tasksService.update(projectId, taskId, data);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data.task : t)));
    return res.data.task;
  };

  const deleteTask = async (taskId) => {
    await tasksService.delete(projectId, taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return { tasks, setTasks, loading, fetchTasks, createTask, updateTask, deleteTask };
}
