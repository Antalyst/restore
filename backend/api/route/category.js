const express = require('express');
const router = express.Router();
const db = require('../../database/db');

router.post("/add", async (req, res) => {
    try {
        const [rows] = await db.execute(
            `INSERT INTO category (name, code) VALUES (?, ?)`,
            [req.body.name, req.body.code]
        );
        rows.affectedRows > 0
            ? res.status(201).json({ success: true, message: "Category added successfully" })
            : res.status(400).json({ success: false, message: "Failed to add category" });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

router.get("/get", async (req, res) => {
    try {
        const [rows] = await db.execute(`SELECT * FROM category`);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});



module.exports = router;
