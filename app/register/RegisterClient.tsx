'use client';

import { useSearchParams } from 'next/navigation';
import {RegisterForm} from '@/components/register-form';

export default function RegisterClient() {
  const searchParams = useSearchParams();
  // You can pass redirect URL via props or context if needed

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Create your account
        </h1>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}
