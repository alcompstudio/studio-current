// e:\Business\Projects\studio\src\lib\models\CurrencyOS.ts
import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import type { Sequelize as SequelizeInstance } from 'sequelize'; // Для типизации экземпляра sequelize

// Атрибуты для создания экземпляра CurrencyOS
interface CurrencyOSAttributes {
  id: number;
  isoCode: string;
  name: string;
  symbol: string;
  exchangeRate: number;
}

// Атрибуты, опциональные при создании (id автоинкремент)
interface CurrencyOSCreationAttributes extends Optional<CurrencyOSAttributes, 'id'> {}

class CurrencyOS extends Model<CurrencyOSAttributes, CurrencyOSCreationAttributes> implements CurrencyOSAttributes {
  public id!: number;
  public isoCode!: string;
  public name!: string;
  public symbol!: string;
  public exchangeRate!: number;

  // Временные метки
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Метод для инициализации модели и ассоциаций
  public static initialize(sequelize: SequelizeInstance) {
    CurrencyOS.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        isoCode: {
          type: new DataTypes.STRING(10),
          allowNull: false,
          unique: true,
          field: 'iso_code',
        },
        name: {
          type: new DataTypes.STRING(255),
          allowNull: false,
        },
        symbol: {
          type: new DataTypes.STRING(10),
          allowNull: false,
        },
        exchangeRate: {
          type: new DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'exchange_rate',
        },
      },
      {
        sequelize,
        tableName: 'currency_os',
        underscored: true,
      }
    );
  }

  public static associate(models: any) {
    // Определяем ассоциации
    this.hasMany(models.Project, {
      sourceKey: 'id',
      foreignKey: 'currency',
      as: 'projects',
    });
  }
}

// Функция-дефайнер для единообразия с index.ts
const defineCurrencyOS = (sequelize: SequelizeInstance): typeof CurrencyOS => {
  CurrencyOS.initialize(sequelize); 
  return CurrencyOS;
};

export default defineCurrencyOS;
export { CurrencyOS }; // Экспорт класса как значения
export type { CurrencyOSAttributes, CurrencyOSCreationAttributes }; // Экспорт типов
