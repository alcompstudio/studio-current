import { DataTypes, Model, Sequelize, ModelStatic } from 'sequelize';

// Определение интерфейса атрибутов
export interface ProjectAttributes {
  id?: number;
  customer_id: number;
  title: string;
  description?: string | null;
  status: string;
  budget?: number | null;      // Добавлено поле budget
  currency?: string | null;   // Добавлено поле currency
}

export interface ProjectInstance extends Model<ProjectAttributes>, ProjectAttributes {}

// Функция-дефайнер модели
export default function defineProject(sequelize: Sequelize): ModelStatic<ProjectInstance> {
  class Project extends Model<ProjectAttributes, ProjectAttributes> implements ProjectAttributes {
    public id!: number;
    public customer_id!: number;
    public title!: string;
    public description?: string | null;
    public status!: string;
    public budget?: number | null;     // Добавлено поле budget
    public currency?: string | null;  // Добавлено поле currency

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Статический метод для определения связей
    public static associate(models: any) {
      Project.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer',
      });
      Project.hasMany(models.Order, {
        foreignKey: 'project_id',
        as: 'orders',
      });
    }
  }

  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'active',
      },
      budget: {
        type: DataTypes.DECIMAL(12, 2), // Пример: 12 цифр всего, 2 после запятой
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING(10),      // Пример: 'USD', 'EUR'
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'projects',
      modelName: 'Project',
      timestamps: true,
      underscored: true,
    }
  );

  return Project as ModelStatic<ProjectInstance>;
}
