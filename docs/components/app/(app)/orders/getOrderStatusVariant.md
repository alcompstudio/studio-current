# Документация для `getOrderStatusVariant.ts`

*Путь к файлу: `src/app\(app)\orders\getOrderStatusVariant.ts`*

## Зависимости файла

```mermaid
flowchart TD
    getOrderStatusVariant_ts[getOrderStatusVariant.ts]
    order[@/lib/types/order]
    getOrderStatusVariant_ts --> order
```

### `getOrderStatusVariant` (Function)

**Параметры:**

| Имя | Тип | Опциональный | Описание |
|---|---|---|---|
| `statusId` | `number \| undefined \| null` | Нет |  |
| `statuses` | `OrderStatusOS[]` | Нет |  |

**Возвращает:** `"default" \| "secondary" \| "destructive" \| "outline" \| "success"`

*Источник: `src/app\(app)\orders\getOrderStatusVariant.ts`*

---
### `getOrderStatusStyle` (Function)

**Параметры:**

| Имя | Тип | Опциональный | Описание |
|---|---|---|---|
| `statusId` | `number \| undefined \| null` | Нет |  |
| `statuses` | `OrderStatusOS[]` | Нет |  |

**Возвращает:** `{ color: string; backgroundColor: string }`

*Источник: `src/app\(app)\orders\getOrderStatusVariant.ts`*

---
