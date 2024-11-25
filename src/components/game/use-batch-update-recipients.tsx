import type { Prisma, User } from "@prisma/client";
import { useEffect, useMemo, useReducer } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

type GroupWithUser = {
  include: {
    users: {
      select: {
        id: true;
      };
    };
  };
  select: {
    id: true;
    users: true;
  };
};

export type GameMatchWithUsers = Prisma.GameMatchGetPayload<{
  include: {
    patron: {
      include: {
        group: GroupWithUser;
      };
    };
    recipient: {
      include: {
        group: GroupWithUser;
      };
    };
  };
}>;

export type UserWithGroup = Prisma.UserGetPayload<{
  include: {
    group: GroupWithUser;
  };
}>;

interface useSelectRecipients {
  gameId: number;
}

export type updateRecipientArgs = {
  matchId: number;
  recipientId: string | null;
};

type State = {
  availableRecipients: User[];
  allPatrons: UserWithGroup[];
  allRecipients: UserWithGroup[];
  AvailableRecipients: UserWithGroup[];
  shadowMatches: GameMatchWithUsers[];
  updatedMatches: GameMatchWithUsers[];
};

type Action =
  | {
      type: "updateRecipient";
      payload: updateRecipientArgs;
    }
  | {
      type: "refreshShadowMatches";
      payload: GameMatchWithUsers[];
    };

const getDiffRecipients = (
  a: GameMatchWithUsers[],
  b: GameMatchWithUsers[],
) => {
  return a.filter(({ recipientId: aRecipientId, id: aId }) => {
    return b.some(
      ({ recipientId: bRecipientId, id: bId }) =>
        aId === bId && aRecipientId !== bRecipientId,
    );
  });
};

const getPatronById = (matches: GameMatchWithUsers[], id: string) => {
  const patrons = matches.filter(({ patronId }) => patronId === id);

  return patrons[0]?.patron ?? null;
};

const getPatrons = (matches: GameMatchWithUsers[]) =>
  matches.map(({ patron }) => patron);

const getRecipients = (matches: GameMatchWithUsers[]) => {
  return matches
    .map(({ recipient }) => recipient)
    .filter((recipient) => !!recipient);
};

const getAvailableRecipients = (patrons: User[], recipients: User[]) =>
  patrons.filter(
    ({ id: patronId }) =>
      !recipients.some(({ id: recipientId }) => patronId === recipientId),
  );

const initialState: State = {
  availableRecipients: [],
  allPatrons: [],
  allRecipients: [],
  AvailableRecipients: [],
  shadowMatches: [],
  updatedMatches: [],
};

const useBatchUpdateRecipients = ({ gameId }: useSelectRecipients) => {
  const getMatches = api.game.getMatches.useQuery({ id: gameId });
  const gameMatches = useMemo(() => getMatches.data ?? [], [getMatches.data]);

  const reducer = (state: State, action: Action): State => {
    const newState = { ...state };

    console.log("Old State", state);

    switch (action.type) {
      case "updateRecipient":
        debugger;
        const { matchId, recipientId } = action.payload;
        console.log(action.payload);

        const recipient = recipientId
          ? getPatronById(newState.shadowMatches, recipientId)
          : null;

        const newBatchedChange = state.shadowMatches.map((change) => {
          return change.id === matchId
            ? { ...change, recipientId, recipient }
            : change;
        });

        newState.shadowMatches = newBatchedChange;
        newState.updatedMatches = getDiffRecipients(
          newBatchedChange,
          gameMatches,
        );

        break;
      case "refreshShadowMatches":
        newState.shadowMatches = [...action.payload];
        newState.updatedMatches = [];
    }

    newState.allPatrons = getPatrons(newState.shadowMatches);
    newState.allRecipients = getRecipients(newState.shadowMatches);
    newState.availableRecipients = getAvailableRecipients(
      newState.allPatrons,
      newState.allRecipients,
    );

    console.log("New State", newState);

    return newState;
  };

  const [
    {
      availableRecipients,
      allPatrons,
      allRecipients,
      shadowMatches,
      updatedMatches,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const utils = api.useUtils();
  const updateRecipients = api.game.assignRecipients.useMutation({
    async onSuccess(recipientCount) {
      const plural = recipientCount !== 1;
      toast.info(`Updated ${recipientCount} recipient${plural ? "s" : ""}.`);
      await utils.game.getMatches.invalidate();
    },
  });

  const save = () => {
    if (!updatedMatches.length) {
      return;
    }
    updateRecipients.mutate({ gameId, matches: updatedMatches });
  };

  useEffect(() => {
    dispatch({ type: "refreshShadowMatches", payload: gameMatches });
  }, [gameMatches]);

  const updateRecipient = ({ matchId, recipientId }: updateRecipientArgs) =>
    dispatch({
      type: "updateRecipient",
      payload: {
        recipientId,
        matchId,
      },
    });

  return {
    updateRecipient,
    save,
    shadowMatches,
    availableRecipients,
    updatedMatches,
    allPatrons,
    allRecipients,
  };
};

export default useBatchUpdateRecipients;
