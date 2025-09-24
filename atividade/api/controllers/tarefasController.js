// api/controllers/tarefasController.js
import { v4 as uuidv4 } from 'uuid';
import { Tarefa } from '../models/Tarefa.js';

// armazenamento em memória (simples)
const db = {
  tarefas: []
};

export const criarTarefa = (req, res, next) => {
  try {
    Tarefa.validateCreate(req.body);
    const objectId = uuidv4();
    const tarefa = new Tarefa({
      objectId,
      descricao: req.body.descricao.trim(),
      concluida: req.body.concluida ?? false
    });
    db.tarefas.push(tarefa);
    return res.status(201).json(tarefa);
  } catch (err) {
    return next(err);
  }
};

export const listarTarefas = (_req, res) => {
  return res.json(db.tarefas);
};

export const obterTarefa = (req, res) => {
  const tarefa = db.tarefas.find(t => t.objectId === req.params.objectId);
  if (!tarefa) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }
  return res.json(tarefa);
};

export const atualizarTarefa = (req, res, next) => {
  try {
    const idx = db.tarefas.findIndex(t => t.objectId === req.params.objectId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    Tarefa.validateUpdate(req.body);
    const atual = db.tarefas[idx];
    if (req.body.descricao !== undefined) atual.descricao = req.body.descricao.trim();
    if (req.body.concluida !== undefined) atual.concluida = req.body.concluida;
    atual.updatedAt = new Date().toISOString();
    db.tarefas[idx] = atual;
    return res.json(atual);
  } catch (err) {
    return next(err);
  }
};

export const removerTarefa = (req, res) => {
  const idx = db.tarefas.findIndex(t => t.objectId === req.params.objectId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }
  db.tarefas.splice(idx, 1);
  // 204: sucesso sem conteúdo
  return res.status(204).send();
};

// exporta o "db" só para testes manuais se precisar
export const __memDb = db;
