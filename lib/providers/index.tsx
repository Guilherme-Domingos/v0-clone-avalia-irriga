'use client';

import { QueryProvider } from './query-provider';
import { ToastProvider } from './toast-provider';
import { ThemeProvider } from '@/components/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
        <ThemeProvider attribute='class' defaultTheme='light'>
          {children}
          <ToastProvider />
        </ThemeProvider>
    </QueryProvider>
  );
}
