import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/navigation (Public: optional division)
router.get('/', async (req, res) => {
  try {
    const { division } = req.query;
    const list = await db.getNavigationItems(division);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve navigation items' });
  }
});

// POST /api/navigation (Admin Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.label || !req.body.url) {
      return res.status(400).json({ error: 'Label and URL are required' });
    }
    const created = await db.createNavigationItem(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create navigation item' });
  }
});

// PUT /api/navigation/:id (Admin Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateNavigationItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Navigation item not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update navigation item' });
  }
});

// DELETE /api/navigation/:id (Admin Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteNavigationItem(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Navigation item not found' });
    res.json({ message: 'Navigation item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete navigation item' });
  }
});

export default router;
