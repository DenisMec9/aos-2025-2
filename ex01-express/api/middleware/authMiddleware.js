// ex01-express/api/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verifica se o token foi fornecido (Retorna 401 se não)
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido. Acesso não autorizado.' });
  }

  const parts = authHeader.split(' ');

  // 2. Verifica se o token está no formato "Bearer [token]"
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  // 3. Verifica a validade do token
  // Lembre-se de usar a mesma chave secreta do seu controller
  jwt.verify(token, 'seuSegredoJWT', (err, decoded) => {
    // Se houver erro na verificação (expirado, inválido), retorna 401
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    // 4. ATUALIZAÇÃO IMPORTANTE: Anexa os dados do usuário ao 'req'
    // Em vez de apenas o ID, passamos o objeto com id, username e role.
    // Isso permitirá que as próximas rotas verifiquem as permissões (role).
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };
    
    return next(); // Libera o acesso para a próxima rota/middleware
  });
};

export default authMiddleware;