"use client";

import { UserRole } from "@prisma/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { type TableAction } from "~/components/ui/data-table-action";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { type UserWithGroup } from "../table";

const roleAction: TableAction<UserWithGroup> = {
  label: "Role",
  allowedRoles: ["Admin"],
  Content: (rows, close) => {
    const [role, setRole] = useState<UserRole>("Admin");
    const utils = api.useUtils();
    const updateRole = api.user.updateRole.useMutation({
      onSuccess() {
        close();
      },
      async onSettled() {
        await utils.user.getAll.invalidate();
      },
    });
    const roleSchema = z.nativeEnum(UserRole);

    function save() {
      const ids = rows.map((row) => row.id);

      if (!role) {
        return;
      }

      updateRole.mutate({ ids, role });
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>User Role</DialogTitle>
          <DialogDescription>
            Update {rows.length} User Role(s).
          </DialogDescription>
        </DialogHeader>
        <div className="text-center">
          <Select
            value={role}
            onValueChange={(value) => {
              const parsedValue = roleSchema.safeParse(value);
              if (parsedValue.success) {
                setRole(parsedValue.data);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.Admin}>Admin</SelectItem>
              <SelectItem value={UserRole.Moderator}>Moderator</SelectItem>
              <SelectItem value={UserRole.User}>User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </>
    );
  },
};

export default roleAction;
