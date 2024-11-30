import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { GeistSans } from "geist/font/sans";

import { auth } from "~/server/auth";
import NavBar from "~/components/navbar";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Secret Santa",
  description: "Thomasnetwork Secret Santa App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <NavBar session={session} />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
