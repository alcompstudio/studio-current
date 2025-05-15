# Документация для `utils.ts`

*Путь к файлу: `src/lib\utils.ts`*

## Зависимости файла

```mermaid
flowchart TD
    utils_ts[utils.ts]
    clsx[clsx]
    utils_ts --> clsx
    tailwind_merge[tailwind-merge]
    utils_ts --> tailwind_merge
```

### `cn` (Function)

**Параметры:**

| Имя | Тип | Опциональный | Описание |
|---|---|---|---|
| `inputs` | `ClassValue[]` | Да |  |

**Возвращает:** `string`

*Источник: `src/lib\utils.ts`*

---
