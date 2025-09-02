import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hanatour_db',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  idleTimeout: 300000,
  maxIdle: 5,
});

export default pool;
export const db = pool; 