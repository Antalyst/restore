const db = require("../../database/db");
const express = require('express');
const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        r.*,
        u.username AS user_name,
        i.name AS item_name
      FROM remarks r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN items i ON r.item_id = i.id
      ORDER BY r.date DESC
    `);
    res.status(200).json({ success: true, message: "Remarks fetched", result: rows });
  } catch (e) {
    console.error("error fetching remarks:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
