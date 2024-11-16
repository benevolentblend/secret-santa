"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { type TableAction } from "~/components/ui/data-table-action";
import { toast } from "sonner";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type UserWithGroup } from "../table";

const groupAction: TableAction<UserWithGroup> = {
  label: "Group",
  allowedRoles: ["ADMIN"],
  Content: (rows, close) => {
    const [groupId, setGroupId] = useState("");
    const [newGroupName, setNewGroupName] = useState("");
    const requestGroups = api.group.getAll.useQuery({});
    const utils = api.useUtils();
    const handleMutation = {
      onSuccess() {
        close();
      },
      onError() {
        console.log("ERROR");
        toast.error("Unable to update groups");
      },
      async onSettled() {
        await utils.user.getAll.invalidate();
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
