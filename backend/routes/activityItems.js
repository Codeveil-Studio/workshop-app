import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/activity-items - Get all activity items grouped by activity type
router.get('/', async (req, res) => {
  try {
    // Detect if price column exists on activity_item_types
    const [priceCol] = await pool.execute("SHOW COLUMNS FROM activity_item_types LIKE 'price'");
    const hasPrice = Array.isArray(priceCol) && priceCol.length > 0;

    const selectSql = hasPrice
      ? `
      SELECT 
        at.id as activity_id,
        at.name as activity_name,
        ait.id as item_id,
        ait.item_name,
        ait.description,
        ait.price
      FROM activity_types at
      LEFT JOIN activity_item_types ait ON at.id = ait.activity_id
      ORDER BY at.id, ait.item_name
    `
      : `
      SELECT 
        at.id as activity_id,
        at.name as activity_name,
        ait.id as item_id,
        ait.item_name,
        ait.description
      FROM activity_types at
      LEFT JOIN activity_item_types ait ON at.id = ait.activity_id
      ORDER BY at.id, ait.item_name
    `;

    const [rows] = await pool.execute(selectSql);

    // Group items by activity type
    const groupedData = {};
    
    rows.forEach(row => {
      const activityName = row.activity_name;
      
      if (!groupedData[activityName]) {
        groupedData[activityName] = {
          activity_id: row.activity_id,
          activity_name: activityName,
          items: []
        };
      }
      
      // Only add item if it exists (LEFT JOIN might return null items)
      if (row.item_id) {
        const item = {
          id: row.item_id,
          item_name: row.item_name,
          description: row.description
        };
        if (typeof row.price !== 'undefined') {
          item.price = row.price;
        }
        groupedData[activityName].items.push(item);
      }
    });

    res.json({ 
      success: true, 
      data: Object.values(groupedData) 
    });
  } catch (error) {
    console.error('Error fetching activity items:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// POST /api/activity-items - Add a new activity item
router.post('/', async (req, res) => {
  try {
    const { activity_id, item_name, description, price } = req.body;

    if (!activity_id || !item_name) {
      return res.status(400).json({ 
        success: false, 
        error: 'activity_id and item_name are required' 
      });
    }

    // Verify activity_id exists
    const [activityCheck] = await pool.execute(
      'SELECT id, name FROM activity_types WHERE id = ?',
      [activity_id]
    );

    if (activityCheck.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid activity_id' 
      });
    }

    // Detect price column existence
    const [priceCol] = await pool.execute("SHOW COLUMNS FROM activity_item_types LIKE 'price'");
    const hasPrice = Array.isArray(priceCol) && priceCol.length > 0;

    if (hasPrice) {
      // Validate price: must be provided and numeric
      const parsed = Number(price);
      if (price === undefined || price === null || Number.isNaN(parsed)) {
        return res.status(400).json({ success: false, error: 'price is required and must be a number' });
      }
    }

    // Insert new item
    const insertSql = hasPrice
      ? 'INSERT INTO activity_item_types (activity_id, item_name, description, price) VALUES (?, ?, ?, ?)'
      : 'INSERT INTO activity_item_types (activity_id, item_name, description) VALUES (?, ?, ?)';
    const insertParams = hasPrice
      ? [activity_id, item_name, description || null, Number(price)]
      : [activity_id, item_name, description || null];

    const [result] = await pool.execute(insertSql, insertParams);

    // Get the inserted item with activity name
    const selectSql = hasPrice ? `
      SELECT 
        ait.id,
        ait.item_name,
        ait.description,
        ait.price,
        at.name as activity_name
      FROM activity_item_types ait
      JOIN activity_types at ON ait.activity_id = at.id
      WHERE ait.id = ?
    ` : `
      SELECT 
        ait.id,
        ait.item_name,
        ait.description,
        at.name as activity_name
      FROM activity_item_types ait
      JOIN activity_types at ON ait.activity_id = at.id
      WHERE ait.id = ?
    `;
    const [newItem] = await pool.execute(selectSql, [result.insertId]);

    res.status(201).json({ 
      success: true, 
      message: `${newItem[0].activity_name} type added successfully`,
      item: {
        id: newItem[0].id,
        item_name: newItem[0].item_name,
        description: newItem[0].description,
        activity_name: newItem[0].activity_name,
        price: hasPrice ? newItem[0].price : undefined
      }
    });
  } catch (error) {
    console.error('Error adding activity item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// DELETE /api/activity-items/:id - Delete an activity item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid item ID is required' 
      });
    }

    // Get item details before deletion for success message
    const [itemCheck] = await pool.execute(`
      SELECT 
        ait.item_name,
        at.name as activity_name
      FROM activity_item_types ait
      JOIN activity_types at ON ait.activity_id = at.id
      WHERE ait.id = ?
    `, [id]);

    if (itemCheck.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found' 
      });
    }

    // Delete the item
    const [result] = await pool.execute(
      'DELETE FROM activity_item_types WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found' 
      });
    }

    res.json({ 
      success: true, 
      message: `${itemCheck[0].activity_name} type "${itemCheck[0].item_name}" deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting activity item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

export default router;