import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { UnitOs } from './UnitOs';

export interface StageOptionAttributes {
  id: number;
  order_stage_id: number;
  name: string;
  description: string | null;
  pricing_type: 'calculable' | 'included'; // Тип ценообразования: Калькулируемая или Входит в стоимость
  volume_unit_id: number | null; // Ссылка на таблицу единиц измерения
  // Поля для диапазона объема
  volume_min: number | null;
  volume_max: number | null;
  volume_unit: string | null; // Единица измерения объема (шт., симв., %, слов, ч и т.д.) - оставлено для обратной совместимости
  nominal_volume: number | null; // Номинальный объем для расчета
  price_per_unit: number | null; // Цена за единицу объема
  // Рассчитанная стоимость (мин и макс)
  calculated_price_min: number | null;
  calculated_price_max: number | null;
  created_at: Date;
  updated_at: Date;
}

export type StageOptionCreationAttributes = Optional<
  StageOptionAttributes,
  'id' | 'created_at' | 'updated_at' | 'calculated_price_min' | 'calculated_price_max'
>;

class StageOption extends Model<StageOptionAttributes, StageOptionCreationAttributes> 
  implements StageOptionAttributes {
  public id!: number;
  public order_stage_id!: number;
  public name!: string;
  public description!: string | null;
  public pricing_type!: 'calculable' | 'included';
  public volume_unit_id!: number | null; // Добавлено свойство
  public volume_min!: number | null;
  public volume_max!: number | null;
  public volume_unit!: string | null;
  public nominal_volume!: number | null;
  public price_per_unit!: number | null;
  public calculated_price_min!: number | null;
  public calculated_price_max!: number | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Расчет стоимости на основе объема и цены
  public calculatePrices(): void {
    if (
      this.pricing_type === 'calculable' &&
      this.nominal_volume !== null &&
      this.nominal_volume !== 0 &&
      this.price_per_unit !== null
    ) {
      // Если указан минимальный объем, рассчитываем минимальную стоимость
      if (this.volume_min !== null) {
        this.calculated_price_min = 
          (Number(this.volume_min) / Number(this.nominal_volume)) * Number(this.price_per_unit);
      } else {
        this.calculated_price_min = null;
      }
      
      // Если указан максимальный объем, рассчитываем максимальную стоимость
      if (this.volume_max !== null) {
        this.calculated_price_max = 
          (Number(this.volume_max) / Number(this.nominal_volume)) * Number(this.price_per_unit);
      } else {
        this.calculated_price_max = null;
      }
    } else {
      this.calculated_price_min = null;
      this.calculated_price_max = null;
    }
  }

  // Define associations
  public static associate(models: any) {
    StageOption.belongsTo(models.Stage, {
      foreignKey: 'order_stage_id',
      as: 'stage',
      onDelete: 'CASCADE',
    });
    
    StageOption.belongsTo(models.UnitOs, {
      foreignKey: 'volume_unit_id',
      as: 'volumeUnit',
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
      pricing_type: {
        type: DataTypes.ENUM('calculable', 'included'),
        allowNull: false,
        defaultValue: 'included',
      },
      volume_min: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: true,
      },
      volume_max: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: true,
      },
      volume_unit_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'unit_os',
          key: 'id',
        },
      },
      volume_unit: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      nominal_volume: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: true,
      },
      price_per_unit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      calculated_price_min: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      calculated_price_max: {
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
        beforeSave: async (option: StageOption) => {
          option.calculatePrices();

          // Синхронизация полей volume_unit и volume_unit_id
          if (option.volume_unit_id && !option.volume_unit) {
            try {
              // Получаем единицу измерения по ID
              const unitOs = await sequelize.models.UnitOs.findByPk(option.volume_unit_id);
              if (unitOs) {
                option.volume_unit = unitOs.get('short_name') as string;
              }
            } catch (error) {
              console.error('Ошибка при синхронизации volume_unit_id → volume_unit:', error);
            }
          } else if (option.volume_unit && !option.volume_unit_id) {
            try {
              // Получаем единицу измерения по краткому названию
              const unitOs = await sequelize.models.UnitOs.findOne({
                where: { short_name: option.volume_unit }
              });
              if (unitOs) {
                option.volume_unit_id = unitOs.get('id') as number;
              }
            } catch (error) {
              console.error('Ошибка при синхронизации volume_unit → volume_unit_id:', error);
            }
          }
        },
      },
    }
  );

  return StageOption;
};

export { StageOption };
export default defineStageOption;
