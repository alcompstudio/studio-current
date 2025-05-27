// StageWorkTypeOS.ts - Модель для типов работ этапов
import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import type { Sequelize as SequelizeInstance } from 'sequelize';

// Определение интерфейсов
interface StageWorkTypeOSAttributes {
  id: number;
  name: string;
}

interface StageWorkTypeOSCreationAttributes extends Optional<StageWorkTypeOSAttributes, 'id'> {}

// Определение класса модели
class StageWorkTypeOS extends Model<StageWorkTypeOSAttributes, StageWorkTypeOSCreationAttributes> implements StageWorkTypeOSAttributes {
  public id!: number;
  public name!: string;

  // Временные метки
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Метод для инициализации модели и ассоциаций
  public static initialize(sequelize: SequelizeInstance) {
    StageWorkTypeOS.init(
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
        }
      },
      {
        sequelize,
        tableName: 'stage_work_type_os', // Имя таблицы в БД
        underscored: true, // Использование snake_case для автоматически создаваемых полей
      }
    );
  }

  public static associate(models: any) {
    // Определение ассоциаций
    this.hasMany(models.Stage, {
      sourceKey: 'id',
      foreignKey: 'work_type', // Имя поля в модели Stage, которое является FK
      as: 'stages',
    });
  }
}

// Функция-дефайнер для единообразия с index.ts
const defineStageWorkTypeOS = (sequelize: SequelizeInstance): typeof StageWorkTypeOS => {
  StageWorkTypeOS.initialize(sequelize);
  return StageWorkTypeOS;
};

// Экспорты
export default defineStageWorkTypeOS;
export { StageWorkTypeOS };
export type { StageWorkTypeOSAttributes, StageWorkTypeOSCreationAttributes };
