import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// B2 Configuration Helper
export function getB2Config() {
  return {
    keyId: process.env.B2_KEY_ID || process.env.B2_APPLICATION_KEY_ID,
    appKey: process.env.B2_APPLICATION_KEY,
    bucketName: process.env.B2_BUCKET_NAME,
    endpoint: process.env.B2_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com',
    region: process.env.B2_REGION || 'us-east-005',
    publicUrl: process.env.B2_PUBLIC_URL // Optional Cloudflare CDN / custom domain
  };
}

let s3Client = null;

export function isB2Configured() {
  const config = getB2Config();
  return Boolean(config.keyId && config.appKey && config.bucketName);
}

export function getS3Client() {
  if (s3Client) return s3Client;

  if (!isB2Configured()) {
    return null;
  }

  const config = getB2Config();
  const endpointUrl = config.endpoint.startsWith('http') ? config.endpoint : `https://${config.endpoint}`;

  s3Client = new S3Client({
    region: config.region,
    endpoint: endpointUrl,
    credentials: {
      accessKeyId: config.keyId,
      secretAccessKey: config.appKey
    },
    forcePathStyle: true // Needed for Backblaze B2 S3 API compatibility
  });

  console.log(`[Cloudflare B2] S3 Client initialized for bucket "${config.bucketName}" at ${endpointUrl}`);
  return s3Client;
}

// Allowed MIME types
const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/aac',
  'audio/ogg',
  // Documents
  'application/pdf'
]);

// Maximum file size limits
const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_VIDEO_SIZE = 250 * 1024 * 1024; // 250 MB

export function validateMediaFile(file) {
  if (!file) {
    throw new Error('No media file provided');
  }

  const mimeType = file.mimetype || file.mime_type;
  if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
    throw new Error(`Unsupported media type: "${mimeType}". Allowed types: JPEG, PNG, WebP, GIF, SVG, AVIF, MP4, WebM, QuickTime, PDF.`);
  }

  const size = file.size || (file.buffer ? file.buffer.length : 0);
  const isVideo = mimeType.startsWith('video/');
  const maxLimit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (size > maxLimit) {
    const limitMb = maxLimit / (1024 * 1024);
    throw new Error(`File size (${(size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed limit of ${limitMb} MB.`);
  }

  return true;
}

export function generateObjectKey(originalName, category = 'general', division = 'studio') {
  const ext = path.extname(originalName || '').toLowerCase() || '.bin';
  const base = path.basename(originalName || 'asset', ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .substring(0, 50);

  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 7);

  const cleanDivision = (division || 'general').toLowerCase();
  const cleanCategory = (category || 'media').toLowerCase().replace(/[^a-z0-9_-]/g, '-');

  return `${cleanDivision}/${cleanCategory}/${timestamp}-${randomSuffix}-${base}${ext}`;
}

/**
 * Uploads a file buffer or stream to Cloudflare B2 (or local fallback in dev)
 */
