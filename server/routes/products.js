import express from 'express';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', getProducts);
router.post('/', requireAuth, requireAdmin, createProduct);
router.patch('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;

