# Документация для `menu-bar.tsx`

*Путь к файлу: `src/components\ui\tiptap\components\menu-bar.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    menu_bar_tsx[menu-bar.tsx]
    react[react]
    menu_bar_tsx --> react
    types[../types]
    menu_bar_tsx --> types
    extension_heading[@tiptap/extension-heading]
    menu_bar_tsx --> extension_heading
```

### `MenuBar` (ReactComponent)

**Описание:**

> Компонент панели инструментов редактора с возможностью конфигурации

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `editor` | `Editor \| null` | Да |  |
| `defaultConfig` | `ToolbarConfigType` | Нет |  |
| `onImageUpload` | `(file: File) => Promise<UploadedImage>` | Нет |  |

**Возвращает:** `React.JSX.Element \| null`

*Источник: `src/components\ui\tiptap\components\menu-bar.tsx`*

---
