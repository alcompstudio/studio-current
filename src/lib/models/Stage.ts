import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { StageWorkTypeOSAttributes } from './StageWorkTypeOS';

export interface StageAttributes {
  id: number;
  order_id: number;
  name: string;
  description: string | null;
  sequence: number | null;
  color: string | null;
  work_type: number | null;
  workTypeDetails?: StageWorkTypeOSAttributes; // Для eager loading
  estimated_price: number | null;
  created_at: Date;
  updated_at: Date;
}

export type StageCreationAttributes = Optional<
  StageAttributes,
  'id' | 'created_at' | 'updated_at'
>;

class Stage extends Model<StageAttributes, StageCreationAttributes> 
  implements StageAttributes {
  public id!: number;
  public order_id!: number;
  public name!: string;
  public description!: string | null;
  public sequence!: number | null;
  public color!: string | null;
  public work_type!: number | null;
  public estimated_price!: number | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  public static associate(models: any) {
    Stage.hasMany(models.StageOption, {
      foreignKey: 'order_stage_id',
      as: 'options',
      onDelete: 'CASCADE',
    });
    
    Stage.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });

    // Связь с типом работы
    Stage.belongsTo(models.StageWorkTypeOS, {
      foreignKey: 'work_type',
      as: 'workTypeDetails',
      targetKey: 'id'
    });
  }
}

const defineStage = (sequelize: Sequelize) => {
  Stage.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING(7),
        allowNull: true,
      },
      work_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'stage_work_type_os',
          key: 'id',
        },
      },
      estimated_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
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
      tableName: 'order_stages',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Stage;
};

export { Stage };
export default defineStage;
