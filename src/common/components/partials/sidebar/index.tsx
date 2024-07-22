'use client';
import React from 'react';
import { useSidebar } from '@/common/store';
import { useMediaQuery } from '@/common/hooks';
import ModuleSidebar from './module';
import PopoverSidebar from './popover';
import ClassicSidebar from './classic';
import MobileSidebar from './mobile-sidebar';

const Sidebar = ({ trans }: { trans: string }) => {
  const { sidebarType } = useSidebar();

  const isDesktop = useMediaQuery('(min-width: 1280px)');

  let selectedSidebar = null;

  if (!isDesktop && (sidebarType === 'popover' || sidebarType === 'classic')) {
    selectedSidebar = <MobileSidebar trans={trans} />;
  } else {
    const sidebarComponents: { [key: string]: JSX.Element } = {
      module: <ModuleSidebar trans={trans} />,
      popover: <PopoverSidebar trans={trans} />,
      classic: <ClassicSidebar trans={trans} />,
    };

    selectedSidebar = sidebarComponents[sidebarType] || (
      <ModuleSidebar trans={trans} />
    );
  }

  return <div>{selectedSidebar}</div>;
};

export { Sidebar };
