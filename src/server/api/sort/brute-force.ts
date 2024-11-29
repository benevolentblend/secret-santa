import {
  getRandomValues,
  type MatchedPlayer,
  type Player,
  type UserMap,
} from ".";

type BruteForceMatchArgs = {
  players: Player[];
  rounds: number;
  attempts: number;
  users?: UserMap;
};

const bruteForceMatch = ({
  players,
  rounds,
  attempts,
  users,
}: BruteForceMatchArgs):
  | {
      success: true;
      matching: MatchedPlayer[];
      attempts: number;
      rounds: number;
    }
  | {
      success: false;
      matching: null;
      attempts: number;
      rounds: number;
    } => {
  const availablePlayers = players.map(([player]) => player);
  const matchedPlayers: MatchedPlayer[] = [];

  let matchingIndex = 0;
  let attempt = 0;
  let round = 0;

  while (matchingIndex < availablePlayers.length) {
    console.debug(`matchingIndex: ${matchingIndex}`);
    console.debug(`Round: ${round}`);
    console.debug(`Attempt: ${attempt}`);
    if (round >= rounds) {
      console.debug("Max rounds exceeded, failed to sort.");
      return {
        success: false,
        matching: null,
        attempts: attempt,
        rounds: round,
      };
    }
    const currentPlayer = players[matchingIndex];
    const unavailabledPlayers = matchedPlayers
      .slice(0, matchingIndex)
      .map(([_, player]) => player);
    if (!currentPlayer) {
      console.error("Invalid index, failed to sort.");
      return {
        success: false,
        matching: null,
        attempts: attempt,
        rounds: round,
      };
    }

    const validMatches = currentPlayer[1].filter(
      (match) => !unavailabledPlayers.includes(match),
    );

    if (users) {
      console.debug(`Matching for ${users[currentPlayer[0]]?.name}`);
      console.debug("Available users: ");
      validMatches.forEach((user) => {
        console.debug(`\t${users[user]?.name}`);
      });

      console.debug("Unavailable users: ");
      unavailabledPlayers.forEach((user) => {
        console.debug(`\t${users[user]?.name}`);
      });
    }

    if (!validMatches.length) {
      console.warn(`No matches for ${currentPlayer[0]}`);

      attempt++;

      if (attempt > attempts) {
        round++;
        attempt = 0;
        continue;
      }

      matchingIndex = Math.max(0, matchingIndex - attempt);
      continue;
    }

    const match = validMatches[getRandomValues(validMatches.length)]!;

    matchedPlayers[matchingIndex] = [currentPlayer[0], match];

    if (users) {
      console.debug(
        `Matched ${users[currentPlayer[0]]?.name} with ${users[match]?.name}`,
      );
    }

    if (matchedPlayers.length === players.length) {
      return {
        success: true,
        matching: matchedPlayers,
        attempts: attempt,
        rounds: round,
      };
    }

    matchingIndex++;
  }

  return {
    success: false,
    matching: null,
    attempts: attempt,
    rounds: round,
  };
};

export default bruteForceMatch;
