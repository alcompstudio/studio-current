import { DataTypes, Model, Sequelize, ModelStatic } from 'sequelize';
import type { ProjectStatusOSAttributes } from './ProjectStatusOS'; // Для типизации связи
import type { CurrencyOSAttributes } from './CurrencyOS'; // Для типизации связи с валютой

// Определение интерфейса атрибутов
export interface ProjectAttributes {
  id?: number;
  customer_id: number;
  title: string;
  description?: string | null;
  status: number; // Теперь это ID статуса
  projectStatus?: ProjectStatusOSAttributes; // Для eager loading
  budget?: number | null;      // Добавлено поле budget
  currency?: number | null;   // Теперь это ID валюты
  currencyDetails?: CurrencyOSAttributes; // Для eager loading валюты
}

export interface ProjectInstance extends Model<ProjectAttributes>, ProjectAttributes {}

// Функция-дефайнер модели
export default function defineProject(sequelize: Sequelize): ModelStatic<ProjectInstance> {
  class Project extends Model<ProjectAttributes, ProjectAttributes> implements ProjectAttributes {
    public id!: number;
    public customer_id!: number;
    public title!: string;
    public description?: string | null;
    public status!: number; // Теперь это ID статуса
    public budget?: number | null;     // Добавлено поле budget
    public currency?: number | null;  // Теперь это ID валюты

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
      // Связь со статусом проекта
      Project.belongsTo(models.ProjectStatusOS, {
        foreignKey: 'status', // Имя поля в таблице projects, которое хранит ID статуса
        as: 'projectStatus', // Псевдоним для доступа к связанному статусу
        targetKey: 'id' // Поле в таблице project_status_os, на которое ссылаемся
      });
      // Связь с валютой проекта
      Project.belongsTo(models.CurrencyOS, {
        foreignKey: 'currency', // Имя поля в таблице projects, которое хранит ID валюты
        as: 'currencyDetails', // Псевдоним для доступа к связанной валюте
        targetKey: 'id' // Поле в таблице currency_os, на которое ссылаемся
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
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'project_status_os', // Имя таблицы, на которую ссылаемся
          key: 'id',
        },
        // defaultValue убираем, т.к. NOT NULL и FK обеспечат корректность
        // или можно установить defaultValue на ID существующего статуса, если это необходимо бизнес-логикой
      },
      budget: {
        type: DataTypes.DECIMAL(12, 2), // Пример: 12 цифр всего, 2 после запятой
        allowNull: true,
      },
      currency: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'currency_os', // Имя таблицы, на которую ссылаемся
          key: 'id',
        },
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
