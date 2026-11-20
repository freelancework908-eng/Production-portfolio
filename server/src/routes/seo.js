import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/seo (Public)
router.get('/', async (req, res) => {
  try {
    const data = await db.getSEO();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve SEO configurations' });
  }
});

// PUT /api/seo (Admin Protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateSEO(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update SEO configurations' });
  }
});

export default router;
