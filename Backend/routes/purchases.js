import express from 'express';
import { getPurchases, addPurchase } from '../controllers/purchaseController.js';

const router = express.Router();

router.get('/', getPurchases);
router.post('/', addPurchase);

export default router;
