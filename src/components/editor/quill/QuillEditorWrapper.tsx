"use client";

import React from 'react';
import QuillEditor, { QuillToolbarType } from './QuillEditor';
import { UploadedImage } from '@/types/image';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';

interface QuillEditorWrapperProps<
  TFieldValues extends FieldValues = FieldValues
> {
  // Для интеграции с react-hook-form
  name?: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  
  // Для прямого использования без react-hook-form
  content?: string;
  onChange?: (content: string) => void;
  
  // Общие свойства
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  defaultToolbarConfig?: 'minimal' | 'medium' | 'full';
  onImageUpload?: (file: File) => Promise<UploadedImage>;
  [key: string]: any; // Для дополнительных атрибутов HTML
}

/**
 * Компонент-обертка для QuillEditor, совместимый с интерфейсом react-hook-form
 * для простой замены редактора
 */
export function QuillEditorWrapper<
  TFieldValues extends FieldValues = FieldValues
>({
  name,
  control,
  content: contentProp,
  onChange: onChangeProp,
  placeholder = "Введите текст...",
  className = "",
  editorClassName = "",
  defaultToolbarConfig = 'medium',
  onImageUpload,
  ...rest
}: QuillEditorWrapperProps<TFieldValues>) {
  
  // Конвертируем tiptap конфигурацию в формат QuillEditor
  const getQuillToolbarType = (config: 'minimal' | 'medium' | 'full'): QuillToolbarType => {
    switch (config) {
      case 'minimal':
        return QuillToolbarType.MINIMAL;
      case 'full':
        return QuillToolbarType.FULL;
      case 'medium':
      default:
        return QuillToolbarType.MEDIUM;
    }
  };

  const toolbarType = getQuillToolbarType(defaultToolbarConfig);

  // Если используется с react-hook-form
  if (name && control) {
    const { field } = useController({
      name,
      control,
      defaultValue: '' as any,
    });

    return (
      <div className={`quill-editor-wrapper ${className}`} {...rest}>
        <QuillEditor
          value={field.value || ''}
          onChange={field.onChange}
          placeholder={placeholder}
          className={editorClassName || ''}
          toolbarType={toolbarType}
        />
      </div>
    );
  }

  // Если используется без react-hook-form
  return (
    <div className={`quill-editor-wrapper ${className}`} {...rest}>
      <QuillEditor
        value={contentProp || ''}
        onChange={onChangeProp || (() => {})}
        placeholder={placeholder}
        className={editorClassName || ''}
        toolbarType={toolbarType}
      />
    </div>
  );
}
