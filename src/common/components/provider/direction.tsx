'use client';
import React from 'react';
import { useThemeStore } from '@/common/store';
import { DirectionProvider as RadixDirectionProvider } from '@radix-ui/react-direction';

export const DirectionProvider = ({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) => {
  const { isRtl } = useThemeStore();

  const direction = lang === 'ar' || isRtl ? 'rtl' : 'ltr';

  return (
    <div dir={direction}>
      <RadixDirectionProvider dir={direction}>
        {children}
      </RadixDirectionProvider>
    </div>
  );
};
