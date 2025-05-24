"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Clock
} from "lucide-react";
import type { Order } from "@/lib/types";
import type { OrderStatusOS } from "@/lib/types/order";

interface OrderDetailsTabsProps {
  order: Order;
  orderStatuses: OrderStatusOS[];
  projects: { id: number; title: string; currency?: string }[];
}

type ActiveTab = 'main' | 'description';

export default function OrderDetailsTabs({ 
  order, 
  orderStatuses,
  projects 
}: OrderDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('main');
  
  // Находим статус заказа
  const orderStatus = orderStatuses.find(
    s => typeof order.status === 'number' 
      ? s.id === order.status 
      : s.id === Number(order.status)
  );
  
  // Находим проект
  const project = projects.find(
    p => typeof order.project_id === 'number' 
      ? p.id === order.project_id 
      : p.id === Number(order.project_id)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Вкладки */}
      <div>
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('main')}
            className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                        ${activeTab === 'main'
                          ? 'font-semibold text-foreground border-b-[3px] border-primary'
                          : 'text-muted-foreground hover:text-foreground'}`}
          >
            Основная информация
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                        ${activeTab === 'description'
                          ? 'font-semibold text-foreground border-b-[3px] border-primary'
                          : 'text-muted-foreground hover:text-foreground'}`}
          >
            Описание
          </button>
        </div>

        {/* Содержимое вкладок */}
        <div className="bg-card rounded-xl shadow-sm mt-4 p-6">
          {/* Вкладка Основная информация */}
          {activeTab === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Основная информация */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Статус</p>
                  <div className="flex items-center mt-1">
                    {orderStatus ? (
                      <div
                        className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center"
                        style={{
                          backgroundColor: orderStatus.backgroundColor,
                          color: orderStatus.textColor,
                          borderColor: orderStatus.textColor
                        }}
                      >
                        <span 
                          className="h-2 w-2 rounded-full mr-1.5" 
                          style={{
                            backgroundColor: orderStatus.textColor
                          }}
                        />
                        {orderStatus.name}
                      </div>
                    ) : (
                      <Badge variant="outline">Неизвестно</Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Цена</p>
                  <p className="font-medium text-sm flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    {order.price !== null &&
                    order.price !== undefined &&
                    String(order.price).trim() !== ""
                      ? Number(order.price).toLocaleString()
                      : "Не указана"}{" "}
                    {project?.currency ?? ""}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Проект</p>
                  <p className="font-medium text-sm flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                    {project?.title ?? `ID: ${order.project_id}`}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Валюта</p>
                  <p className="font-medium text-sm flex items-center">
                    <CreditCard className="h-4 w-4 mr-1 text-muted-foreground" />
                    {project?.currency ?? "Не указана"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Создан</p>
                  <p className="font-medium text-sm flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    {order.createdAt instanceof Date
                      ? order.createdAt.toLocaleDateString()
                      : "Не указана"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Обновлен</p>
                  <p className="font-medium text-sm flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {order.updatedAt instanceof Date
                      ? order.updatedAt.toLocaleDateString()
                      : "Не указана"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Вкладка Описание */}
          {activeTab === 'description' && (
            <div>
              <p className="text-sm whitespace-pre-line">
                {order.description || "Описание не указано"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
