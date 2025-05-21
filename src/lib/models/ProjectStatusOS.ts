// e:\Business\Projects\studio\src\lib\models\ProjectStatusOS.ts
import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import type { Sequelize as SequelizeInstance } from 'sequelize'; // Для типизации экземпляра sequelize

// Эти атрибуты необходимы для создания экземпляра ProjectStatusOS
interface ProjectStatusOSAttributes {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
}

// Эти атрибуты могут быть предоставлены при создании, но id является автоинкрементом
interface ProjectStatusOSCreationAttributes extends Optional<ProjectStatusOSAttributes, 'id'> {}

class ProjectStatusOS extends Model<ProjectStatusOSAttributes, ProjectStatusOSCreationAttributes> implements ProjectStatusOSAttributes {
  public id!: number;
  public name!: string;
  public textColor!: string;
  public backgroundColor!: string;

  // Временные метки
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Ассоциации (если понадобятся)
  // public static associations: {
  //   projects: Association<ProjectStatusOS, Project>; // Пример
  // };

  // Метод для инициализации модели и ассоциаций
  public static initialize(sequelize: SequelizeInstance) {
    ProjectStatusOS.init(
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
          type: new DataTypes.STRING(50), // Для hex-кодов цвета
          allowNull: false,
          field: 'text_color', // Указываем имя столбца в БД (snake_case)
        },
        backgroundColor: {
          type: new DataTypes.STRING(50), // Для hex-кодов цвета
          allowNull: false,
          field: 'background_color', // Указываем имя столбца в БД (snake_case)
        },
      },
      {
        sequelize,
        tableName: 'project_status_os', // Явное имя таблицы в БД
        underscored: true, // Это глобально настроит Sequelize на использование snake_case для автоматически создаваемых полей (вроде createdAt, updatedAt и внешних ключей)
        // timestamps: true, // По умолчанию true, если underscored: true, то будут created_at и updated_at
      }
    );
  }

  public static associate(models: any) {
    // Здесь определяются ассоциации, если они нужны
    this.hasMany(models.Project, {
      sourceKey: 'id',
      foreignKey: 'status', // Имя поля в модели Project, которое является FK
      as: 'projects',
    });
  }
}

// Функция-дефайнер для единообразия с index.ts
const defineProjectStatusOS = (sequelize: SequelizeInstance): typeof ProjectStatusOS => {
  ProjectStatusOS.initialize(sequelize); 
  // Ассоциации будут вызываться из файла models/index.ts после инициализации всех моделей
  return ProjectStatusOS;
};

export default defineProjectStatusOS;
export { ProjectStatusOS }; // Экспорт класса как значения
export type { ProjectStatusOSAttributes, ProjectStatusOSCreationAttributes }; // Экспорт типов

// Важно: Вы также должны импортировать и вызвать ProjectStatusOS.initialize(sequelize)
// и ProjectStatusOS.associate(models) (если есть ассоциации)
// в вашем основном файле инициализации Sequelize (обычно это src/lib/models/index.ts или src/lib/db.ts).
