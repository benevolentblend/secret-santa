"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { type TableAction } from "~/components/ui/data-table-action";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { type UserWithGroup } from "../table";

const groupAction: TableAction<UserWithGroup> = {
  label: "Group",
  allowedRoles: ["Moderator", "Admin"],
  Content: (rows, close) => {
    const [groupId, setGroupId] = useState("");
    const [newGroupName, setNewGroupName] = useState("");
    const requestGroups = api.group.getAll.useQuery({});
    const utils = api.useUtils();
    const handleMutation = {
      async onSuccess() {
        await utils.group.getAll.invalidate();
        await utils.user.getAll.invalidate();

        close();
      },
      onError() {
        toast.error("Unable to update groups");
      },
    };

    const assignToGroup = api.user.assignToGroup.useMutation(handleMutation);
    const assignToNewGroup =
      api.user.assignToNewGroup.useMutation(handleMutation);
    const groups = requestGroups.data ?? [];
    const ableToSave =
      (groupId == "new" && newGroupName !== "") ||
      (groupId !== "" && groupId !== "new");

    function save() {
      const ids = rows.map((row) => row.id);

      if (groupId === "new") {
        assignToNewGroup.mutate({ ids, newGroupName });
      } else {
        assignToGroup.mutate({ ids, groupId });
      }
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
              <SelectItem key="new" value={"new"}>
                New Group
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {groupId === "new" && (
          <div>
            <Label>Group Name</Label>
            <Input
              type="email"
              placeholder="The cool group"
              onChange={(event) => setNewGroupName(event.currentTarget.value)}
              value={newGroupName}
            />
          </div>
        )}
        <DialogFooter>
          <Button onClick={save} disabled={!ableToSave}>
            Save
          </Button>
        </DialogFooter>
      </>
    );
  },
};

export default groupAction;
