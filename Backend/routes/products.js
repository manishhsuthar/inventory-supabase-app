import express from 'express';
import { getProducts, addProduct } from '../controllers/productController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(getProducts));
router.post('/', asyncHandler(addProduct));

export default router;
