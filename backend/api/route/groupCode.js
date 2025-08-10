const db = require("../../database/db");
const express = require('express');
const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM group_code
    `);
    res.send(rows)
  } catch (e) {
    console.error("error fetching remarks:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get("/add", async (req, res) => {
    try {
      const [rows] = await db.execute(`
        insert into group_code(code) values (?);
      `,[req.code.body]
    );
      res.send(rows)
    } catch (e) {
      console.error("error fetching remarks:", e.message);
      res.status(500).json({ success: false, message: e.message });
    }
  });

module.exports = router;
