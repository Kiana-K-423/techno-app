'use client';

import { SessionProvider } from 'next-auth/react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider basePath="/api/auth">{children}</SessionProvider>
);
