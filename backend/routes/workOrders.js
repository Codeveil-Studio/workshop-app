import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Create a new work order with items, work types, and photos
router.post('/', async (req, res) => {
  const body = req.body || {};
  const {
    created_by,
    customer = {},
    vehicle = {},
    status = 'requested',
    activity = {},
    quote = {},
    items = [],
    work_types = [],
    photos = [],
    paint_codes = [],
  } = body;

  console.log('📦 Incoming Work Order Payload:', JSON.stringify(body, null, 2));

  if (!created_by) {
    console.warn('⚠️ Missing contractor email (created_by)');
    return res.status(400).json({ success: false, error: 'created_by (contractor email) is required' });
  }

  // Normalize numbers
  const subtotal = Number(quote.subtotal || 0);
  const tax = Number(quote.tax || 0);
  const total = Number(quote.total || 0);

  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✅ DB connection established');
    await conn.beginTransaction();

    // Insert main work order
    console.log('📝 Inserting into work_orders...');
    const [woResult] = await conn.query(
      `INSERT INTO work_orders (
        created_by,
        customer_name,
        customer_phone,
        vehicle_make,
        vehicle_model,
        vehicle_year,
        vehicle_vin,
        vehicle_odometer,
        vehicle_trim,
        status,
        activity_type,
        activity_description,
        repairs_json,
        paint_codes_json,
        quote_subtotal,
        quote_tax,
        quote_total
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?)`,
      [
        created_by,
        customer.name || null,
        customer.phone || null,
        vehicle.make || null,
        vehicle.model || null,
        vehicle.year ? Number(vehicle.year) : null,
        vehicle.vin || null,
        vehicle.odometer ? Number(vehicle.odometer) : null,
        vehicle.trim || null,
        status,
        activity.type || 'Inspection',
        activity.description || null,
        activity.repairs ? JSON.stringify(activity.repairs) : null,
        paint_codes && paint_codes.length ? JSON.stringify(paint_codes) : null,
        subtotal,
        tax,
        total,
      ]
    );

    const workOrderId = woResult.insertId;
    console.log(`✅ Work order inserted. ID: ${workOrderId}`);

    // Insert items (parts/labour)
    if (Array.isArray(items) && items.length > 0) {
      console.log(`🧩 Inserting ${items.length} items...`);
      const placeholders = items.map(() => '(?,?,?,?)').join(',');
      const values = [];
      for (const it of items) {
        values.push(workOrderId);
        values.push(it.description || 'Item');
        values.push(Number(it.qty || 1));
        values.push(Number(it.unit_price || 0));
      }
      await conn.query(
        `INSERT INTO work_order_items (work_order_id, description, qty, unit_price) VALUES ${placeholders}`,
        values
      );
      console.log('✅ Items inserted');
    }

    // Insert selected work types
    if (Array.isArray(work_types) && work_types.length > 0) {
      console.log(`⚙️ Inserting ${work_types.length} work types...`);
      const placeholders = work_types.map(() => '(?,?,?)').join(',');
      const values = [];
      for (const wt of work_types) {
        values.push(workOrderId);
        values.push(wt.id || 'unknown');
        values.push(wt.title || wt.id || '');
      }
      await conn.query(
        `INSERT INTO work_order_work_types (work_order_id, work_type_id, work_type_title) VALUES ${placeholders}`,
        values
      );
      console.log('✅ Work types inserted');
    }

    // Insert photos (meta only: url/name)
    if (Array.isArray(photos) && photos.length > 0) {
      console.log(`🖼️ Inserting ${photos.length} photos...`);
      const placeholders = photos.map(() => '(?,?,?)').join(',');
      const values = [];
      for (const ph of photos) {
        values.push(workOrderId);
        values.push(ph.url || null);
        values.push(ph.name || null);
      }
      await conn.query(
        `INSERT INTO work_order_photos (work_order_id, url, name) VALUES ${placeholders}`,
        values
      );
      console.log('✅ Photos inserted');
    }

    await conn.commit();
    console.log(`🎉 Work order #${workOrderId} committed successfully`);
    res.json({ success: true, id: workOrderId });
  } catch (e) {
    if (conn) await conn.rollback();
    console.error('❌ Work order insert error:', e);
    res.status(500).json({ success: false, error: e.message });
  } finally {
    if (conn) {
      conn.release();
      console.log('🔚 Connection released');
    }
  }
});

