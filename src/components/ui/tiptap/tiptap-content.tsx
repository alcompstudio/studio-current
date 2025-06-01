"use client";

import React from 'react';
import { TiptapContentProps } from './types';
import './tiptap-editor.css';

export function TiptapContent({ content, className = "" }: TiptapContentProps) {
  if (!content) return null;
  
  return (
    <div 
      className={`tiptap-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}
