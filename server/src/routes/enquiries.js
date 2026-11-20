import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /api/enquiries (Public Contact Form Submission)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, division, service_interest, project_type, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const created = await db.createEnquiry({
      name,
      email,
      phone,
      division: division || 'GENERAL',
      service_interest: service_interest || project_type || 'General Collaboration',
      message
    });

    res.status(201).json({ 
      message: 'Enquiry submitted successfully. Our division leads will review and respond shortly.',
      enquiry: { id: created.id, name: created.name, division: created.division, created_at: created.created_at }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

// GET /api/enquiries (Admin Protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { division } = req.query;
    const list = await db.getEnquiries({ division });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve enquiries' });
  }
});

// PATCH /api/enquiries/:id/read (Admin Protected)
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const isRead = req.body.is_read !== undefined ? Boolean(req.body.is_read) : true;
    const updated = await db.markEnquiryRead(req.params.id, isRead);
    if (!updated) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

// DELETE /api/enquiries/:id (Admin Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteEnquiry(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;
