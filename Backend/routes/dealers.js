import express from 'express';
import { getDealers, addDealer } from '../controllers/dealerController.js';

const router = express.Router();

router.get('/', getDealers);
router.post('/', addDealer);

export default router;
