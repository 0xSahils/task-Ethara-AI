import prisma from '../prisma/client.js';
import asyncWrapper from '../utils/asyncWrapper.js';

// GET /api/projects/:projectId/members
export const getMembers = asyncWrapper(async (req, res) => {
  const { projectId } = req.params;

  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: { user: { select: { id: true, name: true, email: true, createdAt: true } } },
    orderBy: { joinedAt: 'asc' },
  });

  res.json({ success: true, data: { members } });
});

// POST /api/projects/:projectId/members
export const addMember = asyncWrapper(async (req, res) => {
  const { projectId } = req.params;
  const { email, role } = req.body;

  const userToAdd = await prisma.user.findUnique({ where: { email } });
  if (!userToAdd) {
    return res.status(404).json({ success: false, message: 'No user found with that email' });
  }

  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: userToAdd.id } },
  });
  if (existing) {
    return res.status(409).json({ success: false, message: 'User is already a project member' });
  }

  const member = await prisma.projectMember.create({
    data: { projectId, userId: userToAdd.id, role: role || 'MEMBER' },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  res.status(201).json({ success: true, message: 'Member added', data: { member } });
});

// PUT /api/projects/:projectId/members/:memberId
export const updateMemberRole = asyncWrapper(async (req, res) => {
  const { memberId } = req.params;
  const { role } = req.body;

  const member = await prisma.projectMember.update({
    where: { id: memberId },
    data: { role },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  res.json({ success: true, message: 'Role updated', data: { member } });
});

// DELETE /api/projects/:projectId/members/:memberId
export const removeMember = asyncWrapper(async (req, res) => {
  const { memberId, projectId } = req.params;

  // Prevent removing the last admin
  const memberToRemove = await prisma.projectMember.findUnique({ where: { id: memberId } });
  if (memberToRemove?.role === 'ADMIN') {
    const adminCount = await prisma.projectMember.count({
      where: { projectId, role: 'ADMIN' },
    });
    if (adminCount <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot remove the last admin' });
    }
  }

  await prisma.projectMember.delete({ where: { id: memberId } });
  res.json({ success: true, message: 'Member removed' });
});
