import express from 'express';
import { getDealers, addDealer } from '../controllers/dealerController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(getDealers));
router.post('/', asyncHandler(addDealer));

export default router;
