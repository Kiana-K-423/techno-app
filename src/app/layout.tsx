import '@/common/styles/globals.scss';
import '@/common/styles/theme.scss';

import { Inter } from 'next/font/google';
import { siteConfig } from '@/config/site';
import {
  Providers,
  TanstackProvider,
  AuthProvider,
  DirectionProvider,
} from '@/common/components/provider';
import 'simplebar-react/dist/simplebar.min.css';
import 'flatpickr/dist/themes/light.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={lang}>
      <AuthProvider>
        <TanstackProvider>
          <Providers>
            <DirectionProvider lang={lang}>{children}</DirectionProvider>
          </Providers>
        </TanstackProvider>
      </AuthProvider>
    </html>
  );
}
