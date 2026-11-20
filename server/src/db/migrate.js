import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { getDatabaseConfig, initTiDBPool } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

export async function runMigrations() {
  console.log('=== STARTING DATABASE MIGRATIONS (TiDB Cloud / MySQL) ===');

  const config = getDatabaseConfig();
  if (!config) {
    console.log('[Migration] No TiDB/MySQL connection configuration detected in environment.');
    console.log('[Migration] To run migrations against TiDB Cloud, ensure DATABASE_URL or TIDB_HOST is configured in .env');
    return { success: false, reason: 'NO_CONFIG' };
  }

  let connection = null;
  try {
    connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl,
      multipleStatements: true
    });

    console.log(`[Migration] Connected to ${config.host}:${config.port}/${config.database}`);

    // Create migrations table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`schema_migrations\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`migration_name\` VARCHAR(255) NOT NULL UNIQUE,
        \`applied_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get already applied migrations
    const [rows] = await connection.query(`SELECT migration_name FROM \`schema_migrations\`;`);
    const applied = new Set(rows.map(r => r.migration_name));

    // Read migration files
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    let appliedCount = 0;
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`[Migration] ✓ Already applied: ${file}`);
        continue;
      }

      console.log(`[Migration] Executing migration: ${file}...`);
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      // Execute SQL script
      await connection.query(sql);

      // Record migration
      await connection.query(
        `INSERT INTO \`schema_migrations\` (\`migration_name\`) VALUES (?);`,
        [file]
      );

      console.log(`[Migration] ✓ Successfully applied: ${file}`);
      appliedCount++;
    }

    console.log(`=== MIGRATIONS COMPLETE (${appliedCount} new applied, ${files.length} total) ===`);
    return { success: true, appliedCount, total: files.length };
  } catch (err) {
    console.error('[Migration] Migration execution error:', err);
    return { success: false, error: err.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Allow direct CLI execution: node server/src/db/migrate.js
if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  runMigrations().then(res => {
    process.exit(res.success ? 0 : 1);
  });
}
