import { api } from "~/trpc/server";

import { ReadOnly } from "~/components/text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface MatchProps {
  gameId: string;
  patronId: string;
}

const Match: React.FC<MatchProps> = async ({ gameId, patronId }) => {
  const match = await api.game.getMatch({ gameId, patronId });

  if (!match) {
    return "Unable to find match";
  }

  const { recipient } = match;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Recipient</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl">{recipient?.name}</div>

        <ReadOnly
          value={
            recipient?.profile?.notes ??
            `<p><i>Your match has not added any notes yet.</i></p>`
          }
        />
      </CardContent>
    </Card>
  );
};

export default Match;
