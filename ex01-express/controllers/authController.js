import jwt from 'jsonwebtoken';
import { UniqueConstraintError } from 'sequelize';

// Função de Registo (Signup)
export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Aceder ao modelo através do contexto, como no resto do seu projeto
    const user = await req.context.models.User.create({ username, password });
    res.status(201).json({ message: 'Utilizador criado com sucesso!', userId: user.id });
  } catch (error) {
    // Verifica se o erro é uma violação de restrição única
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ error: 'Este nome de utilizador já está em uso.' });
    }
    
    // Adiciona um log do erro para facilitar a depuração
    console.error('Erro no signup:', error);
    res.status(500).json({ error: 'Erro ao criar o utilizador.' });
  }
};

// Função de Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Aceder ao modelo através do contexto
    const user = await req.context.models.User.findOne({ where: { username } });

    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Utilize uma variável de ambiente para o segredo do JWT em produção!
    const token = jwt.sign({ id: user.id }, 'seuSegredoJWT', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
     // Adiciona um log do erro para facilitar a depuração
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};