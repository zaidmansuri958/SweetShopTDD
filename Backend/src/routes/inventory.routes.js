import express from 'express';
const router = express.Router();
import {
    purchaseSweet
} from '../controllers/inventoryController.js';
import { auth } from '../middlewares/auth';

// ✅ Log to verify imports
console.log({ purchaseSweet});

// ✅ Routes
router.post('/:id/purchase', auth, purchaseSweet);

export default router;