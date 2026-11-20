import express from 'express';
import multer from 'multer';
import path from 'path';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  uploadToStorage,
  getSecureMediaUrl,
  deleteFromStorage,
  streamMediaFromB2,
  isB2Configured,
  getB2Config,
  validateMediaFile
} from '../storage/b2.js';

const router = express.Router();

// Configure Multer with memory storage for direct Cloudflare B2 streaming
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 250 * 1024 * 1024 } // 250MB limit
});

// GET /api/media (Public or Admin)
router.get('/', async (req, res) => {
  try {
    const { type, division } = req.query;
    const list = await db.getMedia({ type, division });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve media library assets' });
  }
});

// GET /api/media/status (Admin) - Inspect B2 connectivity
router.get('/status', authMiddleware, (req, res) => {
  const config = getB2Config();
  res.json({
    b2Configured: isB2Configured(),
    bucket: config.bucketName || 'Not configured',
    endpoint: config.endpoint || 'https://s3.us-east-005.backblazeb2.com',
    region: config.region || 'us-east-005',
    prefix: process.env.B2_PREFIX || null,
    storageMode: isB2Configured() ? 'CLOUDFLARE_B2' : 'LOCAL_FALLBACK'
  });
});

// GET /api/media/signed-url (Admin or Public)
router.get('/signed-url', async (req, res) => {
  try {
    const { key, expiresIn } = req.query;
    if (!key) {
      return res.status(400).json({ error: 'Object key is required' });
    }
    const signedUrl = await getSecureMediaUrl(key, Number(expiresIn) || 3600);
    if (!signedUrl) {
      return res.status(404).json({ error: 'Media object not found or B2 not available' });
    }
    res.json({ key, signedUrl, expiresIn: Number(expiresIn) || 3600 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate signed URL' });
  }
});

// GET /api/media/stream/:key(*) - Stream video/audio with HTTP Range Support
router.get('/stream/*', async (req, res) => {
  const objectKey = req.params[0];
  const range = req.headers.range;

  try {
    const s3Response = await streamMediaFromB2(objectKey, range);

    if (!s3Response) {
      return res.status(404).send('Media stream not found');
    }

    // Set streaming headers
    if (s3Response.ContentRange) {
      res.status(206);
      res.set('Content-Range', s3Response.ContentRange);
      res.set('Accept-Ranges', 'bytes');
    } else {
      res.status(200);
    }

    if (s3Response.ContentType) res.set('Content-Type', s3Response.ContentType);
    if (s3Response.ContentLength) res.set('Content-Length', s3Response.ContentLength);

    s3Response.Body.pipe(res);
  } catch (err) {
    console.error('Streaming error:', err);
    res.status(500).send('Streaming error');
  }
});

// POST /api/media/upload (File upload to Cloudflare B2 / Storage)
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No media file provided for upload' });
    }

    const { originalname, buffer, mimetype, size } = req.file;
    const { title, division, category } = req.body;

    // Validate type & size
    validateMediaFile({ mimetype, size });

    // Upload to B2 (or local fallback)
    const uploadResult = await uploadToStorage({
      buffer,
      originalname,
      mimetype,
      size,
      category: category || 'media',
      division: division || 'general'
    });

    // Save metadata in database
    const created = await db.createMedia({
      title: title || originalname,
      file_name: originalname,
      object_key: uploadResult.objectKey,
      file_url: uploadResult.fileUrl,
      file_type: uploadResult.fileType,
      file_size: uploadResult.fileSize,
      mime_type: mimetype,
      division: (division || 'GENERAL').toUpperCase(),
      storage_provider: uploadResult.storageProvider
    });

    res.status(201).json(created);
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to process media upload' });
  }
});

// POST /api/media (Manual metadata entry e.g. CDN or YouTube/Vimeo embed)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, file_url, file_name, file_type, file_size, mime_type, division } = req.body;
    if (!file_url) {
      return res.status(400).json({ error: 'File URL is required' });
    }
    const created = await db.createMedia({
      title: title || file_name || 'Media Asset',
      file_name: file_name || path.basename(file_url),
      object_key: `external/${Date.now()}-${path.basename(file_url)}`,
      file_url,
      file_type: file_type || 'image',
      file_size: file_size || 'External Stream',
      mime_type: mime_type || 'application/octet-stream',
      division: (division || 'GENERAL').toUpperCase(),
      storage_provider: 'EXTERNAL'
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record external media entry' });
  }
});

// DELETE /api/media/:id (Admin Protected - Deletes from Storage & Database)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const media = await db.getMediaById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    // Delete from Cloudflare B2 / Storage
    if (media.object_key) {
      await deleteFromStorage(media.object_key);
    }

    await db.deleteMedia(req.params.id);
    res.json({ message: 'Media asset deleted successfully from storage and database' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete media asset' });
  }
});

export default router;
