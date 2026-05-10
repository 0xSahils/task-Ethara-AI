import prisma from '../prisma/client.js';
import asyncWrapper from '../utils/asyncWrapper.js';

// GET /api/dashboard/stats
export const getStats = asyncWrapper(async (req, res) => {
  const userId = req.user.id;

  // Get all project IDs where user is a member
  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    select: { projectId: true },
  });
  const projectIds = memberships.map((m) => m.projectId);

  const now = new Date();

  const [totalTasks, inProgress, completed, overdue] = await Promise.all([
    prisma.task.count({ where: { projectId: { in: projectIds } } }),
    prisma.task.count({ where: { projectId: { in: projectIds }, status: 'IN_PROGRESS' } }),
    prisma.task.count({ where: { projectId: { in: projectIds }, status: 'DONE' } }),
    prisma.task.count({
      where: {
        projectId: { in: projectIds },
        dueDate: { lt: now },
        status: { not: 'DONE' },
      },
    }),
  ]);

  // Tasks completed per day (last 7 days) for bar chart
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const recentCompletions = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
      status: 'DONE',
      updatedAt: { gte: sevenDaysAgo },
    },
    select: { updatedAt: true },
  });

  // Group by day
  const dailyMap = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = 0;
  }
  recentCompletions.forEach((t) => {
    const key = t.updatedAt.toISOString().slice(0, 10);
    if (dailyMap[key] !== undefined) dailyMap[key]++;
  });

  const dailyCompletions = Object.entries(dailyMap)
    .map(([date, count]) => ({ date, count }))
    .reverse();

  res.json({
    success: true,
    data: { stats: { totalTasks, inProgress, completed, overdue }, dailyCompletions },
  });
});

// GET /api/dashboard/recent
export const getRecent = asyncWrapper(async (req, res) => {
  const userId = req.user.id;

  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    select: { projectId: true },
  });
  const projectIds = memberships.map((m) => m.projectId);

  const tasks = await prisma.task.findMany({
    where: { projectId: { in: projectIds } },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, title: true, color: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  res.json({ success: true, data: { recent: tasks } });
});
