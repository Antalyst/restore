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
    console.log("Received request body:", req.body);
    console.log("Received file:", req.file);
    const {
      name,
      category,
      unit_of_measurement,
      min_stock_level,
      max_stock_level
    } = req.body;


    const image_path = req.file ? `http://localhost:5000/images/${req.file.filename}` : null;

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

    console.log(`Inserted item: ${name}, ${category}, ${image_path}`);
    res.status(201).json({ success: true, message: "Item added successfully", result });
  } catch (e) {
    console.error("DB insert error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM items");
    res.status(200).json({ success: true, message: "Items fetched", result: rows })
  } catch (e) {
    console.error("DB fetch error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put("/update/:id", upload.single('image'), async (req, res) => {
  try {
    console.log("Update request for ID:", req.params.id);
    console.log("Received request body:", req.body);
    console.log("Received file:", req.file);
    
    const {
      name,
      category,
      unit_of_measurement,
      min_stock_level,
      max_stock_level
    } = req.body;

    const itemId = req.params.id;

    const [currentItem] = await db.execute(
      "SELECT image_path FROM items WHERE id = ?",
      [itemId]
    );

    if (currentItem.length === 0) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    let image_path = currentItem[0].image_path;
    if (req.file) {
      image_path = `http://localhost:5000/images/${req.file.filename}`;
    }

    const result = await db.execute(
      `UPDATE items SET 
        name = ?,
        category = ?,
        unit_of_measurement = ?,
        min_stock_level = ?,
        max_stock_level = ?,
        image_path = ?
      WHERE id = ?`,
      [
        name ?? null,
        category ?? null,
        unit_of_measurement ?? null,
        min_stock_level ?? null,
        max_stock_level ?? null,
        image_path,
        itemId
      ]
    );

    console.log(`Updated item ID ${itemId}: ${name}, ${category}, ${image_path}`);
    res.status(200).json({ success: true, message: "Item updated successfully", result });
  } catch (e) {
    console.error("DB update error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

// Search items
router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ success: false, message: "Search query must be at least 2 characters" });
    }

    const [rows] = await db.execute(
      "SELECT * FROM items WHERE name LIKE ? OR category LIKE ? LIMIT 10",
      [`%${query}%`, `%${query}%`]
    );

    res.status(200).json({ success: true, message: "Search completed", result: rows });
  } catch (e) {
    console.error("Search error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put("/adjust/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const { type, quantity, notes } = req.body;

    if (!type || !quantity || !notes) {
      return res.status(400).json({ success: false, message: "Type, quantity, and notes are required" });
    }

    const [currentItem] = await db.execute(
      "SELECT * FROM items WHERE id = ?",
      [itemId]
    );

    if (currentItem.length === 0) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    const item = currentItem[0];
    let newCurrentStock = parseInt(item.current_stock || 0);
    let newMinStockLevel = parseInt(item.min_stock_level || 0);
    const adjustmentQuantity = parseInt(quantity);

    if (type === 'add') {
      newCurrentStock += adjustmentQuantity;
      newMinStockLevel += adjustmentQuantity;
    } else if (type === 'subtract') {
      newCurrentStock -= adjustmentQuantity;
      if (newCurrentStock < 0) {
        newCurrentStock = 0;
      }
      newMinStockLevel -= adjustmentQuantity;
      if (newMinStockLevel < 0) {
        newMinStockLevel = 0;
      }
    }

    await db.execute(
      "UPDATE items SET current_stock = ?, min_stock_level = ? WHERE id = ?",
      [newCurrentStock, newMinStockLevel, itemId]
    );

    console.log(`Stock adjustment for item ${itemId}: Type=${type}, Quantity=${quantity}, Old Stock=${item.current_stock || 0}, New Stock=${newCurrentStock}, Notes=${notes}`);

    res.status(200).json({ 
      success: true, 
      message: "Stock adjusted successfully",
      result: {
        itemId,
        type,
        quantity,
        notes,
        newCurrentStock,
        newMinStockLevel,
        oldStock: item.current_stock || 0
      }
    });
  } catch (e) {
    console.error("Stock adjustment error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
