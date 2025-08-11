const db = require("../../database/db");
const express = require('express');
const router = express.Router();


router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM final_stage
      WHERE status IS NULL OR LOWER(status) <> 'ready to deliver'
    `);
    res.send(rows);
  } catch (e) {
    console.error("error fetching final_stage:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

// Admin: fetch all final stage rows regardless of status
router.get("/get/all", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM final_stage ORDER BY id DESC
    `);
    res.send(rows);
  } catch (e) {
    console.error("error fetching all final_stage:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});


router.post("/add", async (req, res) => {
  try {
    const { code, size, bilog, date, remark } = req.body;

    const [rows] = await db.execute(`
      INSERT INTO final_stage (code, size, bilog, date, remark) 
      VALUES (?, ?, ?, ?, ?);
    `, [code, size, bilog, date, remark]);

    res.send({ success: true, insertedId: rows.insertId });
  } catch (e) {
    console.error("error inserting into final_stage:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

// Create a mix from selected stage_two ids. Generates next 3-digit code (001, 002, ...),
// calculates totals from stage_two, inserts into final_stage, and marks those stage_two rows as mixed.
router.post("/mix", async (req, res) => {
  try {
    const { ids = [], remark = '', client: mixClient = null } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "ids array is required" });
    }

    const placeholders = ids.map(() => '?').join(',');
    // Total from stage_one.total_produce, bilog from stage_two.bilog
    const [totalsRows] = await db.execute(
      `SELECT 
         COALESCE(SUM(s1.total_produce),0) AS size,
         COALESCE(SUM(s2.bilog),0) AS bilog
       FROM stage_two s2
       LEFT JOIN stage_one s1 ON s1.id = s2.stage_one_id
       WHERE s2.id IN (${placeholders})`,
      ids
    );
    const totalSize = Number(totalsRows?.[0]?.size || 0);
    const totalBilog = Number(totalsRows?.[0]?.bilog || 0);

    // Next code: 3-digit, starts at 001
    const [countRows] = await db.execute(`SELECT COUNT(*) AS cnt FROM final_stage`);
    const nextIndex = Number(countRows?.[0]?.cnt || 0) + 1;
    const code = String(nextIndex).padStart(3, '0');

    const now = new Date();
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

    // Ensure columns for status, sacks and client exist (conditionally)
    try {
      const [cols] = await db.execute(
        `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'final_stage' AND COLUMN_NAME IN ('status','sacks','client')`
      );
      const haveStatus = cols.some(c => String(c.COLUMN_NAME).toLowerCase() === 'status');
      const haveSacks = cols.some(c => String(c.COLUMN_NAME).toLowerCase() === 'sacks');
      const haveClient = cols.some(c => String(c.COLUMN_NAME).toLowerCase() === 'client');
      if (!haveStatus) {
        await db.execute(`ALTER TABLE final_stage ADD COLUMN status VARCHAR(50) DEFAULT 'processing'`);
      }
      if (!haveSacks) {
        await db.execute(`ALTER TABLE final_stage ADD COLUMN sacks INT DEFAULT 0`);
      }
      if (!haveClient) {
        await db.execute(`ALTER TABLE final_stage ADD COLUMN client VARCHAR(255) NULL`);
      }
    } catch (alterErr) {
      // ignore alter errors to avoid failing mix
      console.warn('final_stage alter warning:', alterErr.message);
    }

    const [ins] = await db.execute(
      `INSERT INTO final_stage (code, size, bilog, date, remark, status, total_kg_mixed, sacks, client) VALUES (?, 0, ?, ?, ?, 'processing', ?, 0, ?)` ,
      [code, String(totalBilog), date, remark, totalSize, mixClient]
    );

    // Mark selected stage_two as mixed so they won't appear in processing lists
    await db.execute(
      `UPDATE stage_two SET status_session = 'mixed' WHERE id IN (${placeholders})`,
      ids
    );

    return res.status(201).json({ success: true, id: ins.insertId, code, size: 0, bilog: totalBilog, date, client: mixClient });
  } catch (e) {
    console.error("mix error:", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
});

// Update final stage entry, adjust inventory for bilog (add) and sacks (subtract), set status
router.put('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { size, bilog, sacks, status, client } = req.body || {};

    // Read current values to compute deltas for inventory adjustments
    const [rows] = await db.execute(`SELECT size, total_kg_mixed, bilog, sacks, client FROM final_stage WHERE id = ? LIMIT 1`, [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Final stage not found' });
    }
    const current = rows[0];

    const newSize = Number(size ?? current.size ?? 0);
    const newTotalKgMixed =
      req.body && Object.prototype.hasOwnProperty.call(req.body, 'total_kg_mixed')
        ? Number(req.body.total_kg_mixed)
        : Number(current.total_kg_mixed ?? current.size ?? 0);
    const newBilog = Number(bilog ?? current.bilog ?? 0);
    const newSacks = Number(sacks ?? current.sacks ?? 0);

    const bilogDelta = newBilog - Number(current.bilog ?? 0);
    const sacksDelta = newSacks - Number(current.sacks ?? 0);

    // Update final_stage row
    const [upd] = await db.execute(
      `UPDATE final_stage SET size = ?, total_kg_mixed = ?, bilog = ?, sacks = ?, status = ?, client = ? WHERE id = ?`,
      [newSize, newTotalKgMixed, String(newBilog), newSacks, status || 'Ready to deliver', client ?? rows[0].client ?? null, id]
    );

    // Adjust items: add bilog delta, subtract sacks delta
    if (Number.isFinite(bilogDelta) && bilogDelta !== 0) {
      await db.execute(
        `UPDATE items SET current_stock = GREATEST(current_stock + ?, 0) WHERE LOWER(name) = 'bilog'`,
        [bilogDelta]
      );
    }
    if (Number.isFinite(sacksDelta) && sacksDelta !== 0) {
      await db.execute(
        `UPDATE items SET current_stock = GREATEST(current_stock - ?, 0) WHERE LOWER(name) = 'sacks'`,
        [Math.max(sacksDelta, 0)]
      );
      // If sacksDelta is negative (reducing recorded sacks), add back to inventory
      if (sacksDelta < 0) {
        await db.execute(
          `UPDATE items SET current_stock = current_stock + ? WHERE LOWER(name) = 'sacks'`,
          [Math.abs(sacksDelta)]
        );
      }
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('finalstage update error:', e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
