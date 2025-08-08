const express = require('express');
const router = express.Router();
const db = require('../../database/db');

router.post("/add", async (req, res) => {
        try {
            const [rows] = await db.execute(
                `INSERT INTO stage_two (stage_one_id, bilog, produced, sacks,  status_session) VALUES (?, 0 , 0 , 0, ?)`,
                [req.body.stage_one_id,req.body.status_session]
            );
            rows.affectedRows > 0
                ? res.status(201).json({ success: true, message: "Unit added successfully" })
                : res.status(400).json({ success: false, message: "Failed to add unit" });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });
    
    router.get("/get", async (req, res) => {
        try {
            const [rows] = await db.execute(
                `SELECT stage_one.client, stage_one.produce, stage_one.date, stage_two.* FROM stage_two LEFT JOIN stage_one ON stage_one.id = stage_two.stage_one_id`
            );
            res.json(rows);
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });
    

    router.put("/update/:id", async (req, res) => {
            try {
                const [rows] = await db.execute(
                    `UPDATE stage_two SET sacks = ?, bilog = ?, produced = ?, status_session = 'complete' WHERE id = ?`,
                    [req.body.sacks, req.body.bilog, req.body.produced, req.params.id]
                );
                rows.affectedRows > 0
                    ? res.status(200).json({ success: true, message: "Unit updated successfully" })
                    : res.status(404).json({ success: false, message: "Unit not found or failed to update" });
            } catch (e) {
                res.status(500).json({ success: false, message: e.message });
            }
        });
    

module.exports = router;
