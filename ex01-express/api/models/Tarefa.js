// api/models/Tarefa.js
import { DataTypes } from 'sequelize';

const getTarefa = (sequelize) => {
  const Tarefa = sequelize.define('Tarefa', {
    descricao: {
      type: DataTypes.STRING,
      allowNull: false, // Campo obrigatório
    },
    concluida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Valor padrão é 'false'
    },
  });

  return Tarefa;
};

export default getTarefa;