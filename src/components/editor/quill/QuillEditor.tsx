"use client";

import { useEffect, useRef, useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import "./quill-font-fixes.css";

// Enum для типов панели инструментов
export enum QuillToolbarType {
  MINIMAL = "minimal",
  MEDIUM = "medium",
  FULL = "full"
}

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  toolbarType?: QuillToolbarType;
  error?: string;
  id?: string;
}

export default function QuillEditor({
  value,
  onChange,
  placeholder = "Введите текст...",
  label,
  className,
  toolbarType = QuillToolbarType.MEDIUM,
  error,
  id,
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [initialized, setInitialized] = useState(false);
  const [currentToolbarType, setCurrentToolbarType] = useState<QuillToolbarType>(toolbarType);
  const editorId = id || `quill-editor-${Math.random().toString(36).substring(2, 9)}`;

  // Функция для настройки панели инструментов в зависимости от выбранного типа
  const getToolbarOptions = (type: QuillToolbarType) => {
    // Список поддерживаемых шрифтов
    const fontList = [
      'sans-serif',
      'serif',
      'monospace',
      'inter',
      'arial',
      'helvetica',
      'times-new-roman',
      'georgia',
      'verdana',
      'tahoma',
      'trebuchet-ms',
      'roboto'
    ];
    
    switch (type) {
      case QuillToolbarType.MINIMAL:
        return [
          ['bold', 'italic', 'underline'],
          ['clean']
        ];
      case QuillToolbarType.MEDIUM:
        return [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'font': fontList }],
          ['clean']
        ];
      case QuillToolbarType.FULL:
      default:
        return [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': fontList }],
          [{ 'align': [] }],
          ['clean']
        ];
    }
  };

  // Очистить контейнер редактора
  const cleanupEditor = () => {
    if (editorRef.current) {
      // Удаляем все дочерние элементы, включая панели инструментов
      while (editorRef.current.firstChild) {
        editorRef.current.removeChild(editorRef.current.firstChild);
      }
    }
  };

  // Полностью уничтожить экземпляр редактора
  const destroyQuill = () => {
    if (quillRef.current) {
      quillRef.current.off('text-change');
      quillRef.current = null;
    }
    cleanupEditor();
    setInitialized(false);
  };

  // Функция очистки обзервера изменений DOM
  let observerInstance: MutationObserver | null = null;
  
  const cleanupObserver = () => {
    if (observerInstance) {
      observerInstance.disconnect();
      observerInstance = null;
    }
  };

  // Функция для обновления текста метки селектора шрифтов
  const updateLabelText = (fontValue: string) => {
    const fontNameMap: Record<string, string> = {
      'sans-serif': 'Sans Serif',
      'serif': 'Serif',
      'monospace': 'Monospace',
      'inter': 'Inter',
      'arial': 'Arial',
      'helvetica': 'Helvetica',
      'times-new-roman': 'Times New Roman',
      'georgia': 'Georgia',
      'verdana': 'Verdana',
      'tahoma': 'Tahoma',
      'trebuchet-ms': 'Trebuchet MS',
      'roboto': 'Roboto'
    };
    
    const label = document.querySelector('.ql-font .ql-picker-label');
    if (label && fontValue in fontNameMap) {
      // Создаем span для отображения названия шрифта
      const span = document.createElement('span');
      span.textContent = fontNameMap[fontValue];
      
      // Сохраняем SVG из label
      const svg = label.querySelector('svg');
      
      // Очищаем label
      label.innerHTML = '';
      
      // Добавляем span и SVG обратно
      label.appendChild(span);
      if (svg) label.appendChild(svg);
      
      label.setAttribute('data-value', fontValue);
    }
  };
  
  // Функция для работы с элементами выбора шрифта
  const updateFontPickerItems = () => {
    // Карта соответствия технических имен шрифтов и отображаемых названий
    const fontNameMap: Record<string, string> = {
      'sans-serif': 'Sans Serif',
      'serif': 'Serif',
      'monospace': 'Monospace',
      'inter': 'Inter',
      'arial': 'Arial',
      'helvetica': 'Helvetica',
      'times-new-roman': 'Times New Roman',
      'georgia': 'Georgia',
      'verdana': 'Verdana',
      'tahoma': 'Tahoma',
      'trebuchet-ms': 'Trebuchet MS',
      'roboto': 'Roboto'
    };
    
    try {
      // Очищаем содержимое списка и создаём заново
      const fontPickerOptions = document.querySelector('.ql-font .ql-picker-options');
      if (fontPickerOptions) {
        // Очищаем все текущие элементы
        fontPickerOptions.innerHTML = '';
        
        // Создаём новые элементы для каждого шрифта
        Object.entries(fontNameMap).forEach(([value, displayName]) => {
          const item = document.createElement('span');
          item.className = 'ql-picker-item';
          item.setAttribute('data-value', value);
          item.textContent = displayName;
          // Применяем шрифт к самому элементу для демонстрации
          item.style.fontFamily = value;
          // Добавляем в список
          fontPickerOptions.appendChild(item);
        });
        
        // Добавляем триггеры для выбора шрифта
        const pickerItems = fontPickerOptions.querySelectorAll('.ql-picker-item');
        pickerItems.forEach(item => {
          item.addEventListener('click', () => {
            const value = item.getAttribute('data-value') || '';
            if (value in fontNameMap) {
              updateLabelText(value);
            }
          });
        });
      }
      
      // Обновляем метку выбора шрифта при начальной загрузке
      const fontPickerLabel = document.querySelector('.ql-font .ql-picker-label');
      if (fontPickerLabel) {
        const value = fontPickerLabel.getAttribute('data-value') || 'sans-serif';
        // Используем обновленный метод для правильного отображения имени шрифта
        updateLabelText(value);
      }
    } catch (err) {
      console.error('Ошибка при обновлении шрифтов:', err);
    }
  };
  
  // Функция для начальной установки label шрифта
  const initFontPickerLabel = () => {
    setTimeout(() => {
      const label = document.querySelector('.ql-font .ql-picker-label');
      if (label) {
        const value = label.getAttribute('data-value') || 'sans-serif';
        updateLabelText(value);
      }
    }, 200); // Небольшая задержка для гарантии загрузки компонентов Quill
  };
  
  // Инициализация Quill
  const initQuill = async () => {
    if (typeof window === 'undefined' || !editorRef.current) return;

    try {
      // Полная очистка перед инициализацией - важно для предотвращения дублирования
      destroyQuill();
      cleanupEditor();
      cleanupObserver();
      
      // Динамический импорт Quill
      const QuillModule = await import('quill');
      const Quill = QuillModule.default;
      
      // Регистрация шрифтов с типизацией
      try {
        // Только регистрируем шрифты, но не меняем UI
        const Font = Quill.import('formats/font') as any;
        Font.whitelist = [
          'sans-serif',
          'serif',
          'monospace',
          'inter',
          'arial',
          'helvetica',
          'times-new-roman',
          'georgia',
          'verdana',
          'tahoma',
          'trebuchet-ms',
          'roboto',
        ];
        Quill.register(Font, true);
        
        // Синхронизация с выбранным шрифтом
        quillRef.current?.on('selection-change', (range: { index: number; length: number } | null, oldRange: { index: number; length: number } | null, source: string) => {
          if (range) {
            const format = quillRef.current?.getFormat(range);
            if (format && format.font) {
              // Обновляем метку выбора шрифта при изменении шрифта
              setTimeout(() => {
                const fontName = format.font;
                updateLabelText(fontName);
              }, 0);
            }
          }
        });
      } catch (err) {
        console.warn('Ошибка при регистрации шрифтов:', err);
      }
      
      // Создаем мутационный обзервер для отслеживания изменений в DOM
      observerInstance = new MutationObserver((mutations) => {
        let needsUpdate = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && 
              mutation.addedNodes.length > 0 && 
              mutation.target.nodeName === 'SPAN' && 
              (mutation.target as HTMLElement).classList.contains('ql-picker-options')) {
            needsUpdate = true;
          }
        });
        
        // Обновляем элементы выбора шрифта только при необходимости
        if (needsUpdate) {
          setTimeout(updateFontPickerItems, 10);
        }
      });
      
      // Запускаем обзервер для отслеживания изменений в DOM
      observerInstance.observe(document.body, { childList: true, subtree: true, attributes: true });
      
      // Создаем чистый контейнер для редактора
      const editorContainer = document.createElement('div');
      editorContainer.className = 'quill-editor-inner';
      
      // Проверяем, что контейнер пустой перед добавлением
      if (editorRef.current.childNodes.length === 0) {
        editorRef.current.appendChild(editorContainer);
      } else {
        // Если уже есть дочерние элементы, заменяем все на новый контейнер
        cleanupEditor();
        editorRef.current.appendChild(editorContainer);
      }
      
      // Инициализация Quill с выбранным типом панели инструментов
      quillRef.current = new Quill(editorContainer, {
        modules: {
          toolbar: getToolbarOptions(currentToolbarType)
        },
        placeholder,
        theme: 'snow'
      });
      
      // Устанавливаем начальное значение
      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
      
      // Обработчик изменений
      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML;
        onChange(html);
      });
      
      // Инициализируем подписи шрифтов после инициализации редактора
      initFontPickerLabel();
      
      setInitialized(true);
    } catch (error) {
      console.error('Ошибка инициализации Quill:', error);
    }
  };
  
  // Обработчик выбора типа панели инструментов
  const handleToolbarTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentToolbarType(e.target.value as QuillToolbarType);
  };

  // Инициализация при монтировании компонента
  useEffect(() => {
    initQuill();
    
    // Очистка при размонтировании
    return () => destroyQuill();
  }, []);
  
  // При изменении toolbarType извне
  useEffect(() => {
    if (toolbarType !== currentToolbarType) {
      setCurrentToolbarType(toolbarType);
    }
  }, [toolbarType]);

  // При изменении значения извне
  useEffect(() => {
    if (initialized && quillRef.current) {
      const currentContent = quillRef.current.root.innerHTML;
      if (value !== currentContent && value !== undefined) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
      }
    }
  }, [value, initialized]);
  
  // При изменении типа панели инструментов
  useEffect(() => {
    if (initialized) {
      initQuill();
    }
  }, [currentToolbarType]);
  
  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className="quill-editor-container">
        <div className="toolbar-selector mb-2">
          <label className="mr-2 text-sm font-medium">Тип панели инструментов:</label>
          <select 
            value={currentToolbarType} 
            onChange={handleToolbarTypeChange}
            className="px-3 py-1 rounded-md border border-input bg-background text-sm"
          >
            <option value={QuillToolbarType.MINIMAL}>Минимальная</option>
            <option value={QuillToolbarType.MEDIUM}>Средняя</option>
            <option value={QuillToolbarType.FULL}>Полная</option>
          </select>
        </div>
        
        {/* Контейнер редактора */}
        <FormControl>
          <div
            id={editorId}
            ref={editorRef}
            className="quill-editor border rounded-md w-full"
          />
        </FormControl>
      </div>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}