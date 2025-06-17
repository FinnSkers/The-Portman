import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterData, User, AuthResponse } from '@/lib/api/auth';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Auth Hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current user
  const useCurrentUser = (options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: authKeys.user(),
      queryFn: authService.getCurrentUser,
      enabled: authService.isAuthenticated(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    });
  };

  // Login mutation
  const useLogin = (options?: UseMutationOptions<AuthResponse, Error, LoginCredentials>) => {
    return useMutation({
      mutationFn: authService.login,
      onSuccess: (data) => {
        queryClient.setQueryData(authKeys.user(), data.user);
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      },
      ...options,
    });
  };

  // Register mutation
  const useRegister = (options?: UseMutationOptions<AuthResponse, Error, RegisterData>) => {
    return useMutation({
      mutationFn: authService.register,
      onSuccess: (data) => {
        queryClient.setQueryData(authKeys.user(), data.user);
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      },
      ...options,
    });
  };

  // Logout mutation
  const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
    return useMutation({
      mutationFn: authService.logout,
      onSuccess: () => {
        queryClient.clear(); // Clear all cached data
        queryClient.removeQueries({ queryKey: authKeys.all });
      },
      ...options,
    });
  };

  // Update profile mutation
  const useUpdateProfile = (options?: UseMutationOptions<User, Error, Partial<User>>) => {
    return useMutation({
      mutationFn: authService.updateProfile,
      onSuccess: (data) => {
        queryClient.setQueryData(authKeys.user(), data);
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      },
      ...options,
    });
  };

  // Change password mutation
  const useChangePassword = (options?: UseMutationOptions<void, Error, { oldPassword: string; newPassword: string }>) => {
    return useMutation({
      mutationFn: ({ oldPassword, newPassword }) => authService.changePassword(oldPassword, newPassword),
      ...options,
    });
  };

  // Request password reset mutation
  const useRequestPasswordReset = (options?: UseMutationOptions<void, Error, string>) => {
    return useMutation({
      mutationFn: authService.requestPasswordReset,
      ...options,
    });
  };

  // Reset password mutation
  const useResetPassword = (options?: UseMutationOptions<void, Error, { token: string; newPassword: string }>) => {
    return useMutation({
      mutationFn: ({ token, newPassword }) => authService.resetPassword(token, newPassword),
      ...options,
    });
  };

  return {
    // Queries
    useCurrentUser,
    
    // Mutations
    useLogin,
    useRegister,
    useLogout,
    useUpdateProfile,
    useChangePassword,
    useRequestPasswordReset,
    useResetPassword,
    
    // Utils
    isAuthenticated: authService.isAuthenticated,
    getStoredUser: authService.getStoredUser,
    getAuthState: authService.getAuthState,
  };
};

// Hook for checking authentication status
export const useAuthStatus = () => {
  const authState = authService.getAuthState();
  
  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    token: authState.token,
  };
};
