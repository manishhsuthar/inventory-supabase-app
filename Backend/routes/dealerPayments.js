import express from 'express';
import { getDealerPayments, addDealerPayment } from '../controllers/dealerPaymentController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(getDealerPayments));
router.post('/', asyncHandler(addDealerPayment));

export default router;
