import prisma from '../prisma/client.js';
import asyncWrapper from '../utils/asyncWrapper.js';

const taskInclude = {
  assignee: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true, email: true } },
};

// GET /api/projects/:projectId/tasks
export const getTasks = asyncWrapper(async (req, res) => {
  const { projectId } = req.params;
  const { status, priority, assigneeId } = req.query;

  const where = {
    projectId,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(assigneeId && { assigneeId }),
  };

  const tasks = await prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: { tasks } });
});

// POST /api/projects/:projectId/tasks
export const createTask = asyncWrapper(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, priority, dueDate, assigneeId } = req.body;
  const userId = req.user.id;

  // Validate assignee is a project member (if provided)
  if (assigneeId) {
    const memberCheck = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: assigneeId } },
    });
    if (!memberCheck) {
      return res.status(400).json({ success: false, message: 'Assignee is not a project member' });
    }
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      createdById: userId,
      assigneeId: assigneeId || null,
    },
    include: taskInclude,
  });

  res.status(201).json({ success: true, message: 'Task created', data: { task } });
});

// GET /api/projects/:projectId/tasks/:taskId
export const getTask = asyncWrapper(async (req, res) => {
  const { taskId } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: taskInclude,
  });

  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

  res.json({ success: true, data: { task } });
});

// PUT /api/projects/:projectId/tasks/:taskId
export const updateTask = asyncWrapper(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, priority, dueDate, assigneeId } = req.body;

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
    },
    include: taskInclude,
  });

  res.json({ success: true, message: 'Task updated', data: { task } });
});

// DELETE /api/projects/:projectId/tasks/:taskId
export const deleteTask = asyncWrapper(async (req, res) => {
  const { taskId } = req.params;
  await prisma.task.delete({ where: { id: taskId } });
  res.json({ success: true, message: 'Task deleted' });
});
