import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/gallery (Public)
router.get('/', async (req, res) => {
  try {
    const { category, all } = req.query;
    const onlyPublished = all !== 'true';
    const list = await db.getGallery({ category, onlyPublished });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve gallery photos' });
  }
});

// POST /api/gallery (Admin Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.image_url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
    const created = await db.createGalleryItem(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

// PUT /api/gallery/:id (Admin Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateGalleryItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Gallery item not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

// DELETE /api/gallery/:id (Admin Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteGalleryItem(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

export default router;
