import { DataTypes, Model, Sequelize, ModelStatic } from 'sequelize';

// Типы ролей можно вынести в отдельный файл types.ts
type UserRole = 'Заказчик' | 'Исполнитель' | 'Администратор' | 'Модератор';

// Определение интерфейса атрибутов
export interface UserAttributes {
  id?: number;
  email: string;
  passwordHash: string; // Храним хеш, а не пароль
  role: UserRole; // Пока оставим роль здесь
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

// Функция-дефайнер модели
export default function defineUser(sequelize: Sequelize): ModelStatic<UserInstance> {
  class User extends Model<UserAttributes, UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public passwordHash!: string;
    public role!: UserRole;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Статический метод для определения связей
    public static associate(models: any) {
      // Пользователь может иметь один профиль Заказчика
      User.hasOne(models.Customer, {
        foreignKey: 'user_id', // Поле в таблице customers
        as: 'customerProfile',
      });
      // TODO: Добавить связь с Freelancer, если модель Freelancer будет создана
      // User.hasOne(models.Freelancer, {
      //   foreignKey: 'user_id',
      //   as: 'freelancerProfile',
      // });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: { // Имя поля в модели
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash', // Явное указание имени столбца в БД
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        // Можно добавить валидацию значений
        // validate: {
        //   isIn: [['Заказчик', 'Исполнитель', 'Администратор', 'Модератор']],
        // },
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
      timestamps: true,
      underscored: true, // Для createdAt, updatedAt
      // Важно: underscored: true не применяется к полям, определенным с `field`
      // поэтому password_hash в БД будет соответствовать passwordHash в модели.
      // Если хотим автоматический snake_case для ВСЕХ полей, `passwordHash` надо назвать `password_hash` и в модели
      // или убрать `field: 'password_hash'` и назвать поле `password_hash` в модели.
      // Оставим пока так для ясности.
    }
  );

  return User as ModelStatic<UserInstance>;
}
