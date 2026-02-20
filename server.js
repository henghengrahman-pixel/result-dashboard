const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const path = require("path");
const { pool, initDb } = require("./db");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" }
  })
);

function requireAdmin(req, res, next) {
  if (req.session?.adminId) return next();
  return res.redirect("/admin/login");
}

// ---------- PUBLIC ----------
app.get("/", async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const { rows } = await pool.query(
    `
    SELECT
      m.id, m.slug, m.name, m.logo_url, m.sort_order,
      r.result_date, r.result_number
    FROM markets m
    LEFT JOIN results r
      ON r.market_id = m.id AND r.result_date = $1
    WHERE m.is_active = TRUE
    ORDER BY m.sort_order ASC, m.id ASC;
    `,
    [today]
  );

  res.render("home", { items: rows, today });
});

// ---------- ADMIN AUTH ----------
app.get("/admin/login", (req, res) => {
  res.render("admin-login", { error: null });
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const q = await pool.query(`SELECT * FROM admins WHERE username=$1`, [username]);
  const admin = q.rows[0];
  if (!admin) return res.render("admin-login", { error: "Username salah." });

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return res.render("admin-login", { error: "Password salah." });

  req.session.adminId = admin.id;
  res.redirect("/admin");
});

app.post("/admin/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// ---------- ADMIN DASHBOARD ----------
app.get("/admin", requireAdmin, async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const markets = await pool.query(
    `SELECT * FROM markets ORDER BY sort_order ASC, id ASC`
  );

  const results = await pool.query(
    `
    SELECT r.*, m.name, m.slug
    FROM results r
    JOIN markets m ON m.id = r.market_id
    WHERE r.result_date = $1
    ORDER BY m.sort_order ASC, m.id ASC
    `,
    [today]
  );

  res.render("admin-dashboard", {
    today,
    markets: markets.rows,
    results: results.rows
  });
});

// update/insert result
app.post("/admin/result", requireAdmin, async (req, res) => {
  const { market_id, result_date, result_number } = req.body;

  // simpan sebagai TEXT biar "0498" aman
  const cleaned = String(result_number || "").trim();
  if (!/^\d{2,6}$/.test(cleaned)) {
    return res.status(400).send("Result harus angka 2-6 digit.");
  }

  await pool.query(
    `
    INSERT INTO results (market_id, result_date, result_number)
    VALUES ($1,$2,$3)
    ON CONFLICT (market_id, result_date)
    DO UPDATE SET result_number = EXCLUDED.result_number, updated_at = NOW();
    `,
    [market_id, result_date, cleaned]
  );

  res.redirect("/admin");
});

// create admin sekali (setup)
app.get("/admin/setup", async (req, res) => {
  // keamanan: hanya boleh kalau belum ada admin
  const c = await pool.query(`SELECT COUNT(*)::int AS c FROM admins`);
  if (c.rows[0].c > 0) return res.status(403).send("Admin sudah ada.");

  res.send(`
    <h3>Setup Admin</h3>
    <form method="post" action="/admin/setup">
      <input name="username" placeholder="username" required />
      <input name="password" placeholder="password" type="password" required />
      <button>Buat Admin</button>
    </form>
  `);
});

app.post("/admin/setup", async (req, res) => {
  const c = await pool.query(`SELECT COUNT(*)::int AS c FROM admins`);
  if (c.rows[0].c > 0) return res.status(403).send("Admin sudah ada.");

  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO admins (username, password_hash) VALUES ($1,$2)`,
    [username, hash]
  );
  res.redirect("/admin/login");
});

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => console.log("Running on port", PORT));
  })
  .catch((e) => {
    console.error("DB init error:", e);
    process.exit(1);
  });
