// ex01-express/api/models/user.js

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Hook para criptografar a senha antes de salvar o usuário
  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  // Método para verificar a senha
  User.prototype.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};