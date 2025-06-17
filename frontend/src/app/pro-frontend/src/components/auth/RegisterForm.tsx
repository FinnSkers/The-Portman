"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Input, AnimatedButton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { useRegister } = useAuth();
  const registerMutation = useRegister({
    onSuccess: () => {
      router.push('/dashboard');
    },
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword: _, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
    >      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>
      
      {registerMutation.error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm"
        >
          {registerMutation.error.message || 'Failed to register. Please try a different email.'}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>
        
        <div>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>
        
        <div>
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>
          <AnimatedButton 
          type="submit"
          variant="primary"
          animationVariant="pulse"
          className="w-full"
          isLoading={registerMutation.isPending}
        >
          Create Account
        </AnimatedButton>
      </form>
      
      <div className="mt-5 text-center text-sm">
        <p className="text-gray-600 mb-2">
          By signing up, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
        </p>
        
        <p className="text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign In
          </a>
        </p>
      </div>
    </motion.div>
  );
};
