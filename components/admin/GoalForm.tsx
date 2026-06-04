"use client";

import { createGoal } from "../../app/admin/actions";

type Player = {
  id: string;
  full_name?: string;
  name?: string;
  team_id?: string;
};

type Match = {
  id: string;
  home_team_id?: string;
  away_team_id?: string;
};

export default function GoalForm({
  players,
  match,
}: {
  players: Player[];
  match: Match;
}) {
  const playersInMatch = players.filter(
    (player) =>
      String(player.team_id) === String(match.home_team_id) ||
      String(player.team_id) === String(match.away_team_id)
  );

  return (
    <form action={createGoal} className="rounded-2xl border p-4">
      <input type="hidden" name="match_id" value={match.id} />

      <select
        name="player_id"
        required
        className="w-full rounded-xl border px-3 py-2"
      >
        <option value="">Jugador</option>

        {playersInMatch.map((player) => (
          <option key={player.id} value={player.id}>
            {player.full_name || player.name}
          </option>
        ))}
      </select>

      <input
        name="minute"
        placeholder="Minuto"
        type="number"
        min={0}
        className="mt-3 w-full rounded-xl border px-3 py-2"
      />

      <button
        type="submit"
        className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700"
      >
        Registrar gol
      </button>
    </form>
  );
}