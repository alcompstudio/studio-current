# Документация для `toaster.tsx`

*Путь к файлу: `src/components\ui\toaster.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    toaster_tsx[toaster.tsx]
    use_toast[@/hooks/use-toast]
    toaster_tsx --> use_toast
    toast[@/components/ui/toast]
    toaster_tsx --> toast
```

### `Toaster` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\ui\toaster.tsx`*

---
