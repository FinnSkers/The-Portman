'use client';

import { useEffect } from 'react';
import { initializeEnvironment } from '@/lib/config';

/**
 * Component that initializes the environment configuration on the client side
 * This should be rendered once at the root level of the application
 */
export function EnvironmentInitializer() {
  useEffect(() => {
    // Initialize environment configuration
    initializeEnvironment();
  }, []);

  // This component doesn't render anything visible
  return null;
}