// Fetch work orders, optionally filtered by status
router.get('/', async (req, res) => {
  const { status } = req.query;
  let sql = `SELECT id, customer_name, vehicle_make, vehicle_model, vehicle_year, status, quote_total, updated_at, created_at FROM work_orders`;
  const params = [];
  if (status) {
    sql += ` WHERE LOWER(TRIM(status)) = ?`;
    params.push(String(status).toLowerCase().trim());
  }

  try {
    const [rows] = await pool.query(sql, params);
    const orders = rows.map((r) => {
      const year = r.vehicle_year || '';
      const make = r.vehicle_make || '';
      const model = r.vehicle_model || '';
      const customer = r.customer_name || '';
      const title = `${year ? year + ' ' : ''}${make} ${model}`.trim() + (customer ? ` - ${customer}` : '');

      const statusMap = {
        'requested': 'Requested',
        'in-progress': 'In Process',
        'in_progress': 'In Process',
        'in progress': 'In Process',
        'completed': 'Completed',
        'pending': 'Pending',
        'accepted': 'In Process',
      };
      const displayStatus = statusMap[(r.status || '').toLowerCase()] || r.status || 'Requested';

      return {
        id: r.id,
        title,
        charges: Number(r.quote_total || 0),
        status: displayStatus,
        updatedAt: r.updated_at || r.created_at || new Date(),
      };
    });

    res.json({ success: true, orders });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Fetch full details of a single work order
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: 'Invalid id' });
  try {
    const [orders] = await pool.query(`SELECT * FROM work_orders WHERE id = ?`, [id]);
    if (!orders.length) return res.status(404).json({ success: false, error: 'Not found' });
    const order = orders[0];
    const [items] = await pool.query(`SELECT * FROM work_order_items WHERE work_order_id = ?`, [id]);
    const [workTypes] = await pool.query(`SELECT * FROM work_order_work_types WHERE work_order_id = ?`, [id]);
    const [photos] = await pool.query(`SELECT * FROM work_order_photos WHERE work_order_id = ?`, [id]);
    res.json({ success: true, order, items, work_types: workTypes, photos });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Update status of a work order
router.put('/:id/status', async (req, res) => {
  const id = Number(req.params.id);
  const { status, accepted_by } = req.body || {};
  if (!id) return res.status(400).json({ success: false, error: 'Invalid id' });
  if (!status) return res.status(400).json({ success: false, error: 'Missing status' });
  try {
    // If accepted_by is provided and status is in_progress, persist it.
    let sql = `UPDATE work_orders SET status = ?, updated_at = NOW()`;
    const params = [status, id];
    if (accepted_by && String(status).toLowerCase().replace(/\s+/g, '_') === 'in_progress') {
      sql = `UPDATE work_orders SET status = ?, accepted_by = ?, updated_at = NOW() WHERE id = ?`;
      params.splice(1, 0, accepted_by);
    } else {
      sql = `UPDATE work_orders SET status = ?, updated_at = NOW() WHERE id = ?`;
    }

    const [result] = await pool.query(sql, params);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Delete a work order (and its related records)
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: 'Invalid id' });
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    await conn.query(`DELETE FROM work_order_photos WHERE work_order_id = ?`, [id]);
    await conn.query(`DELETE FROM work_order_work_types WHERE work_order_id = ?`, [id]);
    await conn.query(`DELETE FROM work_order_items WHERE work_order_id = ?`, [id]);
    const [result] = await conn.query(`DELETE FROM work_orders WHERE id = ?`, [id]);
    await conn.commit();
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true });
  } catch (e) {
    if (conn) await conn.rollback();
    res.status(500).json({ success: false, error: e.message });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
