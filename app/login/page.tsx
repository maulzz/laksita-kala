// app/login/page.tsx

'use client'; // Wajib karena ada interaksi tombol (onClick)

import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Login ke Laksita Kala
          </h1>
          <p className="mb-8 text-neutral-500 dark:text-neutral-400">
            Satu langkah lagi untuk mulai mengatur semua tugasmu.
          </p>
        </div>
        
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
        >
          <FaGoogle className="h-5 w-5" />
          <span>Masuk dengan Google</span>
        </button>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Dengan melanjutkan, Anda akan diarahkan ke halaman login Google.
        </p>
      </div>
    </div>
  );
}