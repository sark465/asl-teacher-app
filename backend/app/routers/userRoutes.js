import express from "express";
import { pool } from "../db.js";  // your PostgreSQL connection
const router = express.Router();

// Register/Login user
router.post("/login", async (req, res) => {
  const { username, email } = req.body;

  try {
    // Check if user already exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (result.rows.length > 0) {
      // Existing user
      return res.json({ user: result.rows[0], message: "Welcome back!" });
    }

    // New user → insert
    const insert = await pool.query(
      `INSERT INTO users (username, email, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
      [username, email]
    );

    res.json({ user: insert.rows[0], message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
