# Визуальный текстовый редактор (Rich Text Editor)

В проекте используется **Quill** как стандартный визуальный текстовый редактор (вместо ранее использовавшегося Tiptap).

## Основные компоненты

- `QuillEditor.tsx` - основной компонент редактора
- `QuillEditorWrapper.tsx` - обертка для интеграции с react-hook-form
- `quill-styles.css` - базовые стили редактора
- `quill-custom.css` - кастомные стили для редактора
- `quill-font-fixes.css` - исправления для корректного отображения названий шрифтов

## Особенности реализации

1. **Поддержка различных конфигураций панели инструментов**:
   - `minimal` - основные инструменты форматирования текста
   - `medium` - расширенные инструменты форматирования
   - `full` - полный набор инструментов, включая загрузку изображений

2. **Полная кастомизация шрифтов**:
   - Корректное отображение в выпадающем списке
   - Поддержка различных шрифтов (Arial, Times New Roman, Georgia и т.д.)
   - Исправления для правильного отображения названий шрифтов в селекторе

3. **Интеграция с react-hook-form** для работы с формами:
   - Компонент `QuillEditorWrapper` служит адаптером между Quill и react-hook-form
   - Поддержка валидации введенного контента
   - Работа с состоянием формы (dirty, touched и т.д.)

4. **Работа с изображениями**:
   - Загрузка изображений в редактор
   - Вставка изображений через буфер обмена

## Как использовать

### Базовое использование с react-hook-form

```tsx
import { QuillEditorWrapper } from '@/components/editor/quill/QuillEditorWrapper';
import { useForm } from 'react-hook-form';

export default function MyForm() {
  const form = useForm({
    defaultValues: {
      content: '<p>Начальный текст</p>'
    }
  });

  return (
    <form>
      <QuillEditorWrapper
        name="content"
        control={form.control}
        toolbarType="medium"
        placeholder="Введите текст..."
      />
      <button type="submit">Отправить</button>
    </form>
  );
}
```

### Использование с собственным состоянием

```tsx
import { QuillEditor } from '@/components/editor/quill/QuillEditor';
import { useState } from 'react';

export default function MyEditor() {
  const [content, setContent] = useState('<p>Начальный текст</p>');

  return (
    <div>
      <QuillEditor
        value={content}
        onChange={setContent}
        toolbarType="full"
        placeholder="Введите текст..."
      />
    </div>
  );
}
```

## Типы панели инструментов

### minimal

Базовый набор инструментов:
- Жирный, курсив, подчеркнутый текст
- Маркированный и нумерованный списки
- Отступы
- Ссылки

### medium

Расширенный набор инструментов:
- Все инструменты из minimal
- Выбор шрифта и размера текста
- Выравнивание текста
- Цвет текста и фона

### full

Полный набор инструментов:
- Все инструменты из medium
- Загрузка изображений
- Форматирование блоков (цитаты, код и т.д.)
- Очистка форматирования

## Решение проблем

### Дублирование названий шрифтов

Если в селекторе шрифтов появляется дублирование названий, убедитесь, что в файле `quill-font-fixes.css` скрыт внутренний span:

```css
.ql-snow .ql-picker.ql-font .ql-picker-label span {
  display: none;
}
```

### Неправильное отображение шрифтов

Если шрифты отображаются неправильно, проверьте, что стили в `quill-font-fixes.css` правильно настроены для каждого шрифта:

```css
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
  content: 'Arial' !important;
}
```

## Примечания

- При необходимости добавления нового визуального редактора рекомендуется использовать `QuillEditorWrapper` с подходящей конфигурацией панели инструментов
- Компонент `QuillEditor` полностью заменяет ранее использовавшийся `TiptapEditorCore`
- Все стили для Quill редактора находятся в директории `src/components/editor/quill/`
