import bcrypt from 'bcryptjs';

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

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true, // Validação de formato de e-mail do Sequelize
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: { 
      type: DataTypes.STRING,
      defaultValue: 'user',
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
    User.hasMany(models.Tarefa, { as: 'tarefas', foreignKey: 'userId' });
  };

  // Hook do Sequelize para criptografar a senha antes de criar o usuário
  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  // para validar a senha 
  User.prototype.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

export default user;