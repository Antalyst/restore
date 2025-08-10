const express = require('express');
const router = express.Router();
const db = require('../../database/db');

router.post("/add", async (req, res) => {
        try {
            const { stage_one_id, group_leader, status_session } = req.body;

            // Pull production_code from stage_one; if null, compute fallback from date + sequence
            const [s1rows] = await db.execute(
                `SELECT date, production_code,
                        (SELECT COUNT(*) FROM stage_one s2 WHERE s2.date = s1.date AND s2.id <= s1.id) AS day_sequence
                 FROM stage_one s1 WHERE id = ?`,
                [stage_one_id]
            );
            const s1 = s1rows && s1rows[0] ? s1rows[0] : null;
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
            let productionCode = s1?.production_code || null;
            if (!productionCode && s1) {
                let dayPart = "";
                if (s1.date) {
                    const parts = String(s1.date).split("/");
                    const day = parts.length >= 2 ? parseInt(parts[1], 10) : NaN;
                    dayPart = Number.isFinite(day) ? `00${day}` : "";
                }
                const letter = toLetter(parseInt(s1.day_sequence, 10));
                productionCode = `${dayPart}${letter}`;
            }

             const [rows] = await db.execute(
                 `INSERT INTO stage_two (stage_one_id, group_leader, bilog, produced, sacks, status_session, production_code) VALUES (?, ?, 0, 0, 0, ?, ?)`,
                 [stage_one_id, group_leader, status_session, productionCode]
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
                s1.total_produce,
                s1.reject_bilog as stage1bilog,
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
            LEFT JOIN stage_one s1 ON s1.id = s2.stage_one_id
            WHERE s1.date IS NOT NULL 
              AND STR_TO_DATE(s1.date, '%c/%e/%Y') >= (CURDATE() - INTERVAL 2 DAY)
                
              `
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
            if (r.production_code) return r;
            // Fallback for legacy rows without production_code: derive from date + sequence
            let dayPart = "";
            if (r.date) {
                const parts = String(r.date).split("/");
                const day = parts.length >= 2 ? parseInt(parts[1], 10) : NaN;
                dayPart = Number.isFinite(day) ? `00${day}` : "";
            }
            const letter = toLetter(parseInt(r.day_sequence, 10));
            return { ...r, production_code: `${dayPart}${letter}` };
        });

        res.json(withCodes);
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });

    // One-time utility to backfill missing production_code in stage_two
    router.post("/backfill-codes", async (req, res) => {
        try {
            const [rows] = await db.execute(
                `SELECT s2.id, s1.date, s1.production_code,
                        (SELECT COUNT(*) FROM stage_one s2b WHERE s2b.date = s1.date AND s2b.id <= s1.id) AS day_sequence
                 FROM stage_two s2
                 LEFT JOIN stage_one s1 ON s1.id = s2.stage_one_id
                 WHERE s2.production_code IS NULL`
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
            let updated = 0;
            for (const r of rows) {
                let code = r.production_code || null;
                if (!code) {
                    let dayPart = "";
                    if (r.date) {
                        const parts = String(r.date).split("/");
                        const day = parts.length >= 2 ? parseInt(parts[1], 10) : NaN;
                        dayPart = Number.isFinite(day) ? `00${day}` : "";
                    }
                    const letter = toLetter(parseInt(r.day_sequence, 10));
                    code = `${dayPart}${letter}`;
                }
                const [ur] = await db.execute(
                    `UPDATE stage_two SET production_code = ? WHERE id = ?`,
                    [code, r.id]
                );
                updated += ur.affectedRows || 0;
            }
            res.json({ success: true, updated });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });
    

    router.put("/update/:id", async (req, res) => {
            try {
                // Ensure production_code is copied from stage_one if missing
                const [rows] = await db.execute(
                    `UPDATE stage_two s2 
                        LEFT JOIN stage_one s1 ON s1.id = s2.stage_one_id
                        SET s2.sacks = ?, s2.bilog = ?, s2.produced = ?, s2.status_session = 'complete',
                            s2.production_code = COALESCE(s2.production_code, s1.production_code)
                        WHERE s2.id = ?`,
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
