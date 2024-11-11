import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import NavBar from "~/components/navbar";
import { getServerAuthSession } from "~/server/auth";

export const metadata: Metadata = {
  title: "Secret Santa",
  description: "Thomasnetwork Secret Santa App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <NavBar session={session} />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
