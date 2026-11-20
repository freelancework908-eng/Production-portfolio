import http from 'http';

const BASE_URL = 'http://127.0.0.1:5000';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== RUNNING END-TO-END SERVER ENDPOINT VERIFICATION ===');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health', async () => {
    const res = await request('/api/health');
    if (res.status !== 200 || res.data?.status !== 'online') {
      throw new Error(`Expected status 200 online, got ${res.status}`);
    }
  });

  // 2. Admin Authentication
  let adminToken = '';
  await test('POST /api/auth/login', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'admin@superway.com', password: 'cinematic2025!' }
    });
    if (res.status !== 200 || !res.data?.token) {
      throw new Error(`Login failed with status ${res.status}: ${JSON.stringify(res.data)}`);
    }
    adminToken = res.data.token;
  });

  // 3. Projects (Public & Admin)
  await test('GET /api/projects?division=STUDIO', async () => {
    const res = await request('/api/projects?division=STUDIO');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected array of studio projects, got ${res.status}`);
    }
  });

  await test('GET /api/projects?division=PRODUCTION', async () => {
    const res = await request('/api/projects?division=PRODUCTION');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected array of production projects, got ${res.status}`);
    }
  });

  // 4. Services
  await test('GET /api/services?division=STUDIO', async () => {
    const res = await request('/api/services?division=STUDIO');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected studio services, got ${res.status}`);
    }
  });

  // 5. Media Library & B2 Status
  await test('GET /api/media/status (Admin)', async () => {
    const res = await request('/api/media/status', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !res.data?.storageMode) {
      throw new Error(`Expected storage status, got ${res.status}`);
    }
  });

  // 6. Clients
  await test('GET /api/clients', async () => {
    const res = await request('/api/clients');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected clients list, got ${res.status}`);
    }
  });

  // 7. Testimonials
  await test('GET /api/testimonials', async () => {
    const res = await request('/api/testimonials');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected testimonials list, got ${res.status}`);
    }
  });

  // 8. Banners
  await test('GET /api/banners', async () => {
    const res = await request('/api/banners');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected banners list, got ${res.status}`);
    }
  });

  // 9. Navigation Items
  await test('GET /api/navigation', async () => {
    const res = await request('/api/navigation');
    if (res.status !== 200 || !Array.isArray(res.data)) {
      throw new Error(`Expected navigation list, got ${res.status}`);
    }
  });

  // 10. Dashboard Stats
  await test('GET /api/stats (Admin)', async () => {
    const res = await request('/api/stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || typeof res.data?.totalStudioProjects !== 'number') {
      throw new Error(`Expected stats with totalStudioProjects, got ${JSON.stringify(res.data)}`);
    }
  });

  // 11. Enquiry Submission
  await test('POST /api/enquiries', async () => {
    const res = await request('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Test Client',
        email: 'test@example.com',
        phone: '+91 99999 88888',
        division: 'STUDIO',
        service_interest: 'Brand Identity',
        message: 'Requesting project consultation for new identity.'
      }
    });
    if (res.status !== 201) {
      throw new Error(`Enquiry creation failed with status ${res.status}`);
    }
  });

  console.log(`\n=== VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
  process.exit(failed > 0 ? 1 : 0);
}

// Start temporary server if not running, then execute
import('./src/index.js').then(() => {
  // Give it a moment to bind port
  setTimeout(runTests, 1000);
}).catch(err => {
  console.error('Failed to import server:', err);
  process.exit(1);
});
