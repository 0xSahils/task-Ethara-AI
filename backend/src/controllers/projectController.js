import prisma from '../prisma/client.js';
import asyncWrapper from '../utils/asyncWrapper.js';

const projectSelect = {
  id: true,
  title: true,
  description: true,
  color: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  createdBy: { select: { id: true, name: true, email: true } },
  _count: { select: { tasks: true, members: true } },
};

// GET /api/projects
export const getProjects = asyncWrapper(async (req, res) => {
  const userId = req.user.id;

  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    include: {
      project: {
        select: {
          ...projectSelect,
          members: { include: { user: { select: { id: true, name: true, email: true } } } },
        },
      },
    },
    orderBy: { project: { updatedAt: 'desc' } },
  });

  const projects = memberships.map((m) => ({
    ...m.project,
    myRole: m.role,
  }));

  res.json({ success: true, data: { projects } });
});

// POST /api/projects
export const createProject = asyncWrapper(async (req, res) => {
  const { title, description, color } = req.body;
  const userId = req.user.id;

  const project = await prisma.project.create({
    data: {
      title,
      description,
      color: color || '#0F3460',
      createdById: userId,
      members: { create: { userId, role: 'ADMIN' } },
    },
    select: projectSelect,
  });

  res.status(201).json({ success: true, message: 'Project created', data: { project } });
});

// GET /api/projects/:projectId
export const getProject = asyncWrapper(async (req, res) => {
  const { projectId } = req.params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      _count: { select: { tasks: true } },
    },
  });

  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  const myRole = project.members.find((m) => m.userId === req.user.id)?.role || null;

  res.json({ success: true, data: { project: { ...project, myRole } } });
});

// PUT /api/projects/:projectId
export const updateProject = asyncWrapper(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, color, status } = req.body;

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { title, description, color, status },
    select: projectSelect,
  });

  res.json({ success: true, message: 'Project updated', data: { project } });
});

// DELETE /api/projects/:projectId
export const deleteProject = asyncWrapper(async (req, res) => {
  const { projectId } = req.params;
  await prisma.project.delete({ where: { id: projectId } });
  res.json({ success: true, message: 'Project deleted' });
});
