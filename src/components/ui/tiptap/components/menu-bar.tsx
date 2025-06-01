"use client";

import React, { useState, useEffect } from 'react';
import { MenuBarProps, ToolbarConfigType } from '../types';
import { Level } from '@tiptap/extension-heading';

/**
 * Компонент панели инструментов редактора с возможностью конфигурации
 */
export function MenuBar({ editor, defaultConfig = 'medium', onImageUpload }: MenuBarProps) {
  const [toolbarConfig, setToolbarConfig] = useState<ToolbarConfigType>(defaultConfig);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const menuBarRef = React.useRef<HTMLDivElement>(null);
  
  // Состояния для управления выпадающими списками
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Добавляем обработчик для закрытия выпадающих списков при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && menuBarRef.current && !menuBarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  if (!editor) {
    return null;
  }

  // Определяем, какие кнопки показывать в зависимости от конфигурации
  const showInConfig = (requiredConfig: ToolbarConfigType): boolean => {
    if (toolbarConfig === 'full') return true;
    if (toolbarConfig === 'medium' && (requiredConfig === 'medium' || requiredConfig === 'minimal')) return true;
    if (toolbarConfig === 'minimal' && requiredConfig === 'minimal') return true;
    return false;
  };

  // Стили для кнопок панели инструментов
  const buttonStyle = {
    marginRight: '0.25rem',
    marginBottom: '0.25rem',
    border: 'none',
    background: 'none',
    borderRadius: '16px',
    padding: '0.5rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    minWidth: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
  };

  // Обработчик загрузки изображения
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    try {
      const uploadedImage = await onImageUpload(file);
      editor.chain().focus().setImage({ src: uploadedImage.url, alt: uploadedImage.alt || '' }).run();
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
    }
  };

  // Обработчик вставки изображения по URL
  const handleImageInsert = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsImageDialogOpen(false);
    }
  };

  // Стили для панели инструментов
  const toolbarStyles = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#f8fafc',
    marginBottom: '1rem',
    fontFamily: '"Inter", sans-serif',
  };

  // Функция для открытия/закрытия выпадающего списка
  const toggleDropdown = (id: string) => {
    // Если кликнули по активному выпадающему списку - закрываем его
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      // Иначе закрываем предыдущий и открываем новый
      setActiveDropdown(id);
    }
  };

  return (
    <div 
      ref={menuBarRef}
      className="tiptap-menu-bar" 
      style={toolbarStyles}>
      {/* Основные инструменты */}
      <div className="tiptap-toolbar-main" style={{ display: 'flex', flexWrap: 'wrap' as const, flex: '1 1 auto' }}>
        {/* Базовое форматирование текста - всегда видимо */}
        {showInConfig('minimal') && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'is-active' : ''}
              title="Жирный"
              style={buttonStyle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'is-active' : ''}
              title="Курсив"
              style={buttonStyle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="4" x2="10" y2="4"></line>
                <line x1="14" y1="20" x2="5" y2="20"></line>
                <line x1="15" y1="4" x2="9" y2="20"></line>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'is-active' : ''}
              title="Подчеркнутый"
              style={buttonStyle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                <line x1="4" y1="21" x2="20" y2="21"></line>
              </svg>
            </button>

            {/* Разделитель */}
            <span className="tiptap-menu-separator"></span>

            {/* Списки - выпадающий список */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                className={editor.isActive('bulletList') || editor.isActive('orderedList') ? 'is-active' : ''}
                title="Списки"
                style={buttonStyle}
                onClick={() => toggleDropdown('list-dropdown')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="9" y1="6" x2="20" y2="6"></line>
                  <line x1="9" y1="12" x2="20" y2="12"></line>
                  <line x1="9" y1="18" x2="20" y2="18"></line>
                  <circle cx="4" cy="6" r="2"></circle>
                  <circle cx="4" cy="12" r="2"></circle>
                  <circle cx="4" cy="18" r="2"></circle>
                </svg>
                <span style={{ marginLeft: '4px' }}>Списки</span>
              </button>
              <div id="list-dropdown" style={{
                display: activeDropdown === 'list-dropdown' ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: '#fff',
                minWidth: '180px',
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                zIndex: 1,
                borderRadius: '8px',
                padding: '8px 0',
                marginTop: '4px',
              }}>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleBulletList().run();
                    setActiveDropdown(null);
                  }}
                  className={editor.isActive('bulletList') ? 'is-active' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive('bulletList') ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="9" y1="6" x2="20" y2="6"></line>
                    <line x1="9" y1="12" x2="20" y2="12"></line>
                    <line x1="9" y1="18" x2="20" y2="18"></line>
                    <circle cx="4" cy="6" r="2"></circle>
                    <circle cx="4" cy="12" r="2"></circle>
                    <circle cx="4" cy="18" r="2"></circle>
                  </svg>
                  Маркированный список
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleOrderedList().run();
                    setActiveDropdown(null);
                  }}
                  className={editor.isActive('orderedList') ? 'is-active' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive('orderedList') ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="10" y1="6" x2="21" y2="6"></line>
                    <line x1="10" y1="12" x2="21" y2="12"></line>
                    <line x1="10" y1="18" x2="21" y2="18"></line>
                    <path d="M4 6h1v4"></path>
                    <path d="M4 10h2"></path>
                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                  </svg>
                  Нумерованный список
                </button>
              </div>
            </div>
          </>
        )}

        {/* Средняя конфигурация - заголовки, ссылки, цитаты */}
        {showInConfig('medium') && (
          <>
            {/* Разделитель */}
            <span className="tiptap-menu-separator"></span>

            {/* Заголовки - выпадающий список */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                className={editor.isActive('heading') ? 'is-active' : ''}
                title="Заголовки"
                style={buttonStyle}
                onClick={() => toggleDropdown('heading-dropdown')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 12h12"></path>
                  <path d="M6 4h12"></path>
                  <path d="M6 20h12"></path>
                </svg>
                <span style={{ marginLeft: '4px' }}>Заголовок</span>
              </button>
              <div id="heading-dropdown" style={{
                display: activeDropdown === 'heading-dropdown' ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: '#fff',
                minWidth: '160px',
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                zIndex: 1,
                borderRadius: '8px',
                padding: '8px 0',
                marginTop: '4px',
              }}>
                {[1, 2, 3, 4, 5, 6].map(num => {
                  const level = num as Level;
                  return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleHeading({ level: level as Level }).run();
                      setActiveDropdown(null);
                    }}
                    className={editor.isActive('heading', { level }) ? 'is-active' : ''}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left' as const,
                      padding: '8px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      ...(editor.isActive('heading', { level }) ? { backgroundColor: '#F3F4F6' } : {})
                    }}
                  >
                    H{level}
                  </button>
                );
                })}
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setParagraph().run();
                    setActiveDropdown(null);
                  }}
                  className={editor.isActive('paragraph') ? 'is-active' : ''}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive('paragraph') ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Параграф
                </button>
              </div>
            </div>

            {/* Разделитель */}
            <span className="tiptap-menu-separator"></span>

            {/* Выравнивание */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                className={editor.isActive({ textAlign: 'left' }) || editor.isActive({ textAlign: 'center' }) || editor.isActive({ textAlign: 'right' }) || editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
                title="Выравнивание"
                style={buttonStyle}
                onClick={() => toggleDropdown('align-dropdown')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="12" x2="14" y2="12"></line>
                  <line x1="4" y1="18" x2="18" y2="18"></line>
                </svg>
                <span style={{ marginLeft: '4px' }}>Выравнивание</span>
              </button>
              <div id="align-dropdown" style={{
                display: activeDropdown === 'align-dropdown' ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: '#fff',
                minWidth: '160px',
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                zIndex: 1,
                borderRadius: '8px',
                padding: '8px 0',
                marginTop: '4px',
              }}>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setTextAlign('left').run();
                    setActiveDropdown(null);
                  }}
                  className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive({ textAlign: 'left' }) ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="14" y2="12"></line>
                    <line x1="4" y1="18" x2="18" y2="18"></line>
                  </svg>
                  По левому краю
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setTextAlign('center').run();
                    setActiveDropdown(null);
                  }}
                  className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive({ textAlign: 'center' }) ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                    <line x1="6" y1="18" x2="18" y2="18"></line>
                  </svg>
                  По центру
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setTextAlign('right').run();
                    setActiveDropdown(null);
                  }}
                  className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive({ textAlign: 'right' }) ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="10" y1="12" x2="20" y2="12"></line>
                    <line x1="6" y1="18" x2="20" y2="18"></line>
                  </svg>
                  По правому краю
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setTextAlign('justify').run();
                    setActiveDropdown(null);
                  }}
                  className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive({ textAlign: 'justify' }) ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                  </svg>
                  По ширине
                </button>
              </div>
            </div>

            {/* Ссылка */}
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={editor.isActive('link') ? 'is-active' : ''}
              title="Ссылка"
              style={buttonStyle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>
          </>
        )}

        {/* Полная конфигурация - вставка изображений, таблицы, видео, шрифты */}
        {showInConfig('full') && (
          <>
            {/* Разделитель */}
            <span className="tiptap-menu-separator"></span>
            
            {/* Выбор шрифта */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                title="Шрифт"
                style={buttonStyle}
                onClick={() => toggleDropdown('font-family-dropdown')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7V4h16v3"></path>
                  <path d="M9 20h6"></path>
                  <path d="M12 4v16"></path>
                </svg>
                <span style={{ marginLeft: '4px' }}>Шрифт</span>
              </button>
              <div id="font-family-dropdown" style={{
                display: activeDropdown === 'font-family-dropdown' ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: '#fff',
                minWidth: '160px',
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                zIndex: 1,
                borderRadius: '8px',
                padding: '8px 0',
                marginTop: '4px',
              }}>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontFamily('Inter, sans-serif').run();
                    setActiveDropdown(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive('textStyle', { fontFamily: 'Inter, sans-serif' }) ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Inter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontFamily('Arial, sans-serif').run();
                    setActiveDropdown(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive('textStyle', { fontFamily: 'Arial, sans-serif' }) ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  Arial
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontFamily('Georgia, serif').run();
                    setActiveDropdown(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive('textStyle', { fontFamily: 'Georgia, serif' }) ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  Georgia
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontFamily('monospace').run();
                    setActiveDropdown(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive('textStyle', { fontFamily: 'monospace' }) ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                  }}
                >
                  Monospace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontFamily('Roboto, sans-serif').run();
                    setActiveDropdown(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive('textStyle', { fontFamily: 'Roboto, sans-serif' }) ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  Roboto
                </button>
              </div>
            </div>
            
            {/* Выбор размера шрифта */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                title="Размер шрифта"
                style={buttonStyle}
                onClick={() => toggleDropdown('font-size-dropdown')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 7 4 4 20 4 20 7"></polyline>
                  <line x1="9" y1="20" x2="15" y2="20"></line>
                  <line x1="12" y1="4" x2="12" y2="20"></line>
                </svg>
                <span style={{ marginLeft: '4px' }}>Размер</span>
              </button>
              <div id="font-size-dropdown" style={{
                display: activeDropdown === 'font-size-dropdown' ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: '#fff',
                minWidth: '160px',
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                zIndex: 1,
                borderRadius: '8px',
                padding: '8px 0',
                marginTop: '4px',
              }}>
                {[
                  { label: 'Маленький', value: '12px' },
                  { label: 'Обычный', value: '16px' },
                  { label: 'Средний', value: '20px' },
                  { label: 'Большой', value: '24px' },
                  { label: 'Очень большой', value: '28px' },
                ].map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => {
                      // Используем команду updateAttributes для установки размера шрифта
                      editor.chain().focus()
                        .extendMarkRange('textStyle')
                        .updateAttributes('textStyle', { fontSize: size.value })
                        .run();
                      setActiveDropdown(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      textAlign: 'left' as const,
                      padding: '8px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: size.value,
                    }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Разделитель */}
            <span className="tiptap-menu-separator"></span>

            {/* Выбор цвета текста */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                title="Цвет текста"
                style={buttonStyle}
                onClick={() => toggleDropdown('text-color-dropdown')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 7h6l-3 10z"></path>
                  <line x1="4" y1="20" x2="20" y2="20"></line>
                </svg>
                <span style={{ marginLeft: '4px' }}>Цвет</span>
              </button>
              <div id="text-color-dropdown" style={{
                display: activeDropdown === 'text-color-dropdown' ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: '#fff',
                minWidth: '160px',
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                zIndex: 1,
                borderRadius: '8px',
                padding: '8px 0',
                marginTop: '4px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
                  {[
                    { color: '#000000', name: 'Черный' },
                    { color: '#FF0000', name: 'Красный' },
                    { color: '#0000FF', name: 'Синий' },
                    { color: '#008000', name: 'Зеленый' },
                    { color: '#FFA500', name: 'Оранжевый' },
                    { color: '#800080', name: 'Фиолетовый' },
                    { color: '#A52A2A', name: 'Коричневый' },
                    { color: '#808080', name: 'Серый' },
                  ].map((item) => (
                    <div 
                      key={item.color}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px',
                        cursor: 'pointer',
                        backgroundColor: editor.isActive('textStyle', { color: item.color }) ? '#F3F4F6' : 'transparent',
                        borderRadius: '4px',
                      }}
                      onClick={() => {
                        editor.chain().focus()
                          .extendMarkRange('textStyle')
                          .setColor(item.color)
                          .run();
                        setActiveDropdown(null);
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          margin: '0 8px 0 0',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          backgroundColor: item.color,
                          flexShrink: 0,
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Выбор цвета фона (подсветка) */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                title="Цвет фона"
                style={buttonStyle}
                onClick={() => toggleDropdown('highlight-color-dropdown')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19H5L3 17H12"></path>
                  <path d="M16 19h3l2-2h-5"></path>
                  <path d="M19 15l-7-8-8 8h15z"></path>
                </svg>
                <span style={{ marginLeft: '4px' }}>Фон</span>
              </button>
              <div id="highlight-color-dropdown" style={{
                display: activeDropdown === 'highlight-color-dropdown' ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: '#fff',
                minWidth: '160px',
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                zIndex: 1,
                borderRadius: '8px',
                padding: '8px 0',
                marginTop: '4px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
                  {[
                    { color: '#FFFF00', name: 'Желтый' },
                    { color: '#FF69B4', name: 'Розовый' },
                    { color: '#00FFFF', name: 'Голубой' },
                    { color: '#98FB98', name: 'Светло-зеленый' },
                    { color: '#FFD700', name: 'Золотой' },
                    { color: '#E6E6FA', name: 'Лавандовый' },
                    { color: '#F5F5DC', name: 'Бежевый' },
                    { color: '#FFFFFF', name: 'Белый' },
                  ].map((item) => (
                    <div 
                      key={item.color}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px',
                        cursor: 'pointer',
                        backgroundColor: editor.isActive('highlight', { color: item.color }) ? '#F3F4F6' : 'transparent',
                        borderRadius: '4px',
                      }}
                      onClick={() => {
                        editor.chain().focus()
                          .extendMarkRange('highlight')
                          .setHighlight({ color: item.color })
                          .run();
                        setActiveDropdown(null);
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          margin: '0 8px 0 0',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          backgroundColor: item.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: item.color === '#FFFFFF' ? '#000000' : 'inherit' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Разделитель */}
            <span className="tiptap-menu-separator"></span>

            {/* Специальные элементы - выпадающий список */}
            <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                className={editor.isActive('blockquote') || editor.isActive('codeBlock') ? 'is-active' : ''}
                title="Специальные элементы"
                style={buttonStyle}
                onClick={() => toggleDropdown('special-dropdown')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span style={{ marginLeft: '4px' }}>Специально</span>
              </button>
              <div id="special-dropdown" style={{
                display: activeDropdown === 'special-dropdown' ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: '#fff',
                minWidth: '180px',
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                zIndex: 1,
                borderRadius: '8px',
                padding: '8px 0',
                marginTop: '4px',
              }}>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleBlockquote().run();
                    setActiveDropdown(null);
                  }}
                  className={editor.isActive('blockquote') ? 'is-active' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive('blockquote') ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <path d="M14 9.5h3l-3 4.5h3"></path>
                    <path d="M8 9.5h3l-3 4.5h3"></path>
                  </svg>
                  Цитата
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleCodeBlock().run();
                    setActiveDropdown(null);
                  }}
                  className={editor.isActive('codeBlock') ? 'is-active' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: editor.isActive('codeBlock') ? '#F3F4F6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    flexWrap: 'wrap' as const,
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  Блок кода
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setHorizontalRule().run();
                    document.getElementById('special-dropdown')!.style.display = 'none';
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Горизонтальная линия
                </button>
              </div>
            </div>

            {/* Таблица */}
            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              title="Вставить таблицу"
              style={buttonStyle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </button>

            {/* Изображение */}
            <button
              type="button"
              onClick={() => onImageUpload ? fileInputRef.current?.click() : setIsImageDialogOpen(true)}
              title="Вставить изображение"
              style={buttonStyle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />

            {/* Блок для ввода URL изображения */}
            {isImageDialogOpen && (
              <div style={{ 
                position: 'absolute',
                top: '50px',
                right: '10px',
                background: 'white',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <input
                  type="text"
                  placeholder="URL изображения"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setIsImageDialogOpen(false)}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: '#f1f1f1' }}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleImageInsert}
                    style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      border: 'none', 
                      background: '#4F46E5',
                      color: 'white'
                    }}
                  >
                    Вставить
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Конфигуратор панели инструментов */}
      <div className="tiptap-toolbar-config" style={{ display: 'flex', alignItems: 'center' }}>
        <select
          value={toolbarConfig}
          onChange={(e) => setToolbarConfig(e.target.value as ToolbarConfigType)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            background: 'white',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <option value="minimal">Минимальная</option>
          <option value="medium">Средняя</option>
          <option value="full">Полная</option>
        </select>
      </div>
    </div>
  );
}
