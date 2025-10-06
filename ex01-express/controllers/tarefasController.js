// ex01-express/controllers/tarefasController.js

export const getAllTarefas = async (req, res) => {
  try {
    const tarefas = await req.context.models.Tarefa.findAll();
    res.json(tarefas);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
};

export const createTarefa = async (req, res) => {
  try {
    const tarefa = await req.context.models.Tarefa.create(req.body);
    res.status(201).json(tarefa);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

export const getTarefaById = async (req, res) => {
  try {
    const tarefa = await req.context.models.Tarefa.findByPk(req.params.id);
    if (tarefa) {
      res.json(tarefa);
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    console.error("Erro ao buscar tarefa por ID:", error);
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
};

export const updateTarefa = async (req, res) => {
  try {
    const [updated] = await req.context.models.Tarefa.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedTarefa = await req.context.models.Tarefa.findByPk(req.params.id);
      res.json(updatedTarefa);
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};

export const deleteTarefa = async (req, res) => {
  try {
    const deleted = await req.context.models.Tarefa.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
};