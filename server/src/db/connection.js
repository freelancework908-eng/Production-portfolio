import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let isConnected = false;
let connectionAttempted = false;

export function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      return {
        host: url.hostname,
        port: Number(url.port) || 4000,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, '') || 'portfolio',
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true
        },
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
      };
    } catch (err) {
      console.warn('[TiDB] Failed to parse DATABASE_URL, attempting individual params:', err.message);
    }
  }

  const host = process.env.TIDB_HOST || process.env.DB_HOST || process.env.MYSQL_HOST;
  const user = process.env.TIDB_USER || process.env.DB_USER || process.env.MYSQL_USER;
  const password = process.env.TIDB_PASSWORD || process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
  const database = process.env.TIDB_DATABASE || process.env.DB_NAME || process.env.MYSQL_DATABASE || 'portfolio';
  const port = Number(process.env.TIDB_PORT || process.env.DB_PORT || process.env.MYSQL_PORT) || 4000;

  if (host && user) {
    return {
      host,
      port,
      user,
      password,
      database,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: process.env.TIDB_REJECT_UNAUTHORIZED !== 'false'
      },
      connectionLimit: 5,
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    };
  }

  return null;
}

export async function initTiDBPool() {
  if (pool) return pool;
  connectionAttempted = true;

  const config = getDatabaseConfig();
  if (!config) {
    console.log('[Database] No remote TiDB credentials detected in environment. Using standalone file-backed relational store.');
    isConnected = false;
    return null;
  }

  try {
    console.log(`[TiDB Cloud] Establishing secure TLS connection pool to ${config.host}:${config.port}/${config.database}...`);
    pool = mysql.createPool(config);

    // Verify connectivity with simple ping
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    isConnected = true;
    console.log(`[TiDB Cloud] Successfully connected to database "${config.database}" with TLS v1.2.`);
    return pool;
  } catch (err) {
    console.warn(`[TiDB Cloud] Connection failed (${err.code || err.message}). Operating with local store fallback.`);
    pool = null;
    isConnected = false;
    return null;
  }
}

export async function query(sql, params = []) {
  if (!pool && !connectionAttempted) {
    await initTiDBPool();
  }

  if (!pool || !isConnected) {
    throw new Error('TiDB pool not connected');
  }

  const [results] = await pool.execute(sql, params);
  return results;
}

export function isTiDBConnected() {
  return isConnected;
}

export async function verifyTiDBConnection() {
  const config = getDatabaseConfig();
  if (!config) {
    return {
      connected: false,
      reason: 'NO_REMOTE_CONFIG',
      message: 'No remote TiDB/MySQL credentials found in environment. Using standalone file-backed relational store.'
    };
  }

  try {
    const p = await initTiDBPool();
    if (!p) {
      return {
        connected: false,
        reason: 'CONNECTION_FAILED',
        message: 'Could not establish connection to TiDB Cloud.'
      };
    }
    const [rows] = await p.execute('SELECT 1 as alive');
    return {
      connected: true,
      database: config.database,
      host: config.host,
      port: config.port,
      alive: rows[0]?.alive === 1
    };
  } catch (err) {
    return {
      connected: false,
      reason: err.code || 'QUERY_ERROR',
      message: err.message
    };
  }
}

export async function closeTiDBPool() {
  if (pool) {
    await pool.end();
    pool = null;
    isConnected = false;
  }
}
