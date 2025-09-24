// ex01-express/api/index.js
import "dotenv/config";
import cors from "cors";
import express from "express";
import models, { sequelize } from "./models/index.js";

// importe as rotas corretas (confira os nomes dos arquivos)
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";

// 1) crie o app ANTES de usar app.use
const app = express();
app.set("trust proxy", true);

// 2) middlewares
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// log simples (opcional)
app.use((req, _res, next) => { 
  console.log(`${req.method} ${req.path}`); 
  next(); 
});

// injeta models no req
app.use((req, _res, next) => { 
  req.context = { models };
  next(); 
});

// 3) rotas
app.use("/user", userRouter);
app.use("/message", messageRouter);

// 4) sobe servidor + conecta DB
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // { alter: true } se precisar ajustar schema
    app.listen(port, () => console.log(`API on http://localhost:${port}`));
  } catch (e) {
    console.error("Erro ao iniciar:", e);
    process.exit(1);
  }
};

start();

// 5) handler de erro (por último)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});