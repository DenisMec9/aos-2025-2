import bcrypt from 'bcryptjs'; // <-- CORREÇÃO: Adicionar esta linha de importação

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: { // Adicionado o campo de palavra-passe
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  // Esta função foi simplificada para corresponder aos campos do seu modelo
  User.findByLogin = async (login) => {
    const user = await User.findOne({
      where: { username: login },
    });

    return user;
  };

  // Hook para encriptar a palavra-passe antes de criar o utilizador
  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  // Método de instância para validar a palavra-passe
  User.prototype.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };


  return User;
};

export default user;

