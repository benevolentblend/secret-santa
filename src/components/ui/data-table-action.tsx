import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { type Row } from "@tanstack/react-table";
import { Button } from "./button";
import { type UserRole } from "@prisma/client";

export type TableAction<TData> = {
  label: string;
  allowedRoles: UserRole[];
  Content: (rows: Row<TData>[], close: VoidFunction) => JSX.Element;
};

type Props<TData> = {
  action: TableAction<TData>;
  rows: Row<TData>[];
};

export function DataTableAction<TData>({ action, rows }: Props<TData>) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <Dialog key={action.label} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!rows.length}>
          {action.label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {action.Content(rows, close)}
      </DialogContent>
    </Dialog>
  );
}
