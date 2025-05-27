# Документация для `stage-work-type-form.tsx`

*Путь к файлу: `src/components\settings\stages\stage-work-type-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    stage_work_type_form_tsx[stage-work-type-form.tsx]
    react[react]
    stage_work_type_form_tsx --> react
    button[@/components/ui/button]
    stage_work_type_form_tsx --> button
    card[@/components/ui/card]
    stage_work_type_form_tsx --> card
    form[@/components/ui/form]
    stage_work_type_form_tsx --> form
    input[@/components/ui/input]
    stage_work_type_form_tsx --> input
    lucide_react[lucide-react]
    stage_work_type_form_tsx --> lucide_react
    react_hook_form[react-hook-form]
    stage_work_type_form_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    stage_work_type_form_tsx --> zod
    zod[zod]
    stage_work_type_form_tsx --> zod
    use_toast[@/hooks/use-toast]
    stage_work_type_form_tsx --> use_toast
```

### `StageWorkTypeForm` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `initialData` | `WorkType \| null` | Нет |  |
| `onSave` | `() => void` | Да |  |
| `onCancel` | `() => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\stages\stage-work-type-form.tsx`*

---
