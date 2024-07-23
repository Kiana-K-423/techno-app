import React from 'react';
import SiteLogo from '@public/icon-techno.png';
import Link from 'next/link';
import Image from 'next/image';
const horizontalHeader = () => {
  return (
    <div className="flex items-center lg:gap-12 gap-3 ">
      <div>
        <Link
          href="/dashboard"
          className=" text-primary flex items-center gap-2"
        >
          <Image src={SiteLogo} alt="logo" className="h-7 w-7" />
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