export async function uploadToStorage({ buffer, originalname, mimetype, size, category = 'media', division = 'studio' }) {
  validateMediaFile({ mimetype, size: size || buffer.length });

  const objectKey = generateObjectKey(originalname, category, division);
  const client = getS3Client();

  let fileType = 'image';
  if (mimetype.startsWith('video/')) fileType = 'video';
  else if (mimetype.startsWith('audio/')) fileType = 'audio';
  else if (mimetype === 'application/pdf') fileType = 'document';

  const formattedSize = (size || buffer.length) > 1024 * 1024
    ? `${((size || buffer.length) / (1024 * 1024)).toFixed(1)} MB`
    : `${((size || buffer.length) / 1024).toFixed(1)} KB`;

  // 1. Genuine Cloudflare B2 Storage
  if (client && isB2Configured()) {
    const config = getB2Config();
    try {
      console.log(`[Cloudflare B2] Uploading "${objectKey}" (${formattedSize}) to bucket "${config.bucketName}"...`);

      const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: objectKey,
        Body: buffer,
        ContentType: mimetype,
        Metadata: {
          'original-name': encodeURIComponent(originalname),
          'division': division,
          'category': category
        }
      });

      await client.send(command);

      // Construct public or direct B2 retrieval URL
      let fileUrl = '';
      if (config.publicUrl) {
        fileUrl = `${config.publicUrl.replace(/\/$/, '')}/${objectKey}`;
      } else {
        const endpointClean = config.endpoint.startsWith('http') ? config.endpoint : `https://${config.endpoint}`;
        fileUrl = `${endpointClean}/${config.bucketName}/${objectKey}`;
      }

      console.log(`[Cloudflare B2] ✓ Upload complete: ${fileUrl}`);

      return {
        objectKey,
        fileUrl,
        fileName: originalname,
        fileType,
        mimeType: mimetype,
        fileSize: formattedSize,
        storageProvider: 'CLOUDFLARE_B2'
      };
    } catch (err) {
      console.error('[Cloudflare B2] Upload failed:', err);
      throw new Error(`Cloudflare B2 upload failed: ${err.message}`);
    }
  }

  // 2. Local Fallback when B2 credentials are not set in development
  console.log(`[Storage] B2 not configured in environment. Storing to local fallback uploads: ${objectKey}`);
  const localFileName = `${Date.now()}-${originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
  const localFilePath = path.join(uploadsDir, localFileName);
  fs.writeFileSync(localFilePath, buffer);

  const fileUrl = `/uploads/${localFileName}`;

  return {
    objectKey: `local/${localFileName}`,
    fileUrl,
    fileName: originalname,
    fileType,
    mimeType: mimetype,
    fileSize: formattedSize,
    storageProvider: 'LOCAL_DEV_FALLBACK'
  };
}

/**
 * Generates a presigned secure download URL for private B2 media
 */
export async function getSecureMediaUrl(objectKey, expiresIn = 3600) {
  if (!objectKey) return null;

  // If local fallback
  if (objectKey.startsWith('local/')) {
    const fileName = objectKey.replace('local/', '');
    return `/uploads/${fileName}`;
  }

  const client = getS3Client();
  if (client && isB2Configured()) {
    const config = getB2Config();
    try {
      const command = new GetObjectCommand({
        Bucket: config.bucketName,
        Key: objectKey
      });
      return await getSignedUrl(client, command, { expiresIn });
    } catch (err) {
      console.error('[Cloudflare B2] Presigned URL generation failed:', err);
      return null;
    }
  }

  return null;
}

/**
 * Deletes an object from Cloudflare B2
 */
export async function deleteFromStorage(objectKey) {
  if (!objectKey) return false;

  // Local file cleanup
  if (objectKey.startsWith('local/')) {
    const fileName = objectKey.replace('local/', '');
    const localFilePath = path.join(uploadsDir, fileName);
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (e) {
        console.warn('Failed to delete local fallback file', e);
      }
    }
    return true;
  }

  const client = getS3Client();
  if (client && isB2Configured()) {
    const config = getB2Config();
    try {
      console.log(`[Cloudflare B2] Deleting object "${objectKey}" from bucket "${config.bucketName}"...`);
      const command = new DeleteObjectCommand({
        Bucket: config.bucketName,
        Key: objectKey
      });
      await client.send(command);
      return true;
    } catch (err) {
      console.error('[Cloudflare B2] Deletion failed:', err);
      return false;
    }
  }

  return false;
}

/**
 * Streams media from B2 with HTTP Range request support (for video playback)
 */
export async function streamMediaFromB2(objectKey, range) {
  const client = getS3Client();
  if (!client || !isB2Configured()) {
    return null;
  }

  const config = getB2Config();
  const params = {
    Bucket: config.bucketName,
    Key: objectKey
  };

  if (range) {
    params.Range = range;
  }

  const command = new GetObjectCommand(params);
  return await client.send(command);
}
