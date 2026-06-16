const mysql = require('mysql2/promise');
require('dotenv').config();

// Validate that required DB credentials are set
if (!process.env.DB_PASSWORD) {
  console.warn('WARNING: DB_PASSWORD is not set. Ensure database credentials are configured in .env');
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'edusphere_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'edusphere',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database pool.');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
})();

module.exports = pool;
