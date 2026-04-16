import express from 'express';
import { registerUser, loginUser, getProfile, clerkSync } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/clerk-sync', clerkSync);
router.get('/profile', protect, getProfile);

export default router;
