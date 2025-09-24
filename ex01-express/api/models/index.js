import "dotenv/config";             // <-- ADICIONE ESTA LINHA
import { Sequelize } from "sequelize";
import getUser from "./user.js";
import getMessage from "./message.js";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("DATABASE_URL NÃO DEFINIDA (verifique ex01-express/.env)");
  process.exit(1);
}

export const sequelize = new Sequelize(url, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true } },
});

const models = {
  User: getUser(sequelize, Sequelize),
  Message: getMessage(sequelize, Sequelize),
};

Object.values(models).forEach((m) => m.associate && m.associate(models));

export default models;
