import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/professions (Public)
router.get('/', async (req, res) => {
  try {
    const onlyActive = req.query.all !== 'true';
    const list = await db.getProfessions(onlyActive);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve professions' });
  }
});

// GET /api/professions/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const prof = await db.getProfessionById(req.params.id);
    if (!prof) return res.status(404).json({ error: 'Profession not found' });
    res.json(prof);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profession' });
  }
});

// POST /api/professions (Admin Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: 'Profession title is required' });
    }
    const created = await db.createProfession(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create profession' });
  }
});

// PUT /api/professions/:id (Admin Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateProfession(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Profession not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profession' });
  }
});

// DELETE /api/professions/:id (Admin Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteProfession(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Profession not found' });
    res.json({ message: 'Profession deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete profession' });
  }
});

export default router;
