use rand::seq::SliceRandom;
use rand::thread_rng;
use std::fmt;
use std::collections::HashMap;

/// Contains information about a Player
struct Player {
    name: &'static str,
    group_id: u32
}

/// Displays a Player, with their name and group id
/// EX: Player: Ben (1)
impl fmt::Display for Player {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Player: {} ({})", self.name, self.group_id)
    }
}

/// Gets a list of players that could be matched
/// 
/// A player could be a match if they are un matched, 
/// and not in the same group as the player
fn get_available_player_pairings(
    players: &Vec<Player>,
    matchings: &HashMap<usize, usize>,
    current_group: u32) -> Vec<usize> {
    let mut pairings = Vec::new();

    for (i, player) in players.iter().enumerate() {
        if player.group_id == current_group {
            continue;
        } else if !matchings.contains_key(&i) { 
            pairings.push(i);
        }
    }

    pairings.shuffle(&mut thread_rng());

    pairings
}

fn match_players(
    players: &mut Vec<Player>,
    matchings: &mut HashMap<usize, usize>,
    current_player: usize) -> bool {

    let Player {group_id, ..} = players[current_player];
    let available_pairings = get_available_player_pairings(players, matchings, group_id);

    if available_pairings.len() == 0 {
        return false;
    }

    for available_pair in &available_pairings {
        print!("{} ", available_pair);
    }
    print!("\n");
    for available_pair in available_pairings {
        matchings.insert(available_pair, current_player);

        if current_player + 1 == players.len() {
            return true;
        }
        else if match_players(players, matchings, current_player + 1) {
            return true;
        }
        else {
            matchings.remove(&available_pair);
        }
    }

    false
}

fn main(){
    let mut players = Vec::new();
    let mut matchings = HashMap::new();

    players.push(Player {name: "Ben", group_id: 1});
    players.push(Player {name: "Alex", group_id: 1});
    players.push(Player {name: "Chad", group_id: 1});
    players.push(Player {name: "Eric", group_id: 2});
    players.push(Player {name: "Kristin", group_id: 2});
    players.push(Player {name: "Dan", group_id: 3});
    players.push(Player {name: "Molly", group_id: 3});
    players.push(Player {name: "Ken", group_id: 4});

    match match_players(&mut players, &mut matchings, 0) {
        true => println!("Matched!"),
        false => println!("Match failed :("),
    }

    for (i, player) in players.iter().enumerate() {
        let i = matchings[&i];

        println!("{} matched with {}", player, &players[i]);
    }
}
