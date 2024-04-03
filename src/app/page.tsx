export default async function Home() {
  return (
    <main className="container mx-auto max-w-screen-xl">
      <div className="flex h-[65vh] flex-col justify-center text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-[hsl(99,46%,46%)] sm:text-[5rem]">
          Secret <span className="text-[hsl(355,64%,51%)]">Santa</span>
        </h1>
        <p>
          One of the most over engineered web apps that only gets used once a
          year
        </p>
      </div>
    </main>
  );
}
