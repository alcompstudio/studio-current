// Типы для работы с изображениями

// Тип для загруженного изображения
export interface UploadedImage {
  id: string;
  url: string;
  title?: string;
  alt?: string;
}
