# Документация для `form.tsx`

*Путь к файлу: `src/components\ui\form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    form_tsx[form.tsx]
    react[react]
    form_tsx --> react
    react_label[@radix-ui/react-label]
    form_tsx --> react_label
    react_slot[@radix-ui/react-slot]
    form_tsx --> react_slot
    react_hook_form[react-hook-form]
    form_tsx --> react_hook_form
    utils[@/lib/utils]
    form_tsx --> utils
    label[@/components/ui/label]
    form_tsx --> label
```

### `useFormField` (Function)

**Возвращает:** `{ invalid: boolean; isDirty: boolean; isTouched: boolean; isValidating: boolean; error?: import("E:/Business/Projects/studio/node_modules/react-hook-form/dist/types/errors").FieldError \| undefined; id: string; name: string; formItemId: string; formDescriptionId: string; formMessageId: string; }`

*Источник: `src/components\ui\form.tsx`*

---
### `Form` (Variable (Identifier))

*Источник: `src/components\ui\form.tsx`*

---
### `FormItem` (Variable (CallExpression))

*Источник: `src/components\ui\form.tsx`*

---
### `FormLabel` (Variable (CallExpression))

*Источник: `src/components\ui\form.tsx`*

---
### `FormControl` (Variable (CallExpression))

*Источник: `src/components\ui\form.tsx`*

---
### `FormDescription` (Variable (CallExpression))

*Источник: `src/components\ui\form.tsx`*

---
### `FormMessage` (Variable (CallExpression))

*Источник: `src/components\ui\form.tsx`*

---
### `FormField` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `render` | `({ field, fieldState, formState, }: {
        field: ControllerRenderProps<TFieldValues, TName>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
    }) => React.ReactElement` | Да |  |
| `name` | `TName` | Да |  |
| `rules` | `Omit<RegisterOptions<TFieldValues, TName>, 'valueAsNumber' \| 'valueAsDate' \| 'setValueAs' \| 'disabled'>` | Нет |  |
| `shouldUnregister` | `boolean` | Нет |  |
| `defaultValue` | `FieldPathValue<TFieldValues, TName>` | Нет |  |
| `control` | `Control<TFieldValues, any, TTransformedValues>` | Нет |  |
| `disabled` | `boolean` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\ui\form.tsx`*

---
