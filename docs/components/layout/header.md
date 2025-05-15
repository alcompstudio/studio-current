# Документация для `header.tsx`

*Путь к файлу: `src/components\layout\header.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    header_tsx[header.tsx]
    react[react]
    header_tsx --> react
    button[@/components/ui/button]
    header_tsx --> button
    input[@/components/ui/input]
    header_tsx --> input
    lucide_react[lucide-react]
    header_tsx --> lucide_react
    dropdown_menu[@/components/ui/dropdown-menu]
    header_tsx --> dropdown_menu
    avatar[@/components/ui/avatar]
    header_tsx --> avatar
    navigation[next/navigation]
    header_tsx --> navigation
    use_toast[@/hooks/use-toast]
    header_tsx --> use_toast
    types[@/lib/types]
    header_tsx --> types
```

### `Header` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `userEmail` | `string` | Да |  |
| `userRole` | `UserRole` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\layout\header.tsx`*

---
