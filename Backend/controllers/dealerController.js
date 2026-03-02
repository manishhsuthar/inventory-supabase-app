import { pool } from '../config/db.js';

export const getDealers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dealers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addDealer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const result = await pool.query(
      `INSERT INTO dealers (name, phone, address)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, phone || '', address || ''],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
