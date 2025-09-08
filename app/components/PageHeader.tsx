'use client'

import React from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useAddTaskStore } from '../hooks/useAddTaskStore';


interface PageHeaderProps {
  title: string;
  subtitle?: string; 
  buttonText: string;
  onButtonClick: () => void; 
}

export default function PageHeader({ title, subtitle, buttonText, onButtonClick }: PageHeaderProps) {

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-neutral-500">
            {subtitle}
          </p>
        )}
      </div>
      <div>
        <button 
          onClick={onButtonClick}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-bold text-white transition-colors hover:bg-orange-600"
        >
          <PlusIcon className="h-5 w-5" />
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}