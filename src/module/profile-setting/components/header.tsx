'use client';
import { Home } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from '@/common/components/elements';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
const Header = () => {
  const location = usePathname();
  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>Profile</BreadcrumbItem>
        <BreadcrumbItem>User Profile</BreadcrumbItem>
      </Breadcrumbs>
    </Fragment>
  );
};

export default Header;
