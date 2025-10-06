// ex01-express/api/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  // Lembre-se de usar a mesma chave secreta do seu controller
  jwt.verify(token, 'seuSegredoJWT', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido.' });
    }

    req.userId = decoded.id;
    return next();
  });
};

export default authMiddleware; // Alterado de module.exports para export default