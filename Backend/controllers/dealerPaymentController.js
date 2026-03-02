import { pool } from '../config/db.js';

export const getDealerPayments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dealer_payments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addDealerPayment = async (req, res) => {
  try {
    const { dealer_id, amount, date, note } = req.body;
    const result = await pool.query(
      `INSERT INTO dealer_payments (dealer_id, amount, date, note)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [dealer_id, amount, date, note || ''],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
