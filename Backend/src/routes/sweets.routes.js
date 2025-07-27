import express from 'express';
import * as sweetController from '../controllers/sweetController.js';
import { auth, isAdmin } from '../middlewares/auth.js';

const router = express.Router();


// Admin-only routes
router.post('/', auth, isAdmin, sweetController.createSweet);

export default router;