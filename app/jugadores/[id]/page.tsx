"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Player = {
  id: string;
  full_name?: string;
  number?: number;
  position?: string;
  team_id?: string;
};

type Team = {
  id: string;
  name?: string;
  logo_url?: string | null;
};

type Goal = {
  id: string;
  player_id: string;
  team_id?: string;
  match_id?: string;
};

type Match = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
};

export default function JugadorPage() {
  const params = useParams();
  const playerId = params.id as string;
  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  const [teamGoals, setTeamGoals] = useState<Goal[]>([]);

  useEffect(() => {
    if (!playerId) return;

    loadData();
  }, [playerId]);

  async function loadData() {
    if (!supabase) return;

    const { data: playerData } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();
      

    if (!playerData) return;

    const { data: teamData } = await supabase
      .from("teams")
      .select("*")
      .eq("id", playerData.team_id)
      .single();

    const { data: goalsData } = await supabase
      .from("goals")
      .select("*")
      .eq("player_id", playerId);

    const { data: matchesData } = await supabase
      .from("matches")
      .select("*");
      const { data: teamPlayers } = await supabase
  .from("players")
  .select("*")
  .eq("team_id", playerData.team_id);

const { data: teamGoals } = await supabase
  .from("goals")
  .select("*")
  .eq("team_id", playerData.team_id);

    setPlayer(playerData);
    setTeam(teamData);
    setGoals(goalsData || []);
    setMatches(matchesData || []);
    setTeamPlayers(teamPlayers || []);
setTeamGoals(teamGoals || []);
  }

  const goles = goals.length;
  const partidosJugados = matches.filter(
  (match) =>
    match.home_team_id === player?.team_id ||
    match.away_team_id === player?.team_id
).length;

const promedio =
  partidosJugados > 0
    ? (goles / partidosJugados).toFixed(2)
    : "0.00";
    const goleadoresEquipo = teamPlayers
  .map((p) => ({
    id: p.id,
    nombre: p.full_name,
    goles: teamGoals.filter(
      (goal) => goal.player_id === p.id
    ).length,
  }))
  .sort((a, b) => b.goles - a.goles);

const rankingEquipo =
  goleadoresEquipo.findIndex(
    (p) => p.id === player?.id
  ) + 1;
  const liderEquipo = goleadoresEquipo[0];  
  const diferenciaLider =
  (liderEquipo?.goles || 0) - goles;
  
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">

        <Link
          href={`/equipos/${team?.id}`}
          className="mb-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
        >
          ← Volver al equipo
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <div className="mb-8 flex items-center gap-6">

            {team?.logo_url && (
              <img
                src={team.logo_url}
                alt={team.name}
                className="h-24 w-24 object-contain"
              />
            )}

            <div>
              <h1 className="text-4xl font-black">
                {player?.full_name}
              </h1>

              <p className="text-lg text-slate-600">
                {team?.name}
              </p>
            </div>

          </div>

          <div className="grid gap-4 md:grid-cols-5">
<Stat
  title="Número"
  value={
    player?.number && player.number > 0
      ? player.number
      : "Sin número"
  }
/>

<Stat
  title="Posición"
  value={
    player?.position || "Sin posición"
  }
/>

<Stat
  title="Goles"
  value={goles}
/>

<Stat
  title="Partidos"
  value={partidosJugados}
/>

<Stat
  title="Promedio"
  value={promedio}
/>

<Stat
  title="Ranking"
  value={`#${rankingEquipo}`}
/>

          </div>
<div className="mt-4 rounded-2xl border bg-slate-50 p-4">
  <p className="text-sm font-bold text-slate-500">
    🏆 Líder del equipo
  </p>

  <p className="mt-1 text-lg font-black">
    {liderEquipo?.nombre}
  </p>

  <p className="text-slate-600">
    {liderEquipo?.goles} goles
  </p>
</div>
<div className="mt-4 rounded-2xl border bg-slate-50 p-4">
  <p className="text-sm font-bold text-slate-500">
    📊 Situación en el equipo
  </p>

  <p className="mt-2">
    Ranking: <strong>#{rankingEquipo}</strong>
  </p>

  <p>
    {diferenciaLider === 0
      ? "Es el líder goleador del equipo"
      : `Está a ${diferenciaLider} goles del líder`}
  </p>
</div>
        </div>
      </div>

      </main>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  const destacado =
    title === "Goles" ||
    title === "Ranking";

  return (
    <div
      className={`rounded-2xl p-4 text-center shadow-sm ${
        destacado
          ? "bg-emerald-50 border border-emerald-200"
          : "bg-white"
      }`}
    >
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p
        className={`font-black ${
          destacado
            ? "text-3xl text-emerald-700"
            : "text-2xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}