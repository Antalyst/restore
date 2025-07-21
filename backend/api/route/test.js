const express = require('express');
const router = express.Router();
const db = require('../../database/db');

router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users'); 
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
