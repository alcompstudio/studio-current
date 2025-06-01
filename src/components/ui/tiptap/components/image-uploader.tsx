"use client";

import React, { useState } from 'react';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (file: File) => Promise<UploadedImage>;
  onImageInsert: (imageUrl: string, alt?: string, title?: string) => void;
}

/**
 * Компонент для загрузки и вставки изображений в редактор
 */
export function ImageUploader({ onImageUpload, onImageInsert }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const uploadedImage = await onImageUpload(file);
      onImageInsert(uploadedImage.url, uploadedImage.alt, uploadedImage.title);
    } catch (err) {
      console.error('Ошибка загрузки изображения:', err);
      setError('Не удалось загрузить изображение. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
      // Сбрасываем значение input, чтобы можно было загрузить то же самое изображение повторно
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px dashed #d1d5db',
          background: 'white',
          cursor: 'pointer',
          fontSize: '0.875rem',
          width: '100%',
          marginBottom: '8px'
        }}
      >
        {isLoading ? (
          <span>Загрузка...</span>
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="16" 
              height="16" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ marginRight: '8px' }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Выбрать изображение
          </>
        )}
      </button>
      {error && (
        <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
