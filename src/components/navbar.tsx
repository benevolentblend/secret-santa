"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";

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
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { cn } from "~/lib/utils";
import { type ClassValue } from "clsx";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type MenuItem = {
  href: string;
  content: ReactNode;
};

const menu: MenuItem[] = [
  {
    href: "/",
    content: "Home",
  },
  {
    href: "/games",
    content: "Games",
  },
  {
    href: "/users",
    content: "Users",
  },
];

interface NavBarProps {
  session: Session | null;
}

interface NavBarBase extends React.PropsWithChildren {
  wrapperStyle?: ClassValue;
}

const BaseNavBar: React.FC<NavBarBase> = ({ children, wrapperStyle }) => (
  <nav className="border-black-200 border-b bg-background dark:bg-gray-900">
    <div
      className={cn(
        "mx-auto flex max-w-screen-xl flex-wrap px-4 py-2",
        wrapperStyle,
      )}
      role="tablist"
    >
      {children}
    </div>
  </nav>
);

const NavBar: React.FC<NavBarProps> = ({ session }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!session) {
    return (
      <BaseNavBar wrapperStyle="justify-end">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="outline" onClick={() => signIn()}>
                Login
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </BaseNavBar>
    );
  }

  const Menu = (
    <NavigationMenu orientation={isDesktop ? "horizontal" : "vertical"}>
      <NavigationMenuList
        className={isDesktop ? "" : "flex-col items-start space-x-0"}
      >
        {menu.map(({ href, content }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink
              href={href}
              className={cn(
                navigationMenuTriggerStyle(),
                isDesktop ? "" : "w-max",
              )}
            >
              {content}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

        {!isDesktop && (
          <>
            <NavigationMenuItem>
              <Button variant="outline" onClick={() => signOut()}>
                Logout
              </Button>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
  const profileName = (session.user.name ?? "Player").split(" ");
  const profileInitials =
    profileName.length > 1
      ? `${profileName[0]?.charAt(0)}${profileName[1]?.charAt(0)}`
      : profileName[0]?.charAt(0);

  return (
    <BaseNavBar wrapperStyle="justify-between">
      <Link
        href="/"
        className="flex items-center space-x-3 rtl:space-x-reverse"
        role="tab"
        tabIndex={0}
        aria-selected="true"
        aria-controls="tabpanel_1"
      >
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Secret Santa
        </span>
      </Link>

      {isDesktop ? (
        <>
          {Menu}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name ?? ""}
                />
                <AvatarFallback>{profileInitials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
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
    </BaseNavBar>
  );
};

export default NavBar;
