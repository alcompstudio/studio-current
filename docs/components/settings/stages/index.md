# Документация для `index.ts`

*Путь к файлу: `src/components\settings\stages\index.ts`*

## Зависимости файла


### `StageWorkTypesContent` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\stages\index.ts`*

---
### `StageWorkTypesTable` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `items` | `WorkType[]` | Да |  |
| `onEdit` | `(item: WorkType) => void` | Да |  |
| `onDelete` | `(id: number) => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\stages\index.ts`*

---
### `StageWorkTypeForm` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `initialData` | `WorkType \| null` | Нет |  |
| `onSave` | `() => void` | Да |  |
| `onCancel` | `() => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\stages\index.ts`*

---
