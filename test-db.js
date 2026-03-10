import pool from './src/config/db.js';

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() as current_time');
    console.log('Databasen svarade kl:', res.rows[0].current_time);

    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tabeller som hittades:', tables.rows.map(t => t.table_name));

    process.exit(0);
  } catch (err) {
    console.error('Kunde inte ansluta till databasen ❌', err.message);
    process.exit(1);
  }
}

testConnection();