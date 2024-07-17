'use client';
import React, { useState } from 'react';
import { cn, isLocationMatch } from '@/common/libs';
import { useSidebar } from '@/common/store';
import SidebarLogo from '../common/logo';
import { menusConfig } from '@/config/menus';
import MenuLabel from '../common/menu-label';
import { ScrollArea } from '@/common/components/elements';
import { usePathname } from 'next/navigation';
import SingleMenuItem from './single-menu-item';
import SubMenuHandler from './sub-menu-handler';
import NestedSubMenu from '../common/nested-menus';
const MobileSidebar = ({
  className,
  trans,
}: {
  className?: string;
  trans: any;
}) => {
  const { sidebarBg, mobileMenu, setMobileMenu } = useSidebar();
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [activeMultiMenu, setMultiMenu] = useState<number | null>(null);
  const menus = menusConfig?.sidebarNav?.classic || [];
  const { collapsed } = useSidebar();

  const toggleSubmenu = (i: number) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const toggleMultiMenu = (subIndex: number) => {
    if (activeMultiMenu === subIndex) {
      setMultiMenu(null);
    } else {
      setMultiMenu(subIndex);
    }
  };
  const locationName = usePathname();

  React.useEffect(() => {
    let subMenuIndex = null;
    let multiMenuIndex = null;
    menus?.map((item: any, i: number) => {
      if (item?.child) {
        item.child.map((childItem: any, j: number) => {
          if (isLocationMatch(childItem.href, locationName)) {
            subMenuIndex = i;
          }
          if (childItem?.multi_menu) {
            childItem.multi_menu.map((multiItem: any, k: number) => {
              if (isLocationMatch(multiItem.href, locationName)) {
                subMenuIndex = i;
                multiMenuIndex = j;
              }
            });
          }
        });
      }
    });
    setActiveSubmenu(subMenuIndex);
    setMultiMenu(multiMenuIndex);
    if (mobileMenu) {
      setMobileMenu(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationName]);
  return (
    <>
      <div
        className={cn(
          'fixed top-0  bg-card h-full w-[248px] z-[9999] ',
          className,
          {
            ' -left-[300px] invisible opacity-0  ': !mobileMenu,
            ' left-0 visible opacity-100  ': mobileMenu,
          }
        )}
      >
        {sidebarBg !== 'none' && (
          <div
            className=" absolute left-0 top-0   z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
            style={{ backgroundImage: `url(${sidebarBg})` }}
          ></div>
        )}
        <SidebarLogo hovered={collapsed} />
        <ScrollArea
          className={cn('sidebar-menu  h-[calc(100%-80px)] ', {
            'px-4': !collapsed,
          })}
        >
          <ul
            className={cn('', {
              ' space-y-2 text-center': collapsed,
            })}
          >
            {menus.map((item, i) => (
              <li key={`menu_key_${i}`}>
                {/* single menu  */}

                {!item.isHeader && (
                  <SingleMenuItem item={item} collapsed={collapsed} />
                )}

                {/* menu label */}
                {item.isHeader && !collapsed && (
                  <MenuLabel item={item} trans={trans} />
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="overlay bg-black/60 backdrop-filter backdrop-blur-sm opacity-100 fixed inset-0 z-[999]"
        ></div>
      )}
    </>
  );
};

export default MobileSidebar;
