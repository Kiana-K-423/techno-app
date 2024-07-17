'use client';
import { Inter } from 'next/font/google';
import { useThemeStore } from '@/common/store';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/common/libs';
import {
  Toaster as ReactToaster,
  SonnToaster,
} from '@/common/components/elements';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });
export const Providers = ({ children }: { children: React.ReactNode }) => {
  const { theme, radius } = useThemeStore();
  const location = usePathname();

  if (location === '/') {
    return (
      <body className={cn('dash-tail-app ', inter.className)}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
        >
          <div className={cn('h-full  ')}>
            {children}
            <ReactToaster />
          </div>
          <Toaster />
          <SonnToaster />
        </ThemeProvider>
      </body>
    );
  }
  return (
    <body
      className={cn('dash-tail-app ', inter.className, 'theme-' + theme)}
      style={
        {
          '--radius': `${radius}rem`,
        } as React.CSSProperties
      }
    >
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="light"
      >
        <div className={cn('h-full  ')}>
          {children}
          <ReactToaster />
        </div>
        <Toaster />
        <SonnToaster />
      </ThemeProvider>
    </body>
  );
};
