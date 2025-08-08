const express = require('express');
const router = express.Router();
const db = require('../../database/db');

router.post("/add", async (req, res) => {
    try {
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

        const dateStr = req.body.date; // expected M/D/YYYY
        let dayPart = "";
        if (dateStr) {
            const parts = String(dateStr).split("/");
            const day = parts.length >= 2 ? parseInt(parts[1], 10) : NaN;
            dayPart = Number.isFinite(day) ? `00${day}` : "";
        }

        // Determine the Nth production for this date (1-based)
        const [countRows] = await db.execute(
            `SELECT COUNT(*) AS cnt FROM stage_one WHERE date = ?`,
            [dateStr]
        );
        const seqNum = (countRows?.[0]?.cnt || 0) + 1;
        const letter = toLetter(seqNum);
        const productionCode = `${dayPart}${letter}`;

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
                    WHERE s2.date = s1.date AND s2.id <= s1.id
                ) AS day_sequence,
                gl.id AS leader_id,
                gl.name
            FROM stage_one s1
            LEFT JOIN group_leader gl ON s1.group_leader_id = gl.id
            WHERE s1.status = 'processing';
        `);
        const toLetter = (n) => {
            // 1 -> A, 2 -> B, ... 26 -> Z, 27 -> AA
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

module.exports = router;
