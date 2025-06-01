"use client";

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import FontFamily from '@tiptap/extension-font-family';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Strike from '@tiptap/extension-strike';
import Youtube from '@tiptap/extension-youtube';
import CharacterCount from '@tiptap/extension-character-count';
import HardBreak from '@tiptap/extension-hard-break';
import { MenuBar } from './menu-bar';
import { UploadedImage } from '../types';

interface TiptapEditorCoreProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  defaultToolbarConfig?: 'minimal' | 'medium' | 'full';
  onImageUpload?: (file: File) => Promise<UploadedImage>;
}

/**
 * Основной компонент редактора Tiptap с расширениями и панелью инструментов
 */
export function TiptapEditorCore({
  content,
  onChange,
  placeholder = "Введите текст...",
  className = "",
  editorClassName = "",
  defaultToolbarConfig = 'medium',
  onImageUpload,
}: TiptapEditorCoreProps) {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Отключаем strike из StarterKit, чтобы использовать отдельное расширение
        strike: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Subscript,
      Superscript,
      Typography,
      FontFamily,
      Strike,
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        nocookie: true,
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      HardBreak,
      Image.configure({
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className={`tiptap-editor ${className}`}>
      <MenuBar 
        editor={editor} 
        defaultConfig={defaultToolbarConfig}
        onImageUpload={onImageUpload} 
      />
      <div className={`tiptap-content-wrapper ${editorClassName}`} style={{
        border: '1px solid hsl(240 5.9% 90%)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
