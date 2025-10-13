import jwt from 'jsonwebtoken';
import { UniqueConstraintError, Op } from 'sequelize'; // Importe o 'Op' para consultas complexas

/**
 * Registra um novo usuário no sistema (adaptado para 'signup').
 */
export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validação para garantir que os campos foram enviados
    if (!username || !password) {
      return res.status(400).json({ error: 'Por favor, forneça um nome de usuário e senha.' });
    }

    // Acessa o modelo User através do contexto e cria o usuário
    const user = await req.context.models.User.create({ username, password });

    res.status(201).json({ message: 'Utilizador criado com sucesso!', userId: user.id });
  } catch (error) {
    // Verifica se o erro é uma violação de restrição única (usuário já existe)
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ error: 'Este nome de utilizador já está em uso.' });
    }
    
    console.error('Erro no signup:', error);
    res.status(500).json({ error: 'Erro ao criar o utilizador.' });
  }
};

/**
 * Autentica um usuário e retorna um token JWT.
 * Permite login com 'username' (ou 'email' se você adicionar o campo no modelo).
 */
export const login = async (req, res) => {
  try {
    const { login, password } = req.body; // 'login' pode ser username ou email

    if (!login || !password) {
      return res.status(400).json({ error: 'Por favor, forneça suas credenciais e senha.' });
    }

    // Procura o usuário tanto pelo username.
    // Se você adicionar um campo 'email' ao seu modelo User, pode incluí-lo aqui.
    const user = await req.context.models.User.findOne({
      where: {
        // Usando Op.or para permitir login com username
        // Para adicionar email: { [Op.or]: [{ username: login }, { email: login }] }
        username: login
      },
    });

    // Se o usuário não for encontrado ou a senha for inválida (isValidPassword retorna false)
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); // Erro 401 para falha na autenticação
    }

    // Se a autenticação for bem-sucedida, gera o token JWT
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role // Incluindo a 'role' que adicionamos anteriormente
    };

    const token = jwt.sign(
      payload,
      'seuSegredoJWT', // Lembre-se de mover isso para uma variável de ambiente (.env)
      { expiresIn: '1h' }      // O token expira em 1 hora
    );

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};

/**
 * Realiza o logout do usuário (abordagem client-side).
 */
export const logout = (req, res) => {
  // Com JWT, o logout é uma operação do lado do cliente (remover o token).
  // Esta rota serve como um endpoint formal para o cliente acionar essa ação.
  res.status(200).json({ message: 'Logout bem-sucedido. O cliente deve agora invalidar o token.' });
};