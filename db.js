const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false }
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS markets (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      logo_url TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      sort_order INT DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS results (
      id SERIAL PRIMARY KEY,
      market_id INT REFERENCES markets(id) ON DELETE CASCADE,
      result_date DATE NOT NULL,
      result_number TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(market_id, result_date)
    );
  `);

  // seed market contoh kalau kosong
  const m = await pool.query(`SELECT COUNT(*)::int AS c FROM markets`);
  if (m.rows[0].c === 0) {
    await pool.query(`
      INSERT INTO markets (slug, name, logo_url, sort_order) VALUES
      ('brunei','BRUNEI','',10),
      ('california','CALIFORNIA','',20),
      ('cambodia','CAMBODIA','',30),
      ('carolina','CAROLINA-DAY','',40);
    `);
  }
}

module.exports = { pool, initDb };
