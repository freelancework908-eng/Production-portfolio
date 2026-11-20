import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/banners (Public: optional division)
router.get('/', async (req, res) => {
  try {
    const { division } = req.query;
    const list = await db.getBanners(division);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve banners' });
  }
});

// POST /api/banners (Admin Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: 'Banner title is required' });
    }
    const created = await db.createBanner(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

// PUT /api/banners/:id (Admin Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateBanner(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Banner not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// DELETE /api/banners/:id (Admin Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteBanner(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Banner not found' });
    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

export default router;
