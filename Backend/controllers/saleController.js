import { pool } from '../config/db.js';

export const getSales = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sales ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addSale = async (req, res) => {
  try {
    const { product_id, quantity, unit_price, customer_name, date } = req.body;
    const totalAmount = Number(quantity) * Number(unit_price);
    const result = await pool.query(
      `INSERT INTO sales (product_id, quantity, unit_price, total_amount, customer_name, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [product_id, quantity, unit_price, totalAmount, customer_name || '', date],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
