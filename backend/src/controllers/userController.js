import prisma from '../prisma/client.js';
import asyncWrapper from '../utils/asyncWrapper.js';

// GET /api/users/search?q=email
export const searchUsers = asyncWrapper(async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.json({ success: true, data: { users: [] } });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: q, mode: 'insensitive' } },
        { name:  { contains: q, mode: 'insensitive' } },
      ],
      // Exclude the searching user themselves
      NOT: { id: req.user.id },
    },
    select: { id: true, name: true, email: true },
    take: 6,
  });

  res.json({ success: true, data: { users } });
});
