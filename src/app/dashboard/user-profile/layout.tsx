import { ProfileLayout } from '@/module/profile-setting';
export const metadata = {
  title: 'User Profile',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <ProfileLayout>{children}</ProfileLayout>;
};

export default Layout;
