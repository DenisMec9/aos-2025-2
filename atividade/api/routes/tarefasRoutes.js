// api/routes/tarefasRoutes.js
import { Router } from 'express';
import {
  criarTarefa,
  listarTarefas,
  obterTarefa,
  atualizarTarefa,
  removerTarefa
} from '../controllers/tarefasController.js';

const router = Router();

router.post('/', criarTarefa);
router.get('/', listarTarefas);
router.get('/:objectId', obterTarefa);
router.put('/:objectId', atualizarTarefa);
router.delete('/:objectId', removerTarefa);

export default router;
