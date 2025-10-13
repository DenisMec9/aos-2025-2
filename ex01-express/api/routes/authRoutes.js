// ex01-express/api/routes/authRoutes.js

import { Router } from 'express';

import { signup, login, logout } from '../../controllers/authController.js'; 

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout); 

export default router;