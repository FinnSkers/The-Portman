import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { portfolioService, Portfolio, PortfolioTemplate, PortfolioStats, CreatePortfolioRequest, UpdatePortfolioRequest, PortfolioSection } from '@/lib/api/portfolio';

// Query Keys
export const portfolioKeys = {
  all: ['portfolio'] as const,
  lists: () => [...portfolioKeys.all, 'list'] as const,
  list: (filters: string) => [...portfolioKeys.lists(), { filters }] as const,
  details: () => [...portfolioKeys.all, 'detail'] as const,
  detail: (id: string) => [...portfolioKeys.details(), id] as const,
  stats: (id: string) => [...portfolioKeys.all, 'stats', id] as const,
  templates: () => [...portfolioKeys.all, 'templates'] as const,
  template: (id: string) => [...portfolioKeys.templates(), id] as const,
  public: () => [...portfolioKeys.all, 'public'] as const,
  slug: (slug: string) => [...portfolioKeys.public(), slug] as const,
};

export const usePortfolio = () => {
  const queryClient = useQueryClient();

  // Get all portfolio templates
  const useTemplates = (options?: Omit<UseQueryOptions<PortfolioTemplate[]>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: portfolioKeys.templates(),
      queryFn: portfolioService.getTemplates,
      staleTime: 30 * 60 * 1000, // 30 minutes
      ...options,
    });
  };

  // Get template by ID
  const useTemplate = (templateId: string, options?: Omit<UseQueryOptions<PortfolioTemplate>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: portfolioKeys.template(templateId),
      queryFn: () => portfolioService.getTemplate(templateId),
      enabled: !!templateId,
      staleTime: 30 * 60 * 1000,
      ...options,
    });
  };

  // Get user portfolios
  const useUserPortfolios = (options?: Omit<UseQueryOptions<Portfolio[]>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: portfolioKeys.lists(),
      queryFn: portfolioService.getUserPortfolios,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    });
  };

  // Get portfolio by ID
  const usePortfolioById = (portfolioId: string, options?: Omit<UseQueryOptions<Portfolio>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: portfolioKeys.detail(portfolioId),
      queryFn: () => portfolioService.getPortfolio(portfolioId),
      enabled: !!portfolioId,
      staleTime: 5 * 60 * 1000,
      ...options,
    });
  };

  // Get portfolio by slug (public)
  const usePortfolioBySlug = (slug: string, options?: Omit<UseQueryOptions<Portfolio>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: portfolioKeys.slug(slug),
      queryFn: () => portfolioService.getPortfolioBySlug(slug),
      enabled: !!slug,
      staleTime: 10 * 60 * 1000, // 10 minutes for public portfolios
      ...options,
    });
  };

  // Get portfolio stats
  const usePortfolioStats = (
    portfolioId: string, 
    period: '7d' | '30d' | '90d' | '1y' = '30d',
    options?: Omit<UseQueryOptions<PortfolioStats>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery({
      queryKey: [...portfolioKeys.stats(portfolioId), period],
      queryFn: () => portfolioService.getPortfolioStats(portfolioId, period),
      enabled: !!portfolioId,
      staleTime: 5 * 60 * 1000,
      ...options,
    });
  };

  // Create portfolio mutation
  const useCreatePortfolio = (options?: UseMutationOptions<Portfolio, Error, CreatePortfolioRequest>) => {
    return useMutation({
      mutationFn: portfolioService.createPortfolio,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
        queryClient.setQueryData(portfolioKeys.detail(data.id), data);
      },
      ...options,
    });
  };

  // Update portfolio mutation
  const useUpdatePortfolio = (options?: UseMutationOptions<Portfolio, Error, { portfolioId: string; data: UpdatePortfolioRequest }>) => {
    return useMutation({
      mutationFn: ({ portfolioId, data }) => portfolioService.updatePortfolio(portfolioId, data),
      onSuccess: (data, { portfolioId }) => {
        queryClient.setQueryData(portfolioKeys.detail(portfolioId), data);
        queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      },
      ...options,
    });
  };

  // Publish portfolio mutation
  const usePublishPortfolio = (options?: UseMutationOptions<{ public_url: string }, Error, string>) => {
    return useMutation({
      mutationFn: portfolioService.publishPortfolio,
      onSuccess: (_, portfolioId) => {
        queryClient.invalidateQueries({ queryKey: portfolioKeys.detail(portfolioId) });
        queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      },
      ...options,
    });
  };

  // Delete portfolio mutation
  const useDeletePortfolio = (options?: UseMutationOptions<void, Error, string>) => {
    return useMutation({
      mutationFn: portfolioService.deletePortfolio,
      onSuccess: (_, portfolioId) => {
        queryClient.removeQueries({ queryKey: portfolioKeys.detail(portfolioId) });
        queryClient.removeQueries({ queryKey: portfolioKeys.stats(portfolioId) });
        queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      },
      ...options,
    });
  };

  // Generate portfolio preview mutation
  const useGeneratePreview = (options?: UseMutationOptions<{ preview_url: string; expires_at: string }, Error, string>) => {
    return useMutation({
      mutationFn: portfolioService.generatePreview,
      ...options,
    });
  };

  // Clone portfolio mutation
  const useClonePortfolio = (options?: UseMutationOptions<Portfolio, Error, { portfolioId: string; newTitle: string }>) => {
    return useMutation({
      mutationFn: ({ portfolioId, newTitle }) => portfolioService.clonePortfolio(portfolioId, newTitle),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
        queryClient.setQueryData(portfolioKeys.detail(data.id), data);
      },
      ...options,
    });
  };

  // Export portfolio mutation
  const useExportPortfolio = (options?: UseMutationOptions<Blob, Error, { portfolioId: string; format: 'html' | 'pdf' }>) => {
    return useMutation({
      mutationFn: ({ portfolioId, format }) => portfolioService.exportPortfolio(portfolioId, format),
      ...options,
    });
  };

  // Check slug availability
  const useCheckSlugAvailability = (slug: string, options?: Omit<UseQueryOptions<{ available: boolean; suggestions?: string[] }>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: ['portfolio', 'slug-check', slug],
      queryFn: () => portfolioService.checkSlugAvailability(slug),
      enabled: !!slug && slug.length >= 3,
      staleTime: 0, // Always check for slug availability
      ...options,
    });
  };

  return {
    // Queries
    useTemplates,
    useTemplate,
    useUserPortfolios,
    usePortfolioById,
    usePortfolioBySlug,
    usePortfolioStats,
    useCheckSlugAvailability,
    
    // Mutations
    useCreatePortfolio,
    useUpdatePortfolio,
    usePublishPortfolio,
    useDeletePortfolio,
    useGeneratePreview,
    useClonePortfolio,
    useExportPortfolio,
  };
};

// Utility hook for managing portfolio sections
export const usePortfolioSections = (portfolioId: string) => {
  const queryClient = useQueryClient();

  // Update section mutation
  const useUpdateSection = (options?: UseMutationOptions<PortfolioSection, Error, { sectionId: string; data: Partial<PortfolioSection> }>) => {
    return useMutation({
      mutationFn: ({ sectionId, data }) => portfolioService.updateSection(portfolioId, sectionId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: portfolioKeys.detail(portfolioId) });
      },
      ...options,
    });
  };

  // Reorder sections mutation
  const useReorderSections = (options?: UseMutationOptions<Portfolio, Error, string[]>) => {
    return useMutation({
      mutationFn: (sectionIds) => portfolioService.reorderSections(portfolioId, sectionIds),
      onSuccess: (data) => {
        queryClient.setQueryData(portfolioKeys.detail(portfolioId), data);
      },
      ...options,
    });
  };

  return {
    useUpdateSection,
    useReorderSections,
  };
};
