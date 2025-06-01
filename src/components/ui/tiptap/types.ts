// Типы для компонента редактора Tiptap
import { Editor } from '@tiptap/react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

// Тип конфигурации панели инструментов
export type ToolbarConfigType = 'minimal' | 'medium' | 'full';

// Тип для загруженного изображения
export interface UploadedImage {
  id: string;
  url: string;
  title?: string;
  alt?: string;
}

// Пропсы компонента панели инструментов
export interface MenuBarProps {
  editor: Editor | null;
  defaultConfig?: ToolbarConfigType;
  onImageUpload?: (file: File) => Promise<UploadedImage>;
}

// Пропсы для основного компонента редактора
export interface TiptapEditorProps<
  TFieldValues extends FieldValues = FieldValues
> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  defaultToolbarConfig?: ToolbarConfigType;
  onImageUpload?: (file: File) => Promise<UploadedImage>;
  [key: string]: any; // Для дополнительных атрибутов HTML, например data-oid
}

// Пропсы для компонента отображения контента
export interface TiptapContentProps {
  content: string | null;
  className?: string;
}
