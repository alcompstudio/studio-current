# Документация для `Stage.ts`

*Путь к файлу: `src/lib\models\Stage.ts`*

## Зависимости файла

```mermaid
flowchart TD
    Stage_ts[Stage.ts]
    sequelize[sequelize]
    Stage_ts --> sequelize
    stage[@/lib/types/stage]
    Stage_ts --> stage
```

### `StageAttributes` (Interface)

*Источник: `src/lib\models\Stage.ts`*

---
### `StageCreationAttributes` (TypeAlias)

*Источник: `src/lib\models\Stage.ts`*

---
### `Stage` (Class)

*Источник: `src/lib\models\Stage.ts`*

---
### `default` (Function)

**Параметры:**

| Имя | Тип | Опциональный | Описание |
|---|---|---|---|
| `sequelize` | `Sequelize` | Нет |  |

**Возвращает:** `typeof import("E:/Business/Projects/studio/src/lib/models/Stage").Stage`

*Источник: `src/lib\models\Stage.ts`*

---
