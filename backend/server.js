import express from "express";
import cors from "cors";
import { Pool } from "pg";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 5000;

// =======================
// PostgreSQL Configuration
// =======================
const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "host.docker.internal",
  database: process.env.PGDATABASE || "asl1_db",
  password: process.env.PGPASSWORD || "123456",
  port: process.env.PGPORT || 5432,
});


// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// API Routes
// =======================

// Test server
app.get("/api", (req, res) => {
  res.send("Backend API is running!");
});

// Upload results route
app.post("/api/results", async (req, res) => {
  const { user, testId, totalScore, totalSigns, percentage, attempts } = req.body;

  if (!user || !testId || !attempts) {
    return res.status(400).json({ message: "Missing required data" });
  }

  try {
    // Insert into results table
    await pool.query(
      `INSERT INTO results 
        (test_id, username, email, login_time, total_score, total_signs, percentage) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [testId, user.username, user.email, user.loginTime, totalScore, totalSigns, percentage]
    );

    // Insert each attempt
    for (const a of attempts) {
      await pool.query(
        `INSERT INTO attempts 
          (test_id, attempt_id, sign, is_correct, timestamp) 
         VALUES ($1, $2, $3, $4, $5)`,
        [testId, a.attemptId, a.sign, a.isCorrect, a.timestamp]
      );
    }

    res.status(200).json({ message: "Results uploaded successfully" });
  } catch (err) {
    console.error("❌ Error inserting into DB:", err);
    res.status(500).json({ message: "Failed to upload results", error: err.message });
  }
});

// =======================
// Serve Frontend (Production)
// =======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Fix for Node 22 / Express 5
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =======================
// Start Server
// =======================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
