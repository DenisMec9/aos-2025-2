// ex01-express/api/routes/tarefasRoutes.js

import { Router } from 'express';
import * as tarefasController from '../../controllers/tarefasController.js';

const router = Router();

router.get('/', tarefasController.getAllTarefas);
router.post('/', tarefasController.createTarefa);
router.get('/:id', tarefasController.getTarefaById);
router.put('/:id', tarefasController.updateTarefa);
router.delete('/:id', tarefasController.deleteTarefa);

export default router;