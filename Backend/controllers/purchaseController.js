import { pool } from '../config/db.js';

export const getPurchases = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM purchases ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addPurchase = async (req, res) => {
  try {
    const { product_id, dealer_id, quantity, unit_price, date } = req.body;
    const totalAmount = Number(quantity) * Number(unit_price);
    const result = await pool.query(
      `INSERT INTO purchases (product_id, dealer_id, quantity, unit_price, total_amount, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [product_id, dealer_id, quantity, unit_price, totalAmount, date],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
