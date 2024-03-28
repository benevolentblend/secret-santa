import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex items-center justify-center">
      <div className="items-center justify-center ">
        <p className="text-6xl font-bold tracking-wider text-gray-300 md:text-7xl lg:text-9xl">
          404
        </p>
        <p className="pt-4 text-2xl font-bold tracking-wider text-gray-500 md:text-3xl lg:text-5xl">
          Page Not Found
        </p>
        <p className="my-4 border-b-2 pb-4 text-center text-gray-500">
          Sorry, the page you are looking for could not be found.
        </p>
        <Link
          href="/"
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
