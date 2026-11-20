import express from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects (Public)
// Supports division=STUDIO | PRODUCTION, category, featured, status (defaults to published)
router.get('/', async (req, res) => {
  try {
    const { division, category, featured, status } = req.query;
    // Public visitors must only see published projects unless an explicit status query is provided
    const list = await db.getProjects({
      division,
      category,
      featured,
      status: status || 'published'
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

// GET /api/projects/all (Admin)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const { division, category } = req.query;
    const list = await db.getProjects({ division, category });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve all projects' });
  }
});

// GET /api/projects/:idOrSlug (Public)
router.get('/:idOrSlug', async (req, res) => {
  try {
    const project = await db.getProjectById(req.params.idOrSlug);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
});

// POST /api/projects (Admin Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: 'Project title is required' });
    }
    const created = await db.createProject(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error('Project creation error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id (Admin Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await db.updateProject(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id (Admin Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
