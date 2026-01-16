const { Pool } = require('pg');

console.log('db.js file loaded');   // 🔍 MUST PRINT

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected successfully');
  } catch (err) {
    console.error('PostgreSQL connection FAILED');
    console.error(err.message);
  }
})();

module.exports = pool;
