"use client";

import { useState } from 'react';

// Тип Project. В идеале, его следует вынести в общий файл типов (например, src/types.ts)
// и импортировать сюда, а также в page.tsx.
// Здесь он дублируется для простоты и инкапсуляции компонента.
export type Project = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  currency: string;
  budget: number;
  created_at: string;
  updated_at: string;
  customer?: {
    id: number;
    name: string;
    email: string;
  };
};

type ActiveTab = 'info' | 'description';

export default function ProjectDetailsTabs({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');

  return (
    <div className="flex flex-col gap-6">

      {/* Вкладки */}
      <div>
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                        ${activeTab === 'info'
                          ? 'font-semibold text-foreground border-b-[3px] border-primary'
                          : 'text-muted-foreground hover:text-foreground'}`}
          >
            Основная информация
          </button>
          {project.description && (
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                          ${activeTab === 'description'
                            ? 'font-semibold text-foreground border-b-[3px] border-primary'
                            : 'text-muted-foreground hover:text-foreground'}`}
            >
              Описание проекта
            </button>
          )}
        </div>

        {/* Содержимое вкладок - без внутренних отступов */}
        <div className="bg-card rounded-xl shadow-sm mt-4 p-6">
          {activeTab === 'info' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {project.customer && (
                    <div>
                      <p className="text-sm text-muted-foreground">Клиент</p>
                      <p className="font-medium text-sm">
                        {project.customer.name}
                        {project.customer.email && (
                          <span className="block text-sm text-muted-foreground">
                            {project.customer.email}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Бюджет</p>
                    <p className="font-medium text-sm">
                      {project.budget ? (
                        <>
                          {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: project.currency || 'RUB',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(project.budget)}
                        </>
                      ) : 'Не указан'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">ID проекта</p>
                    <p className="font-medium text-sm">
                      {project.id}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Дата обновления</p>
                    <p className="font-medium text-sm">
                      {new Date(project.updated_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Дата создания</p>
                    <p className="font-medium text-sm">
                      {new Date(project.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'description' && project.description && (
            <div>
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-foreground text-sm">{project.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
