import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile (Public)
router.get('/', async (req, res) => {
  try {
    const profile = await db.getProfile();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile details' });
  }
});

// PUT /api/profile (Admin Protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateProfile(req.body);
    res.json({ message: 'Profile updated successfully', profile: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
