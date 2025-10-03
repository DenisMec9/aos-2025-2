// denismec9/aos-2025-2/aos-2025-2-main/atividade/api/routes/tarefasRoutes.js

const express = require('express');
const router = express.Router();
const tarefasController = require('../controllers/tarefasController');

// ...

// Rota para criar uma nova tarefa (POST /tarefas)
router.post('/', tarefasController.createTarefa);

// ...

module.exports = router;