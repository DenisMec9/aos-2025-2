const User = require('../api/models/user');
const jwt = require('jsonwebtoken');

/**
 * Registra um novo usuário no sistema.
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validação para garantir que todos os campos foram enviados
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça usuário, email e senha.' });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    // Adiciona uma verificação para erro de duplicidade (e-mail ou usuário já existem)
    if (error.code === 11000) {
        return res.status(409).json({ message: 'Nome de usuário ou e-mail já existe.' });
    }
    res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
  }
};

/**
 * Autentica um usuário e retorna um token JWT.
 * Permite login com 'username' ou 'email'.
 */
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body; // 'login' pode ser username ou email

    if (!login || !password) {
      return res.status(400).json({ message: 'Por favor, forneça suas credenciais de login e senha.' });
    }

    // Procura o usuário tanto pelo username quanto pelo email.
    // A query com '$or' do MongoDB permite essa flexibilidade.
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Autenticação falhou. Usuário não encontrado.' });
    }

    // Compara a senha enviada com a senha criptografada no banco
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Autenticação falhou. Senha incorreta.' });
    }

    // Se a autenticação for bem-sucedida, gera o token JWT
    const payload = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Chave secreta do arquivo .env
      { expiresIn: '1h' }     // O token expira em 1 hora
    );

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor.', error: error.message });
  }
};