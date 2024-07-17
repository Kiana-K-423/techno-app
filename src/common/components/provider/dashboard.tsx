'use client';
import React from 'react';
import { Header, Sidebar, Footer } from '@/common/components/partials';
import { cn } from '@/common/libs';
import { useSidebar, useThemeStore } from '@/common/store';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@/common/hooks';
import ThemeCustomize from '@/common/components/partials/customizer/theme-customizer';
import MobileSidebar from '@/common/components/partials/sidebar/mobile-sidebar';
import { HeaderSearch, LayoutLoader } from '@/common/components/elements';
import { useMounted } from '@/common/hooks';
export const DashBoardLayoutProvider = ({
  children,
  trans,
}: {
  children: React.ReactNode;
  trans: any;
}) => {
  const { collapsed, sidebarType, setCollapsed, subMenu } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const { layout } = useThemeStore();
  const location = usePathname();
  const isMobile = useMediaQuery('(min-width: 768px)');
  const mounted = useMounted();
  if (!mounted) {
    return <LayoutLoader />;
  }
  if (layout === 'semibox') {
    return (
      <>
        <Header trans={trans} />
        <Sidebar trans={trans} />

        <div
          className={cn('content-wrapper transition-all duration-150 ', {
            'ltr:xl:ml-[72px] rtl:xl:mr-[72px]': collapsed,
            'ltr:xl:ml-[272px] rtl:xl:mr-[272px]': !collapsed,
          })}
        >
          <div className={cn('pt-6 pb-8 px-4  page-min-height-semibox ')}>
            <div className="semibox-content-wrapper ">
              <LayoutWrapper
                isMobile={isMobile}
                setOpen={setOpen}
                open={open}
                location={location}
                trans={trans}
              >
                {children}
              </LayoutWrapper>
            </div>
          </div>
        </div>
        <Footer handleOpenSearch={() => setOpen(true)} />
        <ThemeCustomize />
      </>
    );
  }
  if (layout === 'horizontal') {
    return (
      <>
        <Header trans={trans} />

        <div className={cn('content-wrapper transition-all duration-150 ')}>
          <div
            className={cn('  pt-6 px-6 pb-8  page-min-height-horizontal ', {})}
          >
            <LayoutWrapper
              isMobile={isMobile}
              setOpen={setOpen}
              open={open}
              location={location}
              trans={trans}
            >
              {children}
            </LayoutWrapper>
          </div>
        </div>
        <Footer handleOpenSearch={() => setOpen(true)} />
        <ThemeCustomize />
      </>
    );
  }

  if (sidebarType !== 'module') {
    return (
      <>
        <Header trans={trans} />
        <Sidebar trans={trans} />

        <div
          className={cn('content-wrapper transition-all duration-150 ', {
            'ltr:xl:ml-[248px] rtl:xl:mr-[248px] ': !collapsed,
            'ltr:xl:ml-[72px] rtl:xl:mr-[72px]': collapsed,
          })}
        >
          <div className={cn('  pt-6 px-6 pb-8  page-min-height ', {})}>
            <LayoutWrapper
              isMobile={isMobile}
              setOpen={setOpen}
              open={open}
              location={location}
              trans={trans}
            >
              {children}
            </LayoutWrapper>
          </div>
        </div>
        <Footer handleOpenSearch={() => setOpen(true)} />
        <ThemeCustomize />
      </>
    );
  }
  return (
    <>
      <Header trans={trans} />
      <Sidebar trans={trans} />

      <div
        className={cn('content-wrapper transition-all duration-150 ', {
          'ltr:xl:ml-[300px] rtl:xl:mr-[300px]': !collapsed,
          'ltr:xl:ml-[72px] rtl:xl:mr-[72px]': collapsed,
        })}
      >
        <div className={cn(' layout-padding px-6 pt-6  page-min-height ')}>
          <LayoutWrapper
            isMobile={isMobile}
            setOpen={setOpen}
            open={open}
            location={location}
            trans={trans}
          >
            {children}
          </LayoutWrapper>
        </div>
      </div>
      <Footer handleOpenSearch={() => setOpen(true)} />
      {isMobile && <ThemeCustomize />}
    </>
  );
};

const LayoutWrapper = ({
  children,
  isMobile,
  setOpen,
  open,
  location,
  trans,
}: {
  children: React.ReactNode;
  isMobile: boolean;
  setOpen: any;
  open: boolean;
  location: any;
  trans: any;
}) => {
  return (
    <>
      <motion.div
        key={location}
        initial="pageInitial"
        animate="pageAnimate"
        exit="pageExit"
        variants={{
          pageInitial: {
            opacity: 0,
            y: 50,
          },
          pageAnimate: {
            opacity: 1,
            y: 0,
          },
          pageExit: {
            opacity: 0,
            y: -50,
          },
        }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.5,
        }}
      >
        <main>{children}</main>
      </motion.div>

      <MobileSidebar trans={trans} className="left-[300px]" />
      <HeaderSearch open={open} setOpen={setOpen} />
    </>
  );
};
