import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/awards (Public)
router.get('/', async (req, res) => {
  try {
    const list = await db.getAwards();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve awards' });
  }
});

// POST /api/awards (Admin Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.title || !req.body.organization) {
      return res.status(400).json({ error: 'Title and organization are required' });
    }
    const created = await db.createAward(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create award record' });
  }
});

// PUT /api/awards/:id (Admin Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateAward(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Award record not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update award record' });
  }
});

// DELETE /api/awards/:id (Admin Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteAward(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Award record not found' });
    res.json({ message: 'Award record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete award record' });
  }
});

export default router;
