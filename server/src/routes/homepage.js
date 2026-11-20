import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/homepage (Public)
router.get('/', async (req, res) => {
  try {
    const data = await db.getHomepage();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve homepage settings' });
  }
});

// PUT /api/homepage (Admin Protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateHomepage(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update homepage settings' });
  }
});

export default router;
