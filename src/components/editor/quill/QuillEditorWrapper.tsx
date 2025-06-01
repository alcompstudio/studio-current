"use client";

import React from 'react';
import QuillEditor, { QuillToolbarType } from './QuillEditor';
import { UploadedImage } from '@/components/ui/tiptap/types';

interface QuillEditorWrapperProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  defaultToolbarConfig?: 'minimal' | 'medium' | 'full';
  onImageUpload?: (file: File) => Promise<UploadedImage>;
}

/**
 * Компонент-обертка для QuillEditor, совместимый с интерфейсом TiptapEditorCore
 * для простой замены редактора
 */
export function QuillEditorWrapper({
  content,
  onChange,
  placeholder = "Введите текст...",
  className = "",
  editorClassName = "",
  defaultToolbarConfig = 'medium',
  onImageUpload,
}: QuillEditorWrapperProps) {
  
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

  return (
    <div className={`quill-editor-wrapper ${className}`}>
      <QuillEditor
        value={content}
        onChange={onChange}
        placeholder={placeholder}
        className={editorClassName}
        toolbarType={toolbarType}
      />
    </div>
  );
}
