import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { StageOptionAttributes } from "./StageOption";

// Атрибуты таблицы unit_os
export interface UnitOsAttributes {
  id: number;
  full_name: string;
  short_name: string;
  created_at: Date;
  updated_at: Date;
}

// Атрибуты для создания (без autoIncrement)
export interface UnitOsCreationAttributes extends Optional<UnitOsAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class UnitOs extends Model<UnitOsAttributes, UnitOsCreationAttributes> implements UnitOsAttributes {
  public id!: number;
  public full_name!: string;
  public short_name!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Ассоциации
  public readonly stageOptions?: StageOptionAttributes[];

  public static initialize(sequelize: Sequelize) {
    UnitOs.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      short_name: {
        type: DataTypes.STRING,
        allowNull: false,
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
      }
    }, {
      sequelize,
      tableName: 'unit_os',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
  }

  public static associate(models: any) {
    UnitOs.hasMany(models.StageOption, {
      foreignKey: 'volume_unit_id',
      as: 'stageOptions',
    });
  }
}

// Функция для инициализации модели
export default (sequelize: Sequelize) => {
  UnitOs.initialize(sequelize);
  return UnitOs;
};
