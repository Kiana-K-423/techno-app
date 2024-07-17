import { getDictionary } from '@/common/lang/dictionaries';
import DashboardPageView from '@/module/dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Dashboard | Techno`,
  description: 'Dashboard page',
};

const DashboardPage = async () => {
  const trans = await getDictionary('en');
  return <DashboardPageView trans={trans} />;
};

export default DashboardPage;
