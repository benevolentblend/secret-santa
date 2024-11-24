"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
  DialogContent,
} from "~/components/ui/dialog";

import { MultiSelect } from "~/components/ui/multi-select";
import { toast } from "sonner";

interface RemoveUserButtonProps {
  id: number;
}

const RemoveUsersButton: React.FC<RemoveUserButtonProps> = ({ id }) => {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userIds, setUserIds] = useState<string[]>([]);
  const utils = api.useUtils();
  const addUsersToGame = api.user.removeFromGame.useMutation({
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
    addUsersToGame.mutate({ gameId: id, ids: userIds });
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
