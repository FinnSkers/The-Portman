import React from 'react';
import { MainLayout } from '@/components/layout';
import { RegisterForm } from '@/components/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account - Portman',
  description: 'Create your Portman account and start building your professional portfolio today.',
};

export default function RegisterPage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <RegisterForm />
        </div>
      </div>
    </MainLayout>
  );
}
