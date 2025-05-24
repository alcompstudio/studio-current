"use client";

import { useState, ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteProjectDialogProps {
  projectId: string | number;
  className?: string;
  variant?: "outline" | "ghost" | "link" | "default" | "destructive" | "secondary" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  children?: ReactNode;
  buttonClassName?: string;
  onDeleteSuccess?: () => void;
}

export function DeleteProjectDialog({
  projectId,
  className,
  variant = "outline",
  size,
  children,
  buttonClassName,
  onDeleteSuccess
}: DeleteProjectDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при удалении проекта');
      }
      
      // Обновляем страницу или перенаправляем
      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        router.push('/projects');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при удалении проекта');
      console.error('Ошибка при удалении проекта:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={buttonClassName || `text-destructive hover:bg-destructive hover:text-destructive-foreground ${className || ''}`}
        >
          {children || <Trash2 className="h-4 w-4" />}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
          <AlertDialogDescription>
            Вы действительно хотите удалить этот проект? Это действие невозможно отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
