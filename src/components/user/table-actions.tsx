"use client";

import { useState } from "react";
import { z } from "zod";

import { api } from "~/trpc/react";

import { UserRole } from "@prisma/client";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { type TableAction } from "../ui/data-table-action";
import { type UserWithGroup } from "~/server/api/routers/user";

const actions: TableAction<UserWithGroup>[] = [
  {
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
  },
  {
    label: "Group",
    allowedRoles: ["ADMIN"],
    Content: (rows, close) => {
      const [groupId, setGroupId] = useState("");
      const requestGroups = api.group.getAll.useQuery({});
      const updateUserGroups = api.user.updateGroups.useMutation({
        onSuccess() {
          close();
        },
        onError() {
          toast.error("Unable to update groups");
        },
      });
      const groups = requestGroups.data ?? [];

      function save() {
        const ids = rows.map((row) => row.id);
        updateUserGroups.mutate({ ids, groupId });
      }

      return (
        <>
          <DialogHeader>
            <DialogTitle>User Group</DialogTitle>
            <DialogDescription>
              Update {rows.length} User Group(s).
            </DialogDescription>
          </DialogHeader>
          <div className="text-center">
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </>
      );
    },
  },
];

export { actions };
