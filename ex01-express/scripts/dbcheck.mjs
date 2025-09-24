import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true } },
});

try {
  await sequelize.authenticate();
  console.log("✅ Conectou no Neon.");
  process.exit(0);
} catch (e) {
  console.error("❌ Falhou:", e.message);
  process.exit(1);
}
