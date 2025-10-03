// denismec9/aos-2025-2/aos-2025-2-main/atividade/api/controllers/tarefasController.js

const Tarefa = require('../models/Tarefa');

// ... outras funções

exports.createTarefa = async (req, res) => {
  try {
    const { descricao, concluida } = req.body;
    const novaTarefa = await Tarefa.create({ descricao, concluida });
    res.status(201).json(novaTarefa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ...