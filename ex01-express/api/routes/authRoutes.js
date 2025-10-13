// ex01-express/api/routes/authRoutes.js

import { Router } from 'express';
// Importa as funções específicas do controller
import { signup, login, logout } from '../../controllers/authController.js'; // Adicione a função logout

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout); 

export default router;