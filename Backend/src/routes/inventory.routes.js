import express from 'express';
const router = express.Router();
import {
    purchaseSweet,restockSweet
} from '../controllers/inventoryController.js';
import { auth ,isAdmin} from '../middlewares/auth';

// ✅ Log to verify imports
console.log({ purchaseSweet});

// ✅ Routes
router.post('/:id/purchase', auth, purchaseSweet);
router.post('/:id/restock', auth, isAdmin, restockSweet);


export default router;