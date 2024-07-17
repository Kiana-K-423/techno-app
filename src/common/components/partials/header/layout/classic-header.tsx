'use client';
import React from 'react';
import { cn } from '@/common/libs';

const ClassicHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <header className={cn('z-50', className)}>{children}</header>;
};

export default ClassicHeader;
