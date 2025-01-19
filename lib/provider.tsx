'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ContextProvider from './context';
import { Suspense, useState } from 'react';

export default function Provider({ children }: any) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <ContextProvider>
          {children}

          <Toaster />
        </ContextProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
