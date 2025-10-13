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

  jwt.verify(token, 'seuSegredoJWT', (err, decoded) => {
  
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };
    
    return next(); 
  });
};

export default authMiddleware;