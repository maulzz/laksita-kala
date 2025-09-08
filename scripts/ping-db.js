// scripts/ping-db.js

require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

async function pingDatabase() {
  try {
    const client = await pool.connect();
    
    await client.query('SELECT 1'); 
    client.release();
    console.log(`Ping ke database berhasil pada: ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error('Gagal melakukan ping ke database:', error);
  }
}


setInterval(pingDatabase, 240000);

console.log('Skrip ping database dimulai, akan melakukan ping setiap 4 menit.');
pingDatabase(); 