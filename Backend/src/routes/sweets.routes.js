import express from 'express';
import * as sweetController from '../controllers/sweetController.js';
import { auth, isAdmin } from '../middlewares/auth.js';

const router = express.Router();


// Admin-only routes
router.post('/', auth, isAdmin, sweetController.createSweet);
router.put('/:id', auth, isAdmin, sweetController.updateSweet);
router.delete('/:id', auth, isAdmin, sweetController.deleteSweet);


// Public routes
router.get('/', sweetController.getAllSweets);
router.get('/search', sweetController.searchSweets);

export default router;