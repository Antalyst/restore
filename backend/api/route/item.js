const express = require('express');
const path = require("path");
const router = express.Router();
const multer = require("multer");
const db = require("../../database/db");

router.use('/images', express.static(path.join(__dirname, '../../api-img/img')));

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../api-img/img'),
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });


router.post("/add", upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      category,
      unit_of_measurement,
      min_stock_level,
      max_stock_level
    } = req.body;

    const image_path = req.file ? req.file.filename : null;

    const result = await db.execute(
      `INSERT INTO items (
        name,
        category,
        unit_of_measurement,
        min_stock_level,
        max_stock_level,
        image_path
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name ?? null,
        category ?? null,
        unit_of_measurement ?? null,
        min_stock_level ?? null,
        max_stock_level ?? null,
        image_path
      ]
    );

    res.status(201).json({ success: true, message: "Item added", result });
  } catch (e) {
    console.error("DB insert error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
