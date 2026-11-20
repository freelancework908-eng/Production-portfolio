import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/testimonials (Public: optional division, published filter)
router.get('/', async (req, res) => {
  try {
    const { division, all } = req.query;
    const onlyPublished = all !== 'true';
    const list = await db.getTestimonials({ division, onlyPublished });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve testimonials' });
  }
});

// POST /api/testimonials (Admin Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.client_name || !req.body.quote) {
      return res.status(400).json({ error: 'Client name and quote are required' });
    }
    const created = await db.createTestimonial(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// PUT /api/testimonials/:id (Admin Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateTestimonial(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// DELETE /api/testimonials/:id (Admin Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteTestimonial(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
