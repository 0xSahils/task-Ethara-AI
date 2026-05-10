import bcrypt from 'bcryptjs';
import prisma from '../prisma/client.js';
import { generateToken, setTokenCookie } from '../utils/generateToken.js';
import asyncWrapper from '../utils/asyncWrapper.js';

// POST /api/auth/register
export const register = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already in use' });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const token = generateToken(user.id);
  setTokenCookie(res, token);

  res.status(201).json({ success: true, message: 'Account created', data: { user, token } });
});

// POST /api/auth/login
export const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = generateToken(user.id);
  setTokenCookie(res, token);

  const { password: _, ...safeUser } = user;
  res.json({ success: true, message: 'Login successful', data: { user: safeUser, token } });
});

// GET /api/auth/me
export const getMe = asyncWrapper(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

// POST /api/auth/logout
export const logout = asyncWrapper(async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});
