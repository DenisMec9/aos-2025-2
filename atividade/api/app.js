// api/app.js
import express from 'express';
import tarefasRoutes from './routes/tarefasRoutes.js';

const app = express();
app.use(express.json());

// healthcheck
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'API de Tarefas (memória) — online' });
});

// 👉 monta as rotas
app.use('/tarefas', tarefasRoutes);

// só em ambiente local
if (process.env.NODE_ENV !== 'vercel') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// export para Vercel
export default app;

