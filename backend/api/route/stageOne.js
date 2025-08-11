const express = require('express');
const router = express.Router();
const db = require('../../database/db');

router.post("/add", async (req, res) => {
    try {
        // Validate inputs
        const dateStr = req.body.date; // expected M/D/YYYY

        if (!dateStr) {
            return res.status(400).json({ success: false, message: "date is required (M/D/YYYY)" });
        }

        // Converts 1 -> A, 2 -> B, ... 26 -> Z, 27 -> AA, etc.
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

        // Determine the global Nth production (1-based), not per day
        const [countRows] = await db.execute(
            `SELECT COUNT(*) AS cnt FROM stage_one`
        );
        const existingCount = countRows?.[0]?.cnt || 0;

        // Map to series: 001A..001F, 002A..002F, ... globally (no daily reset)
        const sequenceIndex = existingCount + 1; // 1-based
        const numericIndex = Math.floor((sequenceIndex - 1) / 6) + 1; // 1,1,1,1,1,1,2,2,...
        const letterIndex = ((sequenceIndex - 1) % 6) + 1; // 1..6 -> A..F
        const numericPart = String(numericIndex).padStart(3, '0');
        const letter = toLetter(letterIndex);
        const productionCode = `${numericPart}${letter}`;

        const [rows] = await db.execute(
            `INSERT INTO stage_one (
                client,
                group_leader_id,
                produce,
                sugar,
                bilog,
                gala,
                recycle_sacks,
                reject_bilog,
                total_produce,
                date,
                production_code,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "processing")`,
            [
                req.body.client,
                req.body.group_leader_id,
                req.body.produce,
                req.body.sugar,
                req.body.bilog,
                req.body.gala,
                req.body.recycle_sacks,
                req.body.reject_bilog,
                req.body.total_produce,
                dateStr,
                productionCode,
            ]
        );
        rows.affectedRows > 0
            ? res.status(201).json({ success: true, message: "Unit added successfully", production_code: productionCode })
            : res.status(400).json({ success: false, message: "Failed to add unit" });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

router.put("/update/:id", async (req, res) => {
        try {
            const [rows] = await db.execute(
                `UPDATE stage_one SET recycle_sacks = ?, reject_bilog = ?, total_produce = ?, status = 'complete' WHERE id = ?`,
                [req.body.recycle_sacks,  req.body.reject_bilog, req.body.total_produce, req.params.id]
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
        const [rows] = await db.execute(`
            SELECT
                s1.id AS stage_one_id,
                s1.client,
                s1.group_leader_id,
                s1.produce,
                s1.sugar,
                s1.bilog,
                s1.gala,
                s1.recycle_sacks,
                s1.reject_bilog,
                s1.total_produce,
                s1.date,
                s1.status,
                s1.production_code,
                (
                    SELECT COUNT(*) FROM stage_one s2
                    WHERE s2.id <= s1.id
                ) AS global_sequence,
                gl.id AS leader_id,
                gl.name
            FROM stage_one s1
            LEFT JOIN group_leader gl ON s1.group_leader_id = gl.id
            WHERE s1.status = 'processing' ;
        `);

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
            if (r.production_code) return r;
            const sequenceIndex = Number.parseInt(r.global_sequence, 10) || 1;
            const numericIndex = Math.floor((sequenceIndex - 1) / 6) + 1;
            const letterIndex = ((sequenceIndex - 1) % 6) + 1;
            const numericPart = String(numericIndex).padStart(3, '0');
            const letter = toLetter(letterIndex);
            return { ...r, production_code: `${numericPart}${letter}` };
        });

        res.json(withCodes);
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Admin update for stage_one (production_code not editable)
router.put("/admin/update/:id", async (req, res) => {
    try {
        const { client, group_leader_id, produce, sugar, bilog, gala, recycle_sacks, reject_bilog, total_produce, status, date } = req.body;
        const [rows] = await db.execute(
            `UPDATE stage_one 
             SET client = ?, group_leader_id = ?, produce = ?, sugar = ?, bilog = ?, gala = ?, recycle_sacks = ?, reject_bilog = ?, total_produce = ?, status = ?, date = ?
             WHERE id = ?`,
            [client, group_leader_id, produce, sugar, bilog, gala, recycle_sacks, reject_bilog, total_produce, status, date, req.params.id]
        );
        rows.affectedRows > 0
            ? res.status(200).json({ success: true })
            : res.status(404).json({ success: false, message: "Stage one not found" });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;
