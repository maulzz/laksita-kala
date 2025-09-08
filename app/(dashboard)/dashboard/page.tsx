// app/(dashboard)/dashboard/page.tsx

'use client';

import { useSession } from 'next-auth/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import PageHeader from '@/app/components/PageHeader';
import { useAddTaskStore } from '../../hooks/useAddTaskStore'; 

export default function DashboardPage() {
  const { data: session } = useSession();
  const { openModal } = useAddTaskStore();

  return (
    
    <div className="p-4 sm:p-6 md:p-8">
      
      <PageHeader
        title="Dashboard"
        subtitle={`Selamat datang kembali, ${session?.user?.name}!`}
        buttonText="Tugas"
        onButtonClick={openModal}
      />

      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
        <p className="text-neutral-500">
          Area untuk widget & chart akan ditempatkan di sini nanti.
        </p>
      </div>
    </div>
  );
}