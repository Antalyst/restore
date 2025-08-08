const express = require('express');
const router = express.Router();
const db = require('../../database/db');

router.post("/add", async (req, res) => {
    try {
        const [rows] = await db.execute(
            `INSERT INTO stage_one (client,produce, sugar, bilog, gala, recycle_sacks, reject_bilog, total_produce,date, status ) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,"processing")`,
            [req.body.client, req.body.produce, req.body.sugar, req.body.bilog, req.body.gala, req.body.recycle_sacks, req.body.reject_bilog, req.body.total_produce, req.body.date]
        );
        rows.affectedRows > 0
            ? res.status(201).json({ success: true, message: "Unit added successfully" })
            : res.status(400).json({ success: false, message: "Failed to add unit" });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

router.put("/update/:id", async (req, res) => {
        try {
            const [rows] = await db.execute(
                `UPDATE stage_one SET recycle_sacks = ?, reject_bilog = ?, total_produce = ?, status = 'complete' WHERE id = ?`,
                [req.body.recycle_sacks, req.body.reject_bilog, req.body.total_produce, req.params.id]
            );
            rows.affectedRows > 0
                ? res.status(200).json({ success: true, message: "Unit updated successfully" })
                : res.status(404).json({ success: false, message: "Unit not found or failed to update" });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });

router.get("/get", async (req, res) => {
    try {
        const [rows] = await db.execute(`SELECT * FROM stage_one where status = "processing"`);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;
