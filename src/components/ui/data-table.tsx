"use client";

import { useState } from "react";

import { type UserRole } from "@prisma/client";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { DataTableAction, type TableAction } from "./data-table-action";
import { Skeleton } from "./skeleton";

interface DataTableProps<TData extends { id: string | number }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  actions?: TableAction<TData>[];
  role: UserRole;
  isLoading?: boolean;
  initialSorting?: SortingState;
  data: TData[];
}

const SkeletonRow = () => (
  <div className="flex gap-8">
    <Skeleton className="h-[24px] w-[80px]" />
    <Skeleton className="h-[24px] w-[200px] flex-auto" />
    <Skeleton className="h-[24px] w-[300px]" />
    <Skeleton className="h-[24px] w-[200px] flex-auto" />
  </div>
);

export function DataTable<TData extends { id: string | number }, TValue>({
  columns,
  data,
  role,
  isLoading,
  actions,
  initialSorting,
}: DataTableProps<TData, TValue>) {
  const userActions =
    actions?.filter((action) => action.allowedRoles.includes(role)) ?? [];

  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    getRowId: (originalRow) => `${originalRow.id}`,
  });

  const rows = table.getRowModel().rows;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <>
      {!!userActions.length && (
        <div className="flex gap-2 pb-2">
          {userActions.map((action) => (
            <DataTableAction
              key={action.label}
              {...{ action, rows: selectedRows }}
            />
          ))}
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} highlightHover={false}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow highlightHover={false}>
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col gap-6">
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  highlightHover={false}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
