import express from 'express';
import { getSales, addSale } from '../controllers/saleController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(getSales));
router.post('/', asyncHandler(addSale));

export default router;
