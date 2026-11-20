import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/clients (Public: list active clients, optional division filter)
router.get('/', async (req, res) => {
  try {
    const { division } = req.query;
    const list = await db.getClients(division);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve clients' });
  }
});

// POST /api/clients (Admin Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Client name is required' });
    }
    const created = await db.createClient(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create client entry' });
  }
});

// PUT /api/clients/:id (Admin Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateClient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Client not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE /api/clients/:id (Admin Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteClient(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router;
