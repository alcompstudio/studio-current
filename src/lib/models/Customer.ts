import { DataTypes, Model, Sequelize, ModelStatic } from 'sequelize';

// Определение интерфейса атрибутов
export interface CustomerAttributes {
  id?: number;
  userId: number; // Внешний ключ для связи с User
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}

// Расширяем интерфейс для включения методов экземпляра модели, если они есть
export interface CustomerInstance extends Model<CustomerAttributes>, CustomerAttributes {
  userId: number;
  // Если у вас есть кастомные методы экземпляра, определите их здесь
}

// Функция-дефайнер модели
export default function defineCustomer(sequelize: Sequelize): ModelStatic<CustomerInstance> {
  class Customer extends Model<CustomerAttributes, CustomerAttributes> implements CustomerAttributes {
    public id!: number;
    public userId!: number;
    public name!: string;
    public email!: string;
    public phone?: string | null;
    public address?: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Статический метод для определения связей
    public static associate(models: any) {
      // Заказчик принадлежит одному Пользователю
      Customer.belongsTo(models.User, {
        foreignKey: 'user_id', // Имя поля в этой таблице (customers)
        as: 'user',
      });
      // Заказчик может иметь много Проектов
      Customer.hasMany(models.Project, {
        foreignKey: 'customer_id', // Имя поля в таблице projects
        as: 'projects',
      });
    }
  }

  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'user_id',
      references: {
        model: 'users', // Имя таблицы, на которую ссылаемся
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'customers',
      modelName: 'Customer',
      timestamps: true,
      underscored: true,
    }
  );

  return Customer as ModelStatic<CustomerInstance>;
}
