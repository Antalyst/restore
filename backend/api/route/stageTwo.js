const express = require('express');
const router = express.Router();
const db = require('../../database/db');

router.post("/add", async (req, res) => {
        try {
            const { stage_one_id, group_leader, status_session } = req.body;
            const [rows] = await db.execute(
                `INSERT INTO stage_two (stage_one_id, group_leader, bilog, produced, sacks, status_session) VALUES (?, ?, 0, 0, 0, ?)`,
                [stage_one_id, group_leader, status_session]
            );
            rows.affectedRows > 0
                ? res.status(201).json({ success: true, message: "Stage two row created" })
                : res.status(400).json({ success: false, message: "Failed to add stage two row" });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });
    
    router.get("/get", async (req, res) => {
        try {
        const [rows] = await db.execute(
            `SELECT 
                s1.client, 
                s1.produce, 
                s1.date, 
                s1.group_leader_id, 
                s1.production_code,
                (
                    SELECT COUNT(*) FROM stage_one s2
                    WHERE s2.date = s1.date AND s2.id <= s1.id
                ) AS day_sequence,
                s2.* 
            FROM stage_two s2 
            LEFT JOIN stage_one s1 ON s1.id = s2.stage_one_id`
        );
        const toLetter = (n) => {
            if (!n || n < 1) return "";
            let result = "";
            let value = n;
            while (value > 0) {
                const rem = (value - 1) % 26;
                result = String.fromCharCode(65 + rem) + result;
                value = Math.floor((value - 1) / 26);
            }
            return result;
        };
        const withCodes = rows.map((r) => {
            let dayPart = "";
            if (r.date) {
                const parts = String(r.date).split("/");
                const day = parts.length >= 2 ? parseInt(parts[1], 10) : NaN;
                dayPart = Number.isFinite(day) ? `00${day}` : "";
            }
            if (r.production_code) {
                return r;
            }
            const letter = toLetter(parseInt(r.day_sequence, 10));
            return { ...r, production_code: `${dayPart}${letter}` };
        });
        res.json(withCodes);
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
