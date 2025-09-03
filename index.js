// index.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection (update with your Hostinger DB credentials)
const db = mysql.createConnection({
  host: process.env.DB_HOST,     // e.g. "mysql.hostinger.com"
  user: process.env.DB_USER,     // your db username
  password: process.env.DB_PASS, // your db password
  database: process.env.DB_NAME, // your db name
});

// Test connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// ---------------- CRUD ROUTES ---------------- //

// 📌 READ all inventory
app.get("/inventory", (req, res) => {
  const sql = "SELECT * FROM inventory WHERE is_deleted = 0";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 📌 READ single item
app.get("/inventory/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM inventory WHERE inventory_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// 📌 CREATE new item
app.post("/inventory", (req, res) => {
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

// 📌 UPDATE item
app.put("/inventory/:id", (req, res) => {
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

// 📌 DELETE item (soft delete)
app.delete("/inventory/:id", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE inventory SET is_deleted = 1 WHERE inventory_id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item deleted successfully!" });
  });
});

// ---------------- START SERVER ---------------- //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
