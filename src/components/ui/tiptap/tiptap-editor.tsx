"use client";

import React from 'react';
import { Controller } from 'react-hook-form';
import { QuillEditorWrapper } from '@/components/editor/quill/QuillEditorWrapper';
import { TiptapEditorProps, UploadedImage } from './types';
import './tiptap-editor.css';
import './custom-tiptap.css';

/**
 * Компонент редактора TipTap с интеграцией react-hook-form
 * и конфигурируемой панелью инструментов
 */
export function TiptapEditor<
  TFieldValues extends Record<string, any> = Record<string, any>
>({
  name,
  control,
  placeholder = "Введите текст...",
  className = "",
  editorClassName = "",
  defaultToolbarConfig = 'medium',
  onImageUpload,
  ...rest
}: TiptapEditorProps<TFieldValues>) {
  
  // Функция-заглушка для загрузки изображений, если не предоставлен специальный обработчик
  const defaultImageUpload = async (file: File): Promise<UploadedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // Возвращаем изображение в формате base64
          resolve({
            id: new Date().getTime().toString(),
            url: e.target.result.toString(),
            alt: file.name
          });
        } else {
          reject(new Error('Ошибка чтения файла'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Ошибка чтения файла'));
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Используем предоставленный обработчик загрузки или заглушку
  const handleImageUpload = onImageUpload || defaultImageUpload;

  return (
    <div className={`tiptap-editor-wrapper ${className}`} {...rest}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <QuillEditorWrapper
            content={field.value || ''}
            onChange={field.onChange}
            placeholder={placeholder}
            editorClassName={editorClassName}
            defaultToolbarConfig={defaultToolbarConfig}
            onImageUpload={handleImageUpload}
          />
        )}
      />
    </div>
  );
}
