import React from 'react';
import { MainLayout } from '@/components/layout';
import { LoginForm } from '@/components/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Portman',
  description: 'Sign in to your Portman account and manage your professional portfolio.',
};

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
}
