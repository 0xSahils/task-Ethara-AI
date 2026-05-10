import { Router } from 'express';
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { getTasks, createTask, getTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { getMembers, addMember, updateMemberRole, removeMember } from '../controllers/memberController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireProjectMember, requireProjectAdmin } from '../middleware/checkProjectRole.js';
import { validate } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../validators/projectValidator.js';
import { createTaskSchema, updateTaskSchema, addMemberSchema, updateMemberRoleSchema } from '../validators/taskValidator.js';

const router = Router();

// All project routes require authentication
router.use(authenticate);

// Project CRUD
router.get('/', getProjects);
router.post('/', validate(createProjectSchema), createProject);
router.get('/:projectId', requireProjectMember, getProject);
router.put('/:projectId', requireProjectAdmin, validate(updateProjectSchema), updateProject);
router.delete('/:projectId', requireProjectAdmin, deleteProject);

// Task routes (nested under /:projectId)
router.get('/:projectId/tasks', requireProjectMember, getTasks);
router.post('/:projectId/tasks', requireProjectAdmin, validate(createTaskSchema), createTask);
router.get('/:projectId/tasks/:taskId', requireProjectMember, getTask);
router.put('/:projectId/tasks/:taskId', requireProjectMember, validate(updateTaskSchema), updateTask);
router.delete('/:projectId/tasks/:taskId', requireProjectAdmin, deleteTask);

// Member routes (nested under /:projectId)
router.get('/:projectId/members', requireProjectMember, getMembers);
router.post('/:projectId/members', requireProjectAdmin, validate(addMemberSchema), addMember);
router.put('/:projectId/members/:memberId', requireProjectAdmin, validate(updateMemberRoleSchema), updateMemberRole);
router.delete('/:projectId/members/:memberId', requireProjectAdmin, removeMember);

export default router;
