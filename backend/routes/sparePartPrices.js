import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// List all spare parts prices
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, price FROM spare_parts_price ORDER BY id DESC');
    res.json({ success: true, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Create a spare part price
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

    const [result] = await pool.query('INSERT INTO spare_parts_price (name, price) VALUES (?, ?)', [name, priceNum]);
    const id = result.insertId;
    res.status(201).json({ success: true, item: { id, name, price: priceNum } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Update a spare part price
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const name = String(req.body?.name || '').trim();
    const priceRaw = req.body?.price;
    const priceNum = Number(priceRaw);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid id' });
    }
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return res.status(400).json({ success: false, error: 'Price must be a non-negative number' });
    }

    const [result] = await pool.query('UPDATE spare_parts_price SET name = ?, price = ? WHERE id = ?', [name, priceNum, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, item: { id, name, price: priceNum } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Delete a spare part price
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid id' });
    }
    const [result] = await pool.query('DELETE FROM spare_parts_price WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;