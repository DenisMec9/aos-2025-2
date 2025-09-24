import Sequelize from "sequelize";
import getTarefaModel from "./Tarefa";

// !!! Simular a conexão com um banco de dados em memória !!! \\
const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: ":memory:",
  logging: false, 
});

const models = {
  Tarefa: getTarefaModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

const main = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Banco de dados sincronizado.");
    } catch (error) {
        console.error("Erro ao sincronizar o banco de dados:", error);
    }
};

main();

export { sequelize };

export default models;