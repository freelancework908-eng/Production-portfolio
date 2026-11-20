import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/services (Public)
// Query params: division (STUDIO | PRODUCTION), category, onlyActive (default true for public)
router.get('/', async (req, res) => {
  try {
    const { division, category, all } = req.query;
    const onlyActive = all === 'true' ? false : true;
    const list = await db.getServices({ division, category, onlyActive });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
});

// GET /api/services/categories
router.get('/categories', async (req, res) => {
  try {
    const { division } = req.query;
    const categories = await db.getCategories(division);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve service categories' });
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await db.getServiceById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Service not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve service' });
  }
});

// POST /api/services (Admin Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Service name is required' });
    }
    const created = await db.createService(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// PUT /api/services/:id (Admin Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE /api/services/:id (Admin Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteService(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
