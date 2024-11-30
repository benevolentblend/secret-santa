"use client";

import { api } from "~/trpc/react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";

interface AutoMatchProps {
  gameId: string;
}

const AutoMatch: React.FC<AutoMatchProps> = ({ gameId }) => {
  const sort = api.game.sort.useQuery({
    gameId,
    rounds: 4,
    attempts: 6,
  });
  const utils = api.useUtils();
  const updateRecipients = api.game.assignRecipients.useMutation({
    async onSuccess(recipientCount) {
      const plural = recipientCount !== 1;
      toast.info(`Updated ${recipientCount} recipient${plural ? "s" : ""}.`);
      await utils.game.getMatches.invalidate();
    },
    async onError() {
      toast.error("There was a problem saving the auto matched recipients");
    },
  });

  const save = () => {
    if (!sort.data?.success) {
      return;
    }

    const matches = sort.data.matching.map(([patronId, recipientId]) => ({
      recipientId,
      patronId,
    }));

    updateRecipients.mutate({ gameId, matches });
  };

  return (
    <>
      {!!sort.data ? (
        sort.data.success ? (
          <p>
            Matched {sort.data.matching.length} players in {sort.data.rounds}{" "}
            rounds after {sort.data.attempts} attempts.
          </p>
        ) : (
          <p>Failed to sort after {sort.data.rounds} rounds.</p>
        )
      ) : (
        <>Loading</>
      )}
      <div className="flex gap-2">
        <Button onClick={() => sort.refetch()} disabled={sort.isFetching}>
          {sort.isFetching ? "Loading" : "Refresh"}
        </Button>

        <Button disabled={!sort.data?.success} onClick={save}>
          Save
        </Button>
      </div>
    </>
  );
};

export default AutoMatch;
