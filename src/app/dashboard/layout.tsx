import { DashBoardLayoutProvider } from '@/common/components/provider';
import { authOptions } from '@/common/libs';
import { getServerSession, NextAuthOptions } from 'next-auth';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/common/lang/dictionaries';

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions as NextAuthOptions);

  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const trans = await getDictionary('en');

  return (
    <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>
  );
};

export default layout;
