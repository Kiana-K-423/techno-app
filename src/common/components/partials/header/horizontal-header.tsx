import React from 'react';
import { SiteLogo } from '@/common/components/svg';
import Link from 'next/link';
const horizontalHeader = () => {
  return (
    <div className="flex items-center lg:gap-12 gap-3 ">
      <div>
        <Link
          href="/dashboard"
          className=" text-primary flex items-center gap-2"
        >
          <SiteLogo className="h-7 w-7" />
          <span className=" text-xl font-semibold lg:inline-block hidden">
            {' '}
            Techno
          </span>
        </Link>
      </div>
    </div>
  );
};

export default horizontalHeader;
