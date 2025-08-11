const db = require("../../database/db");
const express = require('express');
const router = express.Router();

router.get("/get/all", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        fs.*,
        s1.production_code AS stage_one_code,
        s2.production_code AS stage_two_code
      FROM failed_stage fs
      LEFT JOIN stage_two s2 ON s2.id = fs.stage_two_id
      LEFT JOIN stage_one s1 ON s1.id = COALESCE(fs.stage_one_id, s2.stage_one_id)
      ORDER BY fs.id DESC
    `);
    res.send(rows);
  } catch (e) {
    console.error("error fetching failed stages:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});



router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        fs.id,
        fs.stage_one_id,
        fs.stage_two_id,
        fs.remarks,
        s1.production_code as stage_one_code,
        s1.client as client,
        s1.produce as produce,
        s1.status as stage_one_status,
        s2.production_code as stage_two_code,
        s2.status_session as stage_two_status,
        COALESCE(gl.name, s2.group_leader) as group_leader,
        -- Extra fields for admin editing
        s1.group_leader_id as s1_group_leader_id,
        s1.sugar as s1_sugar,
        s1.bilog as s1_bilog,
        s1.gala as s1_gala,
        s1.recycle_sacks as s1_recycle_sacks,
        s1.reject_bilog as s1_reject_bilog,
        s1.total_produce as s1_total_produce,
        s2.group_leader as s2_group_leader,
        s2.bilog as s2_bilog,
        s2.produced as s2_produced,
        s2.sacks as s2_sacks,
        CASE 
          WHEN fs.stage_one_id IS NOT NULL THEN 'Stage One'
          WHEN fs.stage_two_id IS NOT NULL THEN 'Stage Two'
          ELSE 'Unknown'
        END as failed_stage_type,
        s1.date as failed_date
      FROM failed_stage fs
      LEFT JOIN stage_two s2 ON s2.id = fs.stage_two_id
      LEFT JOIN stage_one s1 ON s1.id = COALESCE(fs.stage_one_id, s2.stage_one_id)
      LEFT JOIN group_leader gl ON gl.id = s1.group_leader_id
      ORDER BY fs.id DESC
    `);
    
    console.log('Failed stages fetched:', rows.length, 'records');
    res.send(rows)
  } catch (e) {
    console.error("error fetching failed stages:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post("/add", async (req, res) => {
    try {
      const [rows] = await db.execute(
        `INSERT INTO failed_stage(stage_one_id, stage_two_id, remarks) VALUES (?, ?, ?)`,
        [req.body.stageOneId, req.body.stageTwoId, req.body.remarks]
      );
      console.log('Failed stage added:', req.body);
      res.send(rows)
    } catch (e) {
      console.error("error adding failed stage:", e.message);
      res.status(500).json({ success: false, message: e.message });
    }
});

// Update remarks for a failed record
router.put("/update/:id", async (req, res) => {
  try {
    const { remarks } = req.body;
    const [rows] = await db.execute(
      `UPDATE failed_stage SET remarks = ? WHERE id = ?`,
      [remarks ?? null, req.params.id]
    );
    rows.affectedRows > 0
      ? res.status(200).json({ success: true })
      : res.status(404).json({ success: false, message: "Failed record not found" });
  } catch (e) {
    console.error("error updating failed remarks:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

// Delete a failed record (does not touch stage_one/stage_two)
router.delete("/delete/:id", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `DELETE FROM failed_stage WHERE id = ?`,
      [req.params.id]
    );
    rows.affectedRows > 0
      ? res.status(200).json({ success: true })
      : res.status(404).json({ success: false, message: "Failed record not found" });
  } catch (e) {
    console.error("error deleting failed record:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put("/updateStage1/:id", async (req, res) => {
    try {
      const [rows] = await db.execute(
        `UPDATE stage_one SET status = ? WHERE id = ?`,
        [req.body.status, req.params.id]
      );
      res.send(rows)
    } catch (e) {
      console.error("error updating stage one:", e.message);
      res.status(500).json({ success: false, message: e.message });
    }
});

router.put("/updateStage2/:id", async (req, res) => {
    try {
      const [rows] = await db.execute(
        `UPDATE stage_two SET status_session = ? WHERE id = ?`,
        [req.body.status, req.params.id]
      );
      res.send(rows)
    } catch (e) {
      console.error("error updating stage two:", e.message);
      res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;