import prisma from '../prisma/client.js';

// Ensures user is a member of the project (any role)
export const requireProjectMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member) {
      return res.status(403).json({ success: false, message: 'Access denied: not a project member' });
    }

    req.projectMember = member;
    next();
  } catch (err) {
    next(err);
  }
};

// Ensures user has ADMIN role in the project
export const requireProjectAdmin = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member || member.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied: admin role required' });
    }

    req.projectMember = member;
    next();
  } catch (err) {
    next(err);
  }
};
