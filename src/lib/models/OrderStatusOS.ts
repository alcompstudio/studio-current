import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import type { Sequelize as SequelizeInstance } from 'sequelize';

// Атрибуты, необходимые для создания экземпляра OrderStatusOS
interface OrderStatusOSAttributes {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
}

// Атрибуты, которые могут быть предоставлены при создании
interface OrderStatusOSCreationAttributes extends Optional<OrderStatusOSAttributes, 'id'> {}

class OrderStatusOS extends Model<OrderStatusOSAttributes, OrderStatusOSCreationAttributes> implements OrderStatusOSAttributes {
  public id!: number;
  public name!: string;
  public textColor!: string;
  public backgroundColor!: string;

  // Временные метки
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Метод для инициализации модели и ассоциаций
  public static initialize(sequelize: SequelizeInstance) {
    OrderStatusOS.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: new DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        textColor: {
          type: new DataTypes.STRING(50),
          allowNull: false,
          field: 'text_color',
        },
        backgroundColor: {
          type: new DataTypes.STRING(50),
          allowNull: false,
          field: 'background_color',
        },
      },
      {
        sequelize,
        tableName: 'order_status_os',
        underscored: true,
      }
    );
  }

  public static associate(models: any) {
    // Определяем ассоциации
    this.hasMany(models.Order, {
      sourceKey: 'id',
      foreignKey: 'status',
      as: 'orders',
    });
  }
}

// Функция-дефайнер для единообразия с index.ts
const defineOrderStatusOS = (sequelize: SequelizeInstance): typeof OrderStatusOS => {
  OrderStatusOS.initialize(sequelize);
  // Ассоциации будут вызываться из файла models/index.ts
  return OrderStatusOS;
};

export default defineOrderStatusOS;
export { OrderStatusOS };
export type { OrderStatusOSAttributes, OrderStatusOSCreationAttributes };
