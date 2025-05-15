# Документация для `mockOrders.ts`

*Путь к файлу: `src/app\(app)\orders\mockOrders.ts`*

## Зависимости файла

```mermaid
flowchart TD
    mockOrders_ts[mockOrders.ts]
    types[@/lib/types]
    mockOrders_ts --> types
    mockProjects[../projects/mockProjects]
    mockOrders_ts --> mockProjects
```

### `getOrderStatusVariant` (Function)

**Параметры:**

| Имя | Тип | Опциональный | Описание |
|---|---|---|---|
| `status` | `OrderStatus` | Нет |  |

**Возвращает:** `"default" \| "secondary" \| "destructive" \| "outline" \| "success"`

*Источник: `src/app\(app)\orders\mockOrders.ts`*

---
### `mockOrders` (Variable (CallExpression))

*Источник: `src/app\(app)\orders\mockOrders.ts`*

---
