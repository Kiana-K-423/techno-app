import {
  Chart,
  Components,
  DashBoard,
  Grid,
  PretentionChartLine,
  Heroicon,
} from '@/common/components/svg';

export interface MenuItemProps {
  title: string;
  icon: any;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick: () => void;
}

export const menusConfig = {
  mainNav: [
    {
      title: 'Dashboard',
      icon: DashBoard,
      href: '/dashboard',
    },
    {
      title: 'Item',
      icon: Grid,
      href: '/dashboard/item',
    },
    {
      title: 'Room',
      icon: Heroicon,
      href: '/dashboard/room',
    },
    {
      title: 'Category',
      icon: Components,
      href: '/dashboard/category',
    },
    {
      title: 'Supply',
      icon: Chart,
      href: '/dashboard/supply',
    },
    {
      title: 'Transaction',
      icon: PretentionChartLine,
      href: '/dashboard/transaction',
    },
  ],
  sidebarNav: {
    modern: [
      {
        title: 'Dashboard',
        icon: DashBoard,
        href: '/dashboard',
      },
      {
        title: 'Item',
        icon: Grid,
        href: '/dashboard/item',
      },
      {
        title: 'Room',
        icon: Heroicon,
        href: '/dashboard/room',
      },
      {
        title: 'Category',
        icon: Components,
        href: '/dashboard/category',
      },
      {
        title: 'Supply',
        icon: Chart,
        href: '/dashboard/supply',
      },
      {
        title: 'Transaction',
        icon: PretentionChartLine,
        href: '/dashboard/transaction',
      },
    ],
    classic: [
      {
        isHeader: true,
        title: 'menu',
      },
      {
        title: 'Dashboard',
        icon: DashBoard,
        href: '/dashboard',
      },
      {
        isHeader: true,
        title: 'Application',
      },
      {
        title: 'Item',
        icon: Grid,
        href: '/dashboard/item',
      },
      {
        title: 'Room',
        icon: Heroicon,
        href: '/dashboard/room',
      },
      {
        title: 'Category',
        icon: Components,
        href: '/dashboard/category',
      },
      {
        isHeader: true,
        title: 'Charts',
      },
      {
        title: 'Supply',
        icon: Chart,
        href: '/dashboard/supply',
      },
      {
        title: 'Transaction',
        icon: PretentionChartLine,
        href: '/dashboard/transaction',
      },
    ],
  },
};

export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
