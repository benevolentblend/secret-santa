"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { useMediaQuery } from "~/hooks/use-media-query";
import { type ReactNode } from "react";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";

type MenuItem = {
  location: string;
  content: ReactNode;
};

const menu: MenuItem[] = [
  {
    location: "/",
    content: "Home",
  },
  {
    location: "/games",
    content: "Games",
  },
  {
    location: "/groups",
    content: "Groups",
  },
];

const NavBar = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();

  const Menu = (
    <NavigationMenu orientation={isDesktop ? "horizontal" : "vertical"}>
      <NavigationMenuList
        className={isDesktop ? "" : "flex-col items-start space-x-0"}
      >
        {menu.map(({ location, content }) => (
          <NavigationMenuItem
            key={location}
            className={isDesktop ? "" : "w-max"}
          >
            <Link href={location} legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={location === pathname}
              >
                {content}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <nav className="border-black-200 border-b bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-2">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            Secret Santa
          </span>
        </a>
        <div>
          {isDesktop ? (
            Menu
          ) : (
            <Sheet>
              <SheetTrigger>
                <HamburgerMenuIcon />
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                {Menu}
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
