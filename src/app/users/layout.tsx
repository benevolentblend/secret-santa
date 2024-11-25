export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="container mx-auto max-w-screen-xl p-4">{children}</main>
  );
}
