// ex01-express/controllers/authController.js

const { User } = require('../api/models');
const jwt = require('jsonwebtoken');

// Função de Registro (Signup)
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o usuário.' });
  }
};

// Função de Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id }, 'seuSegredoJWT', {
      expiresIn: '1h', // O token expira em 1 hora
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};