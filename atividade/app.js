import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tarefasRoutes from './routes/tarefasRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/tarefas', tarefasRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});