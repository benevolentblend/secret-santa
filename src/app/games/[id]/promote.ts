import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

const promote = async (gameId: string) => {
  "use server";
  await api.game.promote({ id: gameId });
  revalidatePath(`/game/${gameId}`);
};

export default promote;
