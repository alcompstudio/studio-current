# Документация для `Project.ts`

*Путь к файлу: `src/lib\models\Project.ts`*

## Зависимости файла

```mermaid
flowchart TD
    Project_ts[Project.ts]
    sequelize[sequelize]
    Project_ts --> sequelize
    ProjectStatusOS[./ProjectStatusOS]
    Project_ts --> ProjectStatusOS
```

### `default` (Function)

**Параметры:**

| Имя | Тип | Опциональный | Описание |
|---|---|---|---|
| `sequelize` | `Sequelize` | Нет |  |

**Возвращает:** `ModelStatic<ProjectInstance>`

*Источник: `src/lib\models\Project.ts`*

---
### `ProjectAttributes` (Interface)

*Источник: `src/lib\models\Project.ts`*

---
### `ProjectInstance` (Interface)

*Источник: `src/lib\models\Project.ts`*

---
