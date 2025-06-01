# Документация для `image-uploader.tsx`

*Путь к файлу: `src/components\ui\tiptap\components\image-uploader.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    image_uploader_tsx[image-uploader.tsx]
    react[react]
    image_uploader_tsx --> react
    types[../types]
    image_uploader_tsx --> types
```

### `ImageUploader` (ReactComponent)

**Описание:**

> Компонент для загрузки и вставки изображений в редактор

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `onImageUpload` | `(file: File) => Promise<UploadedImage>` | Да |  |
| `onImageInsert` | `(imageUrl: string, alt?: string, title?: string) => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\ui\tiptap\components\image-uploader.tsx`*

---
