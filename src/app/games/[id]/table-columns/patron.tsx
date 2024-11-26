import type { ColumnDef } from "@tanstack/react-table";
import { type GameMatchWithUsers } from "~/components/game/use-batch-update-recipients";

const PatronColumn: ColumnDef<GameMatchWithUsers> = {
  id: "patron",
  accessorKey: "patron.name",
  header: "Patron",
};

export default PatronColumn;
