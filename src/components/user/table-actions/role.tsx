"use client";

import { UserRole } from "@prisma/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
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
import { type UserWithGroup } from "~/server/api/routers/user";

const roleAction: TableAction<UserWithGroup> = {
  label: "Role",
  allowedRoles: ["ADMIN"],
  Content: (rows, close) => {
    const [role, setRole] = useState<"" | UserRole>("");
    const roleSchema = z.enum([
      "",
      UserRole.ADMIN,
      UserRole.MODERATOR,
      UserRole.USER,
    ]);

    function save() {
      console.log({ role, rows });
      close();
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
              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
              <SelectItem value={UserRole.MODERATOR}>Moderator</SelectItem>
              <SelectItem value={UserRole.USER}>User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button disabled={role === ""} onClick={save}>
            Save
          </Button>
        </DialogFooter>
      </>
    );
  },
};

export default roleAction;
