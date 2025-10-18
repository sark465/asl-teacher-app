// server.js
import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
const port = 5000;

// PostgreSQL pool setup
const pool = new Pool({
  user: "postgres",       // your PostgreSQL username
  host: "localhost",
  database: "asl1_db",    // database you created
  password: "123456", // PostgreSQL password
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Test server
app.get("/", (req, res) => {
  res.send("Backend server is running!");
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
    console.error("Error inserting into DB:", err);
    res.status(500).json({ message: "Failed to upload results", error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
