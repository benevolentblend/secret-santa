"use client";

import { useState, type ReactNode } from "react";
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

import { type UserRole } from "@prisma/client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMediaQuery } from "~/hooks/use-media-query";
import { type ClassValue } from "clsx";

import Avatar from "~/components/user/avatar";

import { cn } from "~/lib/utils";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type MenuItem = {
  href: string;
  content: ReactNode;
  requiredPermission?: UserRole[];
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
    requiredPermission: ["Admin", "Moderator"],
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  const role = session.user.role;

  const Menu = (
    <NavigationMenu orientation={isDesktop ? "horizontal" : "vertical"}>
      <NavigationMenuList
        className={isDesktop ? "" : "flex-col items-start space-x-0"}
      >
        {menu
          .filter(
            ({ requiredPermission }) =>
              requiredPermission === undefined ||
              requiredPermission.includes(role),
          )
          .map(({ href, content }) => (
            <NavigationMenuItem key={href}>
              <Link href={href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isDesktop ? "" : "w-max",
                  )}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {content}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}

        {!isDesktop && (
          <>
            <NavigationMenuItem>
              <Link href="/profile" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "w-max")}
                  onClick={() => setMobileNavOpen(false)}
                >
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" onClick={() => signOut()}>
                Logout
              </Button>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );

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
        <div className="flex gap-8">
          {Menu}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar user={session.user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger>
            <div className="h-10 content-center">
              <HamburgerMenuIcon />
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px]">
            <SheetHeader>
              <VisuallyHidden>
                <SheetTitle>Menu</SheetTitle>
              </VisuallyHidden>
            </SheetHeader>
            {Menu}
          </SheetContent>
        </Sheet>
      )}
    </BaseNavBar>
  );
};

export default NavBar;
