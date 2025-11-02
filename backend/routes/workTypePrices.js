import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// List all work type prices
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, price FROM work_type_price ORDER BY id DESC');
    res.json({ success: true, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Create a work type price
router.post('/', async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const priceRaw = req.body?.price;
    const priceNum = Number(priceRaw);

    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return res.status(400).json({ success: false, error: 'Price must be a non-negative number' });
    }

    const [result] = await pool.query('INSERT INTO work_type_price (name, price) VALUES (?, ?)', [name, priceNum]);
    const id = result.insertId;
    res.status(201).json({ success: true, item: { id, name, price: priceNum } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Delete a work type price
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid id' });
    }
    const [result] = await pool.query('DELETE FROM work_type_price WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;