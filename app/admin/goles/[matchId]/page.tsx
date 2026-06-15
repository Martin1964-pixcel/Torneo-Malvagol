import Link from "next/link";
import {
  createGoal,
  addGoal,
  removeGoal,
} from "../../actions";
import { supabase } from "../../../../lib/supabase";

export default async function GolesPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;

  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();
const { data: teams } = await supabase
  .from("teams")
  .select("id, name");
  const { data: players } = await supabase
    .from("players")
    .select("id, full_name, team_id")
    .in("team_id", [
      match?.home_team_id,
      match?.away_team_id,
    ])
    .order("full_name");
    const homeTeamName =
  teams?.find(
    (team) => team.id === match?.home_team_id
  )?.name || "Local";

const awayTeamName =
  teams?.find(
    (team) => team.id === match?.away_team_id
  )?.name || "Visitante";
const { data: goals } = await supabase
  .from("goals")
  .select("*")
  .eq("match_id", matchId);
  const goalsByPlayer = (goals || []).reduce(
  (acc, goal) => {
    acc[goal.player_id] =
      (acc[goal.player_id] || 0) + 1;

    return acc;
  },
  {} as Record<string, number>
);
  return (
    <main className="p-6">
      <Link
  href="/admin/partidos"
  className="mb-4 inline-block rounded-xl bg-slate-700 px-4 py-2 font-bold text-white"
>
  ← Volver a Partidos
</Link>

<h1 className="text-2xl font-black">
  Captura de goleadores
</h1>

<div className="mt-4 rounded-xl border p-4">
  <h2 className="text-xl font-bold">
    {homeTeamName} vs {awayTeamName}
  </h2>

  <p className="mt-2 text-sm text-slate-600">
    Partido ID: {matchId}
  </p>
</div>

      <div className="mt-6 rounded-xl border p-4">
  <h2 className="mb-4 font-bold">
    Registrar gol
  </h2>

  <form action={createGoal} className="space-y-3">
    <input
      type="hidden"
      name="match_id"
      value={matchId}
    />

    <select
      name="player_id"
      className="w-full rounded border p-2"
      required
    >
      <option value="">
        Selecciona jugador
      </option>

      {(players || []).map((player) => (
        <option
          key={player.id}
          value={player.id}
        >
          {player.full_name}
        </option>
      ))}
    </select>

    <input
      type="number"
      name="goals"
      min="1"
      defaultValue="1"
      className="w-full rounded border p-2"
    />

    <input
      type="number"
      name="minute"
      min="0"
      defaultValue="0"
      className="w-full rounded border p-2"
      placeholder="Minuto"
    />

    <button
      type="submit"
      className="rounded-xl bg-green-600 px-4 py-2 font-bold text-white"
    >
      Registrar gol
    </button>
  </form>
</div>
<div className="mt-6 rounded-xl border p-4">
  <h2 className="mb-4 font-bold">
    Goles registrados
  </h2>

  {(goals || []).length === 0 ? (
    <p>No hay goles registrados.</p>
  ) : (
    <ul className="space-y-2">
      {Object.entries(
        (goals || []).reduce(
          (acc, goal) => {
            acc[goal.player_id] =
              (acc[goal.player_id] || 0) + 1;

            return acc;
          },
          {} as Record<string, number>
        )
      ).map(([playerId, totalGoals]) => {
        const player = players?.find(
          (p) => p.id === playerId
        );

        return (
          <li
          key={playerId}
  className="flex items-center justify-between rounded border p-2"
>
  <span>
    ⚽ {player?.full_name || "Jugador"} ({totalGoals})
  </span>

  <div className="flex gap-2">
    <form action={addGoal}>
      <input
        type="hidden"
        name="player_id"
        value={playerId}
      />

      <input
        type="hidden"
        name="match_id"
        value={matchId}
      />

      <button
        type="submit"
        className="rounded bg-green-600 px-3 py-1 font-bold text-white"
      >
        +
      </button>
    </form>

    <form action={removeGoal}>
      <input
        type="hidden"
        name="player_id"
        value={playerId}
      />

      <input
        type="hidden"
        name="match_id"
        value={matchId}
      />

      <button
        type="submit"
        className="rounded bg-red-600 px-3 py-1 font-bold text-white"
      >
        -
      </button>
    </form>
  </div>
</li>
        );
      })}
    </ul>
  )}
</div>
    </main>
    
  );
}