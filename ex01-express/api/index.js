// api/index.js
import "dotenv/config";
import cors from "cors";
import express from "express";
import models, { sequelize } from "./models/index.js";
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";

const app = express();
app.set("trust proxy", true);

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => { 
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use((req, _res, next) => {
  req.context = { models };
  next();
});

app.get("/", (_req, res) => {
  res.send("Servidor funcionando");
});

app.use("/user", userRouter);
app.use("/message", messageRouter);

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

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});
