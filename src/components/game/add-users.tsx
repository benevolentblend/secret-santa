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

interface AddUserButtonProps {
  id: string;
}

const AddUsersButton: React.FC<AddUserButtonProps> = ({ id }) => {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userIds, setUserIds] = useState<string[]>([]);
  const utils = api.useUtils();
  const addToGame = api.game.assignToGame.useMutation({
    async onError() {
      toast.error("An error occured when adding users to the game");
    },
    async onSettled() {
      await utils.game.getAvailableUsers.invalidate();
      await utils.game.getMatches.invalidate();
    },
  });

  const getAvailableUsers = api.game.getAvailableUsers.useQuery({ id });
  const availableUsers = getAvailableUsers.data ?? [];
  const options = availableUsers.map((user) => ({
    value: user.id,
    label: user.name ?? "Unknown",
  }));

  function save() {
    addToGame.mutate({ gameId: id, ids: userIds });
    setAddUserDialogOpen(false);
  }

  return (
    <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setAddUserDialogOpen(true)}>
          Add Users
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Add a user to the game.</DialogDescription>
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

export default AddUsersButton;
