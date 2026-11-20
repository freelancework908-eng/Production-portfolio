import https from 'https';

const BASE_URL = 'https://production-portfolio-zdw1.vercel.app';
const FRONTEND_ORIGIN = 'https://production-portfolio-sigma.vercel.app';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = options.headers || {};
    
    // Default origin to test CORS
    if (!headers['Origin']) {
      headers['Origin'] = FRONTEND_ORIGIN;
    }

    const reqOptions = {
      method: options.method || 'GET',
      headers
    };

    const req = https.request(url, reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = body ? JSON.parse(body) : null;
        } catch (e) {
          parsed = body;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
          raw: body
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      if (Buffer.isBuffer(options.body)) {
        req.write(options.body);
      } else if (typeof options.body === 'string') {
        req.write(options.body);
      } else {
        req.write(JSON.stringify(options.body));
      }
    }

    req.end();
  });
}

// Multipart helper for file upload
function createMultipartUpload(fileBuffer, filename, mimetype, fields = {}) {
  const boundary = `----VercelTestBoundary${Date.now().toString(16)}`;
  const crlf = '\r\n';
  const parts = [];

  for (const [key, val] of Object.entries(fields)) {
    parts.push(Buffer.from(
      `--${boundary}${crlf}Content-Disposition: form-data; name="${key}"${crlf}${crlf}${val}${crlf}`
    ));
  }

  parts.push(Buffer.from(
    `--${boundary}${crlf}Content-Disposition: form-data; name="file"; filename="${filename}"${crlf}Content-Type: ${mimetype}${crlf}${crlf}`
  ));
  parts.push(fileBuffer);
  parts.push(Buffer.from(`${crlf}--${boundary}--${crlf}`));

  return {
    boundary,
    body: Buffer.concat(parts),
    contentType: `multipart/form-data; boundary=${boundary}`
  };
}

