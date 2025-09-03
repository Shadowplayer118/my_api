// routes/inventory.js
const express = require("express");
const router = express.Router();

// ✅ READ all inventory
router.get("/", (req, res) => {
  const db = req.app.get("db");
  const sql = "SELECT * FROM inventory WHERE is_deleted = 0";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ READ single item
router.get("/:id", (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;
  const sql = "SELECT * FROM inventory WHERE inventory_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// ✅ CREATE new item
router.post("/", (req, res) => {
  const db = req.app.get("db");
  const data = req.body;
  const sql = `
    INSERT INTO inventory 
    (item_number, item_code, brand, desc_1, desc_2, desc_3, desc_4, fixed_price, retail_price, units, tsv, area, date_created, last_updated, is_deleted, location, old_id, rep_id, category, img, thresh_hold) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 0, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.item_number,
    data.item_code,
    data.brand,
    data.desc_1,
    data.desc_2,
    data.desc_3,
    data.desc_4,
    data.fixed_price,
    data.retail_price,
    data.units,
    data.tsv,
    data.area,
    data.location,
    data.old_id,
    data.rep_id,
    data.category,
    data.img,
    data.thresh_hold,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item added successfully!", id: result.insertId });
  });
});

// ✅ UPDATE item
router.put("/:id", (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;
  const data = req.body;
  const sql = `
    UPDATE inventory 
    SET item_number=?, item_code=?, brand=?, desc_1=?, desc_2=?, desc_3=?, desc_4=?, fixed_price=?, retail_price=?, units=?, tsv=?, area=?, last_updated=NOW(), location=?, old_id=?, rep_id=?, category=?, img=?, thresh_hold=? 
    WHERE inventory_id=?`;
  const values = [
    data.item_number,
    data.item_code,
    data.brand,
    data.desc_1,
    data.desc_2,
    data.desc_3,
    data.desc_4,
    data.fixed_price,
    data.retail_price,
    data.units,
    data.tsv,
    data.area,
    data.location,
    data.old_id,
    data.rep_id,
    data.category,
    data.img,
    data.thresh_hold,
    id,
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item updated successfully!" });
  });
});

// ✅ DELETE item (soft delete)
router.delete("/:id", (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;
  const sql = "UPDATE inventory SET is_deleted = 1 WHERE inventory_id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item deleted successfully!" });
  });
});

module.exports = router;
