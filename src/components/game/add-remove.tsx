"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { MultiSelect } from "~/components/ui/multi-select";

interface RemoveUserButtonProps {
  id: string;
}

const RemoveUsersButton: React.FC<RemoveUserButtonProps> = ({ id }) => {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userIds, setUserIds] = useState<string[]>([]);
  const utils = api.useUtils();
  const removeFromGame = api.game.removeFromGame.useMutation({
    async onError() {
      toast.error("An error occured when removing users from the game");
    },
    async onSettled() {
      await utils.game.getAvailableUsers.invalidate();
      await utils.game.getMatches.invalidate();
    },
  });

  const getAvailableUsers = api.game.getMatches.useQuery({ id });
  const availableUsers = getAvailableUsers.data ?? [];
  const options = availableUsers.map((user) => ({
    value: user.patronId,
    label: user.patron.name ?? "Unknown",
  }));

  function save() {
    removeFromGame.mutate({ gameId: id, ids: userIds });
    setAddUserDialogOpen(false);
  }

  return (
    <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setAddUserDialogOpen(true)}>
          Remove Users
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove Users</DialogTitle>
          <DialogDescription>Remove users from the game.</DialogDescription>
        </DialogHeader>
        <div className="text-center">
          <MultiSelect
            options={options}
            onValueChange={setUserIds}
            defaultValue={[]}
            placeholder="Select Users"
            variant="inverted"
          />
        </div>
        <DialogFooter>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveUsersButton;
