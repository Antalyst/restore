const db = require("../../database/db");
const express = require('express');
const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM failed_stage,
     LEFT JOIN stage_one ON stage_one.id = failed_stage.stage_one_id,
     LEFT JOIN stage_two ON stage_two.id = failed_stage.stage_two_id
    `);
    res.send(rows)
  } catch (e) {
    console.error("error fetching remarks:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});
router.post("/add", async (req, res) => {
    try {
      const [rows] = await db.execute(`INSERT INTO failed_stage(stage_one_id, stage_two_id, remarks)`,
        [req.body.stageOneId, req.body.stageTwoId, req.body.remarks]);
      res.send(rows)
    } catch (e) {
      console.error("error fetching remarks:", e.message);
      res.status(500).json({ success: false, message: e.message });
    }
});

router.put("/updateStage1/:id", async (req, res) => {
    try {
      const [rows] = await db.execute(`update stage_one set status = ? where id = ?)`,
        [req.body.status, req.params.id]);
      res.send(rows)
    } catch (e) {
      console.error("error fetching remarks:", e.message);
      res.status(500).json({ success: false, message: e.message });
    }
});

router.put("/updateStage2/:id", async (req, res) => {
    try {
      const [rows] = await db.execute(`update stage_two set status = ? where id = ?)`,
        [req.body.status, req.params.id]);
      res.send(rows)
    } catch (e) {
      console.error("error fetching remarks:", e.message);
      res.status(500).json({ success: false, message: e.message });
    }
});
module.exports = router;
