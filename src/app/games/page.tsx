import { getServerAuthSession } from "~/server/auth";
import Content from "./content";

import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  return <Content />;
}
