import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// POST /api/activity-types - Create a new activity type
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Valid activity type name is required' });
    }

    const cleanName = name.trim();

    // Insert activity type; handle duplicate name gracefully and schema differences
    try {
      // Detect if description column exists in activity_types
      const [descCol] = await pool.execute("SHOW COLUMNS FROM activity_types LIKE 'description'");
      const hasDescription = Array.isArray(descCol) && descCol.length > 0;

      const sql = hasDescription
        ? 'INSERT INTO activity_types (name, description) VALUES (?, ?)'
        : 'INSERT INTO activity_types (name) VALUES (?)';
      const params = hasDescription ? [cleanName, description || null] : [cleanName];

      const [result] = await pool.execute(sql, params);

      return res.status(201).json({
        success: true,
        message: `Activity type "${cleanName}" added successfully`,
        activity: { id: result.insertId, name: cleanName, description: hasDescription ? (description || null) : undefined }
      });
    } catch (e) {
      // Duplicate name (unique key) error code for MySQL is ER_DUP_ENTRY (1062)
      if (e && (e.code === 'ER_DUP_ENTRY' || e.errno === 1062)) {
        return res.status(409).json({ success: false, error: 'Activity type with this name already exists' });
      }
      throw e;
    }
  } catch (error) {
    console.error('Error adding activity type:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
// DELETE /api/activity-types/:id - Delete an activity type (and cascades its item types)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const activityId = Number(id);
    if (!activityId || Number.isNaN(activityId)) {
      return res.status(400).json({ success: false, error: 'Valid activity type ID is required' });
    }

    // Fetch for message
    const [rows] = await pool.execute('SELECT id, name FROM activity_types WHERE id = ?', [activityId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Activity type not found' });
    }

    const name = rows[0].name;
    const [result] = await pool.execute('DELETE FROM activity_types WHERE id = ?', [activityId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Activity type not found' });
    }

    // ON DELETE CASCADE will remove activity_item_types entries automatically when FK is configured
    return res.json({ success: true, message: `Activity type "${name}" deleted successfully` });
  } catch (error) {
    console.error('Error deleting activity type:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});