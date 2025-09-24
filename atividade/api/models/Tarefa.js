// api/models/Tarefa.js
export class Tarefa {
  constructor({ objectId, descricao, concluida = false, createdAt, updatedAt }) {
    this.objectId = objectId;
    this.descricao = descricao;
    this.concluida = Boolean(concluida);
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  static validateCreate(body) {
    if (!body || typeof body.descricao !== 'string' || !body.descricao.trim()) {
      const err = new Error('Campo "descricao" é obrigatório e deve ser string não vazia.');
      err.status = 400;
      throw err;
    }
  }

  static validateUpdate(body) {
    if (!body || (body.descricao === undefined && body.concluida === undefined)) {
      const err = new Error('Envie pelo menos um dos campos: "descricao" ou "concluida".');
      err.status = 400;
      throw err;
    }
    if (body.descricao !== undefined && (typeof body.descricao !== 'string' || !body.descricao.trim())) {
      const err = new Error('"descricao" deve ser string não vazia.');
      err.status = 400;
      throw err;
    }
    if (body.concluida !== undefined && typeof body.concluida !== 'boolean') {
      const err = new Error('"concluida" deve ser boolean.');
      err.status = 400;
      throw err;
    }
  }
}
