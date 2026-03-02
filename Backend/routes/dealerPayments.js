import express from 'express';
import { getDealerPayments, addDealerPayment } from '../controllers/dealerPaymentController.js';

const router = express.Router();

router.get('/', getDealerPayments);
router.post('/', addDealerPayment);

export default router;
