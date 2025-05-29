"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Интерфейс для типа ценообразования
interface PricingType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function PricingTypesManager() {
  const [pricingTypes, setPricingTypes] = useState<PricingType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Состояния для добавления и редактирования
  const [newTypeName, setNewTypeName] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [editedTypeName, setEditedTypeName] = useState<string>("");

  const { toast } = useToast();

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchPricingTypes();
  }, []);

  // Получение всех типов ценообразования
  const fetchPricingTypes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/pricing-types");

      if (!response.ok) {
        throw new Error("Не удалось загрузить типы ценообразования");
      }

      const data = await response.json();
      setPricingTypes(data);
    } catch (err) {
      console.error("Ошибка при загрузке типов ценообразования:", err);
      setError(
        "Не удалось загрузить типы ценообразования. Пожалуйста, попробуйте позже.",
      );
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить типы ценообразования",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Создание нового типа ценообразования
  const handleAddPricingType = async () => {
    if (!newTypeName.trim()) {
      toast({
        title: "Ошибка",
        description: "Название типа ценообразования не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/pricing-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTypeName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Не удалось создать тип ценообразования",
        );
      }

      const newType = await response.json();
      setPricingTypes([...pricingTypes, newType]);
      setNewTypeName("");
      setIsAdding(false);

      toast({
        title: "Успех",
        description: "Тип ценообразования успешно создан",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Ошибка при создании типа ценообразования:", err);
      toast({
        title: "Ошибка",
        description: err.message || "Не удалось создать тип ценообразования",
        variant: "destructive",
      });
    }
  };

  // Обновление типа ценообразования
  const handleUpdatePricingType = async (id: number) => {
    if (!editedTypeName.trim()) {
      toast({
        title: "Ошибка",
        description: "Название типа ценообразования не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/pricing-types/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedTypeName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Не удалось обновить тип ценообразования",
        );
      }

      const updatedType = await response.json();
      setPricingTypes(
        pricingTypes.map((type) => (type.id === id ? updatedType : type)),
      );

      setEditingTypeId(null);
      setEditedTypeName("");

      toast({
        title: "Успех",
        description: "Тип ценообразования успешно обновлен",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Ошибка при обновлении типа ценообразования:", err);
      toast({
        title: "Ошибка",
        description: err.message || "Не удалось обновить тип ценообразования",
        variant: "destructive",
      });
    }
  };

  // Удаление типа ценообразования
  const handleDeletePricingType = async (id: number) => {
    // Запрос подтверждения перед удалением
    if (!confirm("Вы уверены, что хотите удалить этот тип ценообразования?")) {
      return;
    }

    try {
      const response = await fetch(`/api/pricing-types/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Если тип используется в опциях, покажем специальное сообщение
        if (response.status === 409 && errorData.usageCount) {
          throw new Error(
            `Невозможно удалить тип ценообразования, так как он используется в ${errorData.usageCount} опциях`,
          );
        }

        throw new Error(
          errorData.error || "Не удалось удалить тип ценообразования",
        );
      }

      // Удаляем тип из состояния
      setPricingTypes(pricingTypes.filter((type) => type.id !== id));

      toast({
        title: "Успех",
        description: "Тип ценообразования успешно удален",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Ошибка при удалении типа ценообразования:", err);
      toast({
        title: "Ошибка",
        description: err.message || "Не удалось удалить тип ценообразования",
        variant: "destructive",
      });
    }
  };

  // Начало редактирования типа
  const startEditing = (type: PricingType) => {
    setEditingTypeId(type.id);
    setEditedTypeName(type.name);
  };

  // Отмена редактирования
  const cancelEditing = () => {
    setEditingTypeId(null);
    setEditedTypeName("");
  };

  // Отмена добавления
  const cancelAdding = () => {
    setIsAdding(false);
    setNewTypeName("");
  };

  return (
    <Card data-oid="gu7dsbc">
      <CardContent className="p-6" data-oid="1:wjt9a">
        {error && (
          <div
            className="mb-4 p-4 bg-red-50 text-red-600 rounded-md"
            data-oid="-.n3usw"
          >
            {error}
          </div>
        )}

        <div
          className="flex justify-between items-center mb-6"
          data-oid="e.xuk2f"
        >
          <h2 className="text-xl font-semibold" data-oid="rokn.zb">
            Типы ценообразования
          </h2>

          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="flex items-center"
              data-oid="l474z_4"
            >
              <PlusIcon className="h-4 w-4 mr-2" data-oid="pf:nu:s" />
              Добавить
            </Button>
          )}
        </div>

        {isAdding && (
          <div
            className="mb-6 p-4 border rounded-md bg-muted/20"
            data-oid="qg2dcs-"
          >
            <h3 className="text-sm font-medium mb-2" data-oid="_8m68gk">
              Новый тип ценообразования
            </h3>
            <div className="flex items-center space-x-2" data-oid="396m1sz">
              <Input
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="Название типа ценообразования"
                className="flex-1"
                data-oid="e75_bpy"
              />

              <Button
                onClick={handleAddPricingType}
                variant="default"
                size="sm"
                data-oid="7ml-zth"
              >
                <CheckIcon className="h-4 w-4" data-oid="s8ayohs" />
              </Button>
              <Button
                onClick={cancelAdding}
                variant="outline"
                size="sm"
                data-oid="55dkj27"
              >
                <XIcon className="h-4 w-4" data-oid="ejk059o" />
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-4" data-oid="j5.whh3">
            Загрузка...
          </div>
        ) : pricingTypes.length === 0 ? (
          <div
            className="text-center py-4 text-muted-foreground"
            data-oid="e3vpwc_"
          >
            Нет доступных типов ценообразования
          </div>
        ) : (
          <Table data-oid="bs08f4e">
            <TableHeader data-oid="_npvpu8">
              <TableRow data-oid="uuo5512">
                <TableHead data-oid="9j_8aoc">ID</TableHead>
                <TableHead data-oid=".ut9uzj">Название</TableHead>
                <TableHead data-oid="eosq9s2">Дата создания</TableHead>
                <TableHead className="text-right" data-oid="76gil_v">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-oid="8mwtj4s">
              {pricingTypes.map((type) => (
                <TableRow key={type.id} data-oid="_51t2yl">
                  <TableCell className="font-medium" data-oid="5..cvbx">
                    {type.id}
                  </TableCell>
                  <TableCell data-oid="5dgfqxe">
                    {editingTypeId === type.id ? (
                      <div
                        className="flex items-center space-x-2"
                        data-oid="50_nka1"
                      >
                        <Input
                          value={editedTypeName}
                          onChange={(e) => setEditedTypeName(e.target.value)}
                          className="h-8"
                          data-oid="yac522q"
                        />

                        <Button
                          onClick={() => handleUpdatePricingType(type.id)}
                          variant="default"
                          size="sm"
                          data-oid="f_myw3e"
                        >
                          <CheckIcon className="h-4 w-4" data-oid=".4jgxj1" />
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          variant="outline"
                          size="sm"
                          data-oid="iaqc23x"
                        >
                          <XIcon className="h-4 w-4" data-oid="c:rg:6a" />
                        </Button>
                      </div>
                    ) : (
                      type.name
                    )}
                  </TableCell>
                  <TableCell data-oid="94.g9qq">
                    {new Date(type.created_at).toLocaleString("ru-RU")}
                  </TableCell>
                  <TableCell className="text-right" data-oid="c3_ks3s">
                    {editingTypeId !== type.id && (
                      <div
                        className="flex justify-end space-x-2"
                        data-oid="i0kr6.o"
                      >
                        <Button
                          onClick={() => startEditing(type)}
                          variant="ghost"
                          size="sm"
                          data-oid="tofi-v:"
                        >
                          <PencilIcon className="h-4 w-4" data-oid="7mf88pb" />
                        </Button>
                        <Button
                          onClick={() => handleDeletePricingType(type.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          data-oid="vi4iuca"
                        >
                          <TrashIcon className="h-4 w-4" data-oid="_z5sham" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
