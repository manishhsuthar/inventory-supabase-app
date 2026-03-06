import express from 'express';
import { getPurchases, addPurchase } from '../controllers/purchaseController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(getPurchases));
router.post('/', asyncHandler(addPurchase));

export default router;
