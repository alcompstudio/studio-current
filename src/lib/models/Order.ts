import { DataTypes, Model, Sequelize, ModelStatic } from 'sequelize';

// Определение интерфейса атрибутов
export interface OrderAttributes {
  id?: number;
  project_id: number;
  title: string;
  description?: string | null;
  status: string;
  deadline?: Date | null;
  price?: string | number | null;
}

export interface OrderInstance extends Model<OrderAttributes>, OrderAttributes {}

// Функция-дефайнер модели
export default function defineOrder(sequelize: Sequelize): ModelStatic<OrderInstance> {
  class Order extends Model<OrderAttributes, OrderAttributes> implements OrderAttributes {
    public id!: number;
    public project_id!: number;
    public title!: string;
    public description?: string | null;
    public status!: string;
    public deadline?: Date | null;
    public price?: string | number | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Статический метод для определения связей
    public static associate(models: any) {
      Order.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project',
      });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'orders',
      modelName: 'Order',
      timestamps: true,
      underscored: true,
    }
  );

  return Order as ModelStatic<OrderInstance>;
}
