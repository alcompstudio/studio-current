// Определение модели PricingTypeOs
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Атрибуты таблицы pricing_type_os
export interface PricingTypeOsAttributes {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

// Атрибуты для создания новой записи (id, created_at, updated_at опциональны)
export type PricingTypeOsCreationAttributes = Optional<
  PricingTypeOsAttributes,
  'id' | 'created_at' | 'updated_at'
>;

class PricingTypeOs
  extends Model<PricingTypeOsAttributes, PricingTypeOsCreationAttributes>
  implements PricingTypeOsAttributes {
  public id!: number;
  public name!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Ассоциации
  public static associate(models: any) {
    // Опция этапа (StageOption) принадлежит одному типу ценообразования (PricingTypeOs)
    PricingTypeOs.hasMany(models.StageOption, {
      foreignKey: 'pricing_type_id',
      as: 'stageOptions',
    });
  }
}

// Функция для инициализации модели
const definePricingTypeOs = (sequelize: Sequelize) => {
  PricingTypeOs.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'pricing_type_os',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return PricingTypeOs;
};

export { PricingTypeOs };
export default definePricingTypeOs;