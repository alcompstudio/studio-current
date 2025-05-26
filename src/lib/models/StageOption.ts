import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface StageOptionAttributes {
  id: number;
  order_stage_id: number;
  name: string;
  description: string | null;
  is_calculable: boolean;
  included_in_price: boolean;
  calculation_formula: string | null;
  plan_units: number | null;
  unit_divider: number | null;
  price_per_unit: number | null;
  calculated_plan_price: number | null;
  created_at: Date;
  updated_at: Date;
}

export type StageOptionCreationAttributes = Optional<
  StageOptionAttributes,
  'id' | 'created_at' | 'updated_at' | 'calculated_plan_price'
>;

class StageOption extends Model<StageOptionAttributes, StageOptionCreationAttributes> 
  implements StageOptionAttributes {
  public id!: number;
  public order_stage_id!: number;
  public name!: string;
  public description!: string | null;
  public is_calculable!: boolean;
  public included_in_price!: boolean;
  public calculation_formula!: string | null;
  public plan_units!: number | null;
  public unit_divider!: number | null;
  public price_per_unit!: number | null;
  public calculated_plan_price!: number | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Calculate the plan price if needed
  public calculatePlanPrice(): void {
    if (
      this.is_calculable &&
      this.plan_units !== null &&
      this.unit_divider !== null &&
      this.unit_divider !== 0 &&
      this.price_per_unit !== null
    ) {
      this.calculated_plan_price = 
        (Number(this.plan_units) / Number(this.unit_divider)) * Number(this.price_per_unit);
    } else {
      this.calculated_plan_price = null;
    }
  }

  // Define associations
  public static associate(models: any) {
    StageOption.belongsTo(models.Stage, {
      foreignKey: 'order_stage_id',
      as: 'stage',
      onDelete: 'CASCADE',
    });
  }
}

const defineStageOption = (sequelize: Sequelize) => {
  StageOption.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      order_stage_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'order_stages',
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
      is_calculable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      included_in_price: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      calculation_formula: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      plan_units: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      unit_divider: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      price_per_unit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      calculated_plan_price: {
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
      tableName: 'order_stage_options',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        beforeSave: (option: StageOption) => {
          option.calculatePlanPrice();
        },
      },
    }
  );

  return StageOption;
};

export { StageOption };
export default defineStageOption;
