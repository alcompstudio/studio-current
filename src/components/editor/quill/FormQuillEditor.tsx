"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import QuillEditor, { QuillToolbarType } from "./QuillEditor";

interface FormQuillEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  defaultToolbarType?: QuillToolbarType;
}

export function FormQuillEditor({
  name,
  label,
  placeholder,
  className,
  defaultToolbarType = QuillToolbarType.MEDIUM,
}: FormQuillEditorProps) {
  const formContext = useFormContext();
  const [toolbarType, setToolbarType] = useState<QuillToolbarType>(defaultToolbarType);
  
  // Если форма не существует, показываем сообщение об ошибке
  if (!formContext) {
    return <div className="text-red-500">FormQuillEditor должен использоваться внутри FormProvider</div>;
  }

  const { control, formState } = formContext;
  const { errors } = formState;
  const error = errors[name]?.message as string | undefined;

  // Функция для обновления типа панели инструментов
  const handleToolbarTypeChange = (newType: QuillToolbarType) => {
    setToolbarType(newType);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <QuillEditor
          id={name}
          value={field.value || ""}
          onChange={field.onChange}
          placeholder={placeholder}
          label={label}
          className={className}
          toolbarType={toolbarType}
          error={error}
        />
      )}
    />
  );
}
