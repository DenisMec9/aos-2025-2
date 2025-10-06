import "dotenv/config";
import cors from "cors";
import express from "express";
import models, { sequelize } from "./models/index.js";

// Importações para Autenticação
import authRoutes from "./routes/authRoutes.js"; // Importa as rotas de autenticação
import authMiddleware from "./middleware/authMiddleware.js"; // Importa o middleware de autenticação

// Suas rotas existentes
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";
import tasks from "./routes/tarefasRoutes.js";

const app = express();
app.set("trust proxy", true);

// 1. Middlewares de configuração inicial
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Middleware de log (opcional)
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 3. Middleware CRÍTICO para adicionar o contexto
// Esta linha DEVE vir antes de QUALQUER rota
app.use((req, _res, next) => {
  req.context = { models };
  next();
});

// 4. Definição das Rotas
app.get("/", (_req, res) => {
  res.send("Servidor funcionando");
});

// Rotas públicas (não exigem token, mas agora têm acesso ao req.context)
app.use("/auth", authRoutes);

// Rotas protegidas (exigem token JWT e também têm acesso ao req.context)
app.use("/user", authMiddleware, userRouter);
app.use("/message", authMiddleware, messageRouter);
app.use("/tasks", authMiddleware, tasks);

// O resto do seu arquivo para inicialização do banco de dados...
let dbReadyPromise;
async function ensureDb() {
  if (!dbReadyPromise) {
    dbReadyPromise = (async () => {
      await sequelize.authenticate();
      await sequelize.sync(); // opcional: { alter: true }
    })();
  }
  return dbReadyPromise;
}

export default async function handler(req, res) {
  try {
    await ensureDb();
    return app(req, res);
  } catch (e) {
    console.error("Erro ao iniciar:", e);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

// Middleware de tratamento de erro (deve ser o último)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});
