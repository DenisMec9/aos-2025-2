// ex01-express/controllers/authController.js

import jwt from 'jsonwebtoken';

// Função de Registro (Signup)
export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Acessando o model pelo contexto, como no resto do seu projeto
    const user = await req.context.models.User.create({ username, password });
    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
  } catch (error) {
    // Adiciona um log do erro para facilitar a depuração
    console.error('Erro no signup:', error);
    res.status(500).json({ error: 'Erro ao criar o usuário.' });
  }
};

// Função de Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Acessando o model pelo contexto
    const user = await req.context.models.User.findOne({ where: { username } });

    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Use uma variável de ambiente para o segredo do JWT em produção!
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