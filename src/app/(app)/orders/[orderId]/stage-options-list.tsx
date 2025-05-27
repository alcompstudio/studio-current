"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StageOption } from '@/lib/types/stage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import StageOptionForm from './stage-option-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StageOptionsListProps {
  orderId: string;
  stageId: string;
  orderCurrency?: string;
}

const StageOptionsList: React.FC<StageOptionsListProps> = ({ 
  orderId, 
  stageId,
  orderCurrency = 'руб.'
}) => {
  const [options, setOptions] = useState<StageOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOption, setEditingOption] = useState<StageOption | null>(null);
  const [deleteOptionId, setDeleteOptionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Функция загрузки опций для этапа
  const fetchOptions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Запрос опций для этапа: /api/orders/${orderId}/stages/${stageId}/options`);
      const response = await fetch(`/api/orders/${orderId}/stages/${stageId}/options`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Ошибка HTTP: ${response.status}`, errorText);
        throw new Error(`Ошибка HTTP: ${response.status}. ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Полученные опции:', data);
      setOptions(data);
    } catch (error: any) {
      const errorMessage = error.message || 'Неизвестная ошибка';
      console.error('Ошибка при загрузке опций:', errorMessage, error);
      setError(`Не удалось загрузить опции этапа: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка опций при монтировании компонента
  useEffect(() => {
    if (orderId && stageId) {
      fetchOptions();
    }
  }, [orderId, stageId]);

  // Обработчики событий форм
  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingOption(null);
    fetchOptions();
  };
  
  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingOption(null);
  };
  
  // Обработчик удаления опции
  const handleDelete = async () => {
    if (!deleteOptionId) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/orders/${orderId}/stages/${stageId}/options/${deleteOptionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Не удалось удалить опцию');
      }
      
      toast({
        title: 'Опция удалена',
        description: 'Опция успешно удалена из этапа',
        variant: 'default',
      });
      
      fetchOptions();
    } catch (error) {
      console.error('Ошибка при удалении опции:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить опцию',
        variant: 'destructive',
      });
    } finally {
      setDeleteOptionId(null);
      setIsDeleting(false);
    }
  };
  
  // Отображение загрузки
  if (isLoading && options.length === 0) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <p className="ml-2 text-sm text-muted-foreground">Загрузка опций...</p>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="flex justify-between items-center border-t pt-3 mt-3 mb-4">
        <p className="text-sm font-medium">Опции этапа</p>
        {!showAddForm && !editingOption && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-xs border-primary text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary" 
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить опцию
          </Button>
        )}
      </div>
      
      {/* Форма добавления опции */}
      {showAddForm && (
        <StageOptionForm
          orderId={orderId}
          stageId={stageId}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          orderCurrency={orderCurrency}
        />
      )}
      
      {/* Форма редактирования опции */}
      {editingOption && (
        <StageOptionForm
          orderId={orderId}
          stageId={stageId}
          optionToEdit={editingOption}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          orderCurrency={orderCurrency}
        />
      )}
      
      {/* Список опций */}
      {options.length === 0 && !showAddForm ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-2">
            У этого этапа еще нет опций.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.id} className="p-3 border rounded-md bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-sm">{option.name}</h5>
                  {option.description && (
                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setEditingOption(option)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive" 
                    onClick={() => setDeleteOptionId(option.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              {/* Детали опции */}
              <div className="mt-2 text-xs">
                {/* Строка с ценой */}
                <div className="mb-1">
                  <span className="text-muted-foreground">Цена: </span>
                  {option.pricing_type === 'calculable' ? (
                    <span className="font-medium">Калькулируемая, {option.price_per_unit} {orderCurrency} за {option.nominal_volume} {option.volume_unit}</span>
                  ) : (
                    <span className="font-medium">Входит в стоимость</span>
                  )}
                </div>
                
                {/* Расчетная стоимость для калькулируемых опций */}
                {option.pricing_type === 'calculable' && (
                  <div className="mt-1 p-1.5 bg-primary/10 rounded">
                    <span className="text-muted-foreground">Расчетная стоимость: </span>
                    <span className="font-medium">
                      {option.calculated_price_min && option.calculated_price_max
                        ? `${Number(option.calculated_price_min).toFixed(2)} - ${Number(option.calculated_price_max).toFixed(2)} ${orderCurrency} за ${option.volume_min} - ${option.volume_max} ${option.volume_unit}`
                        : option.calculated_price_min
                          ? `${Number(option.calculated_price_min).toFixed(2)} ${orderCurrency} за ${option.volume_min} ${option.volume_unit}`
                          : option.calculated_price_max
                            ? `${Number(option.calculated_price_max).toFixed(2)} ${orderCurrency} за ${option.volume_max} ${option.volume_unit}`
                            : '-'
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteOptionId !== null} onOpenChange={(open) => !open && setDeleteOptionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы действительно хотите удалить эту опцию? Это действие невозможно отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                'Удалить'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StageOptionsList;
