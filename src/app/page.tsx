import { Button } from "~/components/ui/button";

export default async function Home() {
  return (
    <main className="container mx-auto">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">Secret</span> Santa
        </h1>
        <div>
          This is the app content
          <Button>This is a button</Button>
        </div>
      </div>
    </main>
  );
}
