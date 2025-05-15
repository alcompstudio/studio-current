# Документация для `use-toast.ts`

*Путь к файлу: `src/hooks\use-toast.ts`*

## Зависимости файла

```mermaid
flowchart TD
    use_toast_ts[use-toast.ts]
    react[react]
    use_toast_ts --> react
    toast[@/components/ui/toast]
    use_toast_ts --> toast
```

### `reducer` (Function)

**Параметры:**

| Имя | Тип | Опциональный | Описание |
|---|---|---|---|
| `state` | `State` | Нет |  |
| `action` | `Action` | Нет |  |

**Возвращает:** `State`

*Источник: `src/hooks\use-toast.ts`*

---
### `useToast` (Function)

**Возвращает:** `{ toast: typeof import("E:/Business/Projects/studio/src/hooks/use-toast").toast; dismiss: (toastId?: string \| undefined) => void; toasts: ToasterToast[]; }`

*Источник: `src/hooks\use-toast.ts`*

---
### `toast` (Function)

**Параметры:**

| Имя | Тип | Опциональный | Описание |
|---|---|---|---|
| `{ ...props }` | `Toast` | Нет |  |

**Возвращает:** `{ id: string; dismiss: () => void; update: (props: ToasterToast) => void; }`

*Источник: `src/hooks\use-toast.ts`*

---