async function runProductionTests() {
  console.log(`=== RUNNING PRODUCTION VERIFICATION AGAINST ${BASE_URL} ===\n`);
  let passed = 0;
  let failed = 0;
  const results = [];

  async function test(name, fn) {
    try {
      const detail = await fn();
      console.log(`✓ PASS: ${name}`);
      if (detail) console.log(`   └─ ${detail}`);
      passed++;
      results.push({ name, status: 'PASS', detail });
    } catch (err) {
      console.error(`✗ FAIL: ${name}`);
      console.error(`   └─ Error: ${err.message}`);
      failed++;
      results.push({ name, status: 'FAIL', error: err.message });
    }
  }

  // 1. Root URL
  await test('GET / (Root API endpoint)', async () => {
    const res = await request('/');
    if (res.status !== 200 || res.data?.status !== 'online') {
      throw new Error(`Expected 200 online, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
    return `App: "${res.data.app}", Env: "${res.data.environment}", Status: ${res.data.status}`;
  });

  // 2. Health Endpoint
  await test('GET /api/health (Health & TiDB status)', async () => {
    const res = await request('/api/health');
    if (res.status !== 200 || res.data?.status !== 'online') {
      throw new Error(`Expected 200 online, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
    const db = res.data.database;
    if (!db || !db.connected) {
      throw new Error(`Database not connected: ${JSON.stringify(db)}`);
    }
    return `API: ${res.data.status}, DB: ${db.type} (${db.status}, connected: ${db.connected})`;
  });

  // 3. Studio Services
  await test('GET /api/services?division=STUDIO', async () => {
    const res = await request('/api/services?division=STUDIO');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected array of services, got status ${res.status}`);
    }
    return `Returned ${res.data.length} Studio services (e.g. "${res.data[0].name}")`;
  });

  // 4. Studio Projects
  let sampleProjectSlug = '';
  await test('GET /api/projects?division=STUDIO&status=published', async () => {
    const res = await request('/api/projects?division=STUDIO&status=published');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected array of studio projects, got status ${res.status}`);
    }
    sampleProjectSlug = res.data[0].slug || res.data[0].id;
    return `Returned ${res.data.length} published Studio projects (e.g. "${res.data[0].title}")`;
  });

  // 5. Production Projects
  await test('GET /api/projects?division=PRODUCTION&status=published', async () => {
    const res = await request('/api/projects?division=PRODUCTION&status=published');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected array of production projects, got status ${res.status}`);
    }
    return `Returned ${res.data.length} published Production projects (e.g. "${res.data[0].title}")`;
  });

  // 6. Project Detail Endpoint
  await test(`GET /api/projects/${sampleProjectSlug} (Project Detail)`, async () => {
    const res = await request(`/api/projects/${sampleProjectSlug}`);
    if (res.status !== 200 || !res.data?.id) {
      throw new Error(`Expected project detail, got status ${res.status}`);
    }
    return `Loaded: "${res.data.title}", Division: ${res.data.division}, Category: ${res.data.category}`;
  });

  // 7. Gallery
  await test('GET /api/gallery', async () => {
    const res = await request('/api/gallery');
    if (res.status !== 200 || !Array.isArray(res.data)) {
      throw new Error(`Expected gallery array, got status ${res.status}`);
    }
    return `Returned ${res.data.length} gallery items`;
  });

  // 8. Settings
  await test('GET /api/settings', async () => {
    const res = await request('/api/settings');
    if (res.status !== 200 || !res.data) {
      throw new Error(`Expected settings object, got status ${res.status}`);
    }
    return `Company: "${res.data.company_name || res.data.studio_name}", Tagline: "${res.data.tagline || 'N/A'}"`;
  });

  // 9. Admin Login
  let adminToken = '';
  await test('POST /api/auth/login (Admin Login)', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'admin@superway.com', password: 'cinematic2025!' }
    });
    if (res.status !== 200 || !res.data?.token) {
      throw new Error(`Expected token, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
    adminToken = res.data.token;
    return `Logged in as ${res.data.user.email} (token length: ${adminToken.length})`;
  });

  // 10. Admin Protected Endpoint: /api/stats
  await test('GET /api/stats (Admin Protected)', async () => {
    const res = await request('/api/stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || typeof res.data?.totalStudioProjects !== 'number') {
      throw new Error(`Expected stats data, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
    return `Studio Projects: ${res.data.totalStudioProjects}, Production Projects: ${res.data.totalProductionProjects}`;
  });

  // 11. Admin CRUD Operations (Create, Read, Update, Delete)
  let crudServiceId = '';
  await test('Admin CRUD: POST /api/services (Create Service)', async () => {
    const res = await request('/api/services', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: 'Deployment Verification Service',
        division: 'STUDIO',
        category: 'Web and Software Development',
        description: 'Automated test service to verify Admin CRUD pipelines on Vercel.',
        icon: 'Cpu',
        display_order: 999
      }
    });
    if (res.status !== 201 && res.status !== 200) {
      throw new Error(`Failed to create service: ${res.status} ${JSON.stringify(res.data)}`);
    }
    crudServiceId = res.data?.id;
    if (!crudServiceId) throw new Error('No service ID returned in creation');
    return `Created service ID: ${crudServiceId} ("${res.data.name}")`;
  });

  await test(`Admin CRUD: PUT /api/services/${crudServiceId} (Update Service)`, async () => {
    const res = await request(`/api/services/${crudServiceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: 'Deployment Verification Service (Updated)',
        description: 'Updated description for CRUD verification on production.'
      }
    });
    if (res.status !== 200) {
      throw new Error(`Failed to update service: ${res.status} ${JSON.stringify(res.data)}`);
    }
    return `Updated service name to: "${res.data.name}"`;
  });

  await test(`Admin CRUD: DELETE /api/services/${crudServiceId} (Delete Service)`, async () => {
    const res = await request(`/api/services/${crudServiceId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status !== 200) {
      throw new Error(`Failed to delete service: ${res.status} ${JSON.stringify(res.data)}`);
    }
    return `Deleted service ID: ${crudServiceId}`;
  });

  // 12. Cloudflare B2 Storage Status
  await test('GET /api/media/status (Cloudflare B2 Status)', async () => {
    const res = await request('/api/media/status', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !res.data?.b2Configured) {
      throw new Error(`B2 not configured: ${res.status}: ${JSON.stringify(res.data)}`);
    }
    return `StorageMode: ${res.data.storageMode}, Bucket: ${res.data.bucket}, Region: ${res.data.region}`;
  });

  // 12. Media Upload to Cloudflare B2
  let uploadedMediaId = '';
  let uploadedFileUrl = '';
  await test('POST /api/media/upload (Direct B2 Upload)', async () => {
    // 1x1 transparent PNG buffer
    const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    const multipart = createMultipartUpload(
      pngBuffer,
      'test-verification.png',
      'image/png',
      { title: 'Verification Asset', division: 'STUDIO', category: 'Testing' }
    );

    const res = await request('/api/media/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': multipart.contentType
      },
      body: multipart.body
    });

    if (res.status !== 201 || !res.data?.id) {
      throw new Error(`Upload failed with status ${res.status}: ${JSON.stringify(res.data)}`);
    }
    uploadedMediaId = res.data.id;
    uploadedFileUrl = res.data.file_url;
    return `Uploaded: ID=${res.data.id}, Provider=${res.data.storage_provider}, URL=${res.data.file_url}`;
  });

  // 13. Media Retrieval
  await test('GET /api/media (Media Retrieval)', async () => {
    const res = await request('/api/media');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected media assets, got status ${res.status}`);
    }
    const found = res.data.find(m => m.id === uploadedMediaId);
    return `Media assets count: ${res.data.length}${found ? ` (verified newly uploaded asset "${found.title}")` : ''}`;
  });

  // Clean up uploaded test media
  if (uploadedMediaId) {
    await test(`DELETE /api/media/${uploadedMediaId} (Storage & DB Cleanup)`, async () => {
      const res = await request(`/api/media/${uploadedMediaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.status !== 200) {
        throw new Error(`Failed to delete media: ${res.status}`);
      }
      return `Asset ${uploadedMediaId} cleaned up from B2 storage and database`;
    });
  }

  // 14. Enquiry Submission
  let createdEnquiryId = '';
  await test('POST /api/enquiries (Enquiry Submission)', async () => {
    const res = await request('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Vercel Deployment Verification Bot',
        email: 'verify-production@superway.com',
        phone: '+1 555 0199',
        division: 'STUDIO',
        service_interest: 'Website UI/UX & Landing Pages',
        message: 'Automated verification check of production API enquiry pipeline.'
      }
    });
    const enquiry = res.data?.enquiry || res.data;
    if (res.status !== 201 || !enquiry?.id) {
      throw new Error(`Enquiry creation failed with status ${res.status}: ${JSON.stringify(res.data)}`);
    }
    createdEnquiryId = enquiry.id;
    return `Enquiry created: ID=${enquiry.id}, Name="${enquiry.name}", Division=${enquiry.division}`;
  });

  // Clean up test enquiry
  if (createdEnquiryId) {
    await test(`DELETE /api/enquiries/${createdEnquiryId} (Cleanup)`, async () => {
      const res = await request(`/api/enquiries/${createdEnquiryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.status !== 200) {
        throw new Error(`Failed to delete enquiry: ${res.status}`);
      }
      return `Enquiry ${createdEnquiryId} deleted cleanly`;
    });
  }

  // 15. CORS Preflight Verification
  await test('OPTIONS /api/projects (CORS Preflight)', async () => {
    const res = await request('/api/projects', {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    if (res.status !== 204 && res.status !== 200) {
      throw new Error(`Preflight failed with status ${res.status}`);
    }
    const allowOrigin = res.headers['access-control-allow-origin'];
    if (allowOrigin !== FRONTEND_ORIGIN) {
      throw new Error(`Expected allow origin ${FRONTEND_ORIGIN}, got ${allowOrigin}`);
    }
    return `Preflight OK: Allow-Origin=${allowOrigin}, Methods=${res.headers['access-control-allow-methods']}`;
  });

  console.log(`\n=========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=========================================`);

  return { passed, failed, results };
}

runProductionTests().then(summary => {
  if (summary.failed > 0) {
    process.exit(1);
  }
}).catch(err => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});
