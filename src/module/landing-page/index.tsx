'use client';

import { LayoutLoader } from '@/common/components/elements';
import { useMounted } from '@/common/hooks';

const LandingPage = () => {
  const mounted = useMounted();
  if (!mounted) {
    return <LayoutLoader />;
  }
  return <div className="bg-background"></div>;
};

export { LandingPage };
