"use client";

import useBatchUpdateRecipients from "~/components/game/use-batch-update-recipients";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

interface SelectRecipientsProps {
  gameId: string;
}

const SelectRecipients: React.FC<SelectRecipientsProps> = ({ gameId }) => {
  const {
    updatedMatches,
    availableRecipients,
    shadowMatches,
    updateRecipient,
    allPatrons,
    save,
  } = useBatchUpdateRecipients({
    gameId,
  });

  return (
    <>
      {shadowMatches
        .sort((a, b) => {
          const aName = a.patron.name?.toLowerCase() ?? "";
          const bName = b.patron.name?.toLowerCase() ?? "";

          if (aName > bName) {
            return 1;
          }
          if (aName < bName) {
            return -1;
          }
          return 0;
        })
        .map((shadowMatch) => {
          const update = (value: string) => {
            const nullishRecipientId = value !== "Unassigned" ? value : null;

            updateRecipient({
              recipientId: nullishRecipientId,
              matchId: shadowMatch.id,
            });
          };

          return (
            <div key={shadowMatch.id}>
              <div className="flex py-2">
                <div className="flex-1 content-center">
                  {shadowMatch.patron.name}
                </div>
                <div className="flex-1">
                  <Select
                    onValueChange={update}
                    value={shadowMatch.recipientId ?? "Unassigned"}
                    key={shadowMatch.id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {allPatrons
                        .filter(({ id }) =>
                          shadowMatch.patron.group
                            ? !shadowMatch.patron.group.users.some(
                                ({ id: groupUserId }) => groupUserId === id,
                              )
                            : id !== shadowMatch.patronId,
                        )
                        .map((recipient) => (
                          <SelectItem
                            key={recipient.id}
                            value={recipient.id}
                            disabled={
                              !availableRecipients.some(
                                ({ id }) => id === recipient.id,
                              )
                            }
                          >
                            {recipient.name}
                          </SelectItem>
                        ))}
                      <SelectItem value="Unassigned">Unassigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        })}

      <Button onClick={save} disabled={!updatedMatches.length}>
        Save
      </Button>
    </>
  );
};

export default SelectRecipients;
