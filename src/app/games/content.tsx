"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import { api } from "~/trpc/react";

export default function Content() {
  const getAllGames = api.game.getAll.useQuery({});
  const data = getAllGames.data ?? [];

  return (
    <main className="container mx-auto max-w-screen-xl p-4">
      <DataTable columns={columns} data={data} />
    </main>
  );
}
