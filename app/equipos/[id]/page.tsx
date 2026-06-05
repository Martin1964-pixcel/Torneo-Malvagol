"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Team = {
  id: string;
  name?: string;
  logo_url?: string | null;
};

type Player = {
  id: string;
  full_name?: string;
  position?: string;
  team_id?: string;
};

type Goal = {
  id: string;
  player_id: string;
  team_id?: string;
};

type Match = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  match_date?: string;
  field?: string;
  round?: number;
};

export default function EquipoPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    if (!supabase) return;

    const { data: teamData } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    const { data: playersData } = await supabase
      .from("players")
      .select("*")
      .eq("team_id", teamId);

    const { data: goalsData } = await supabase
      .from("goals")
      .select("*")
      .eq("team_id", teamId);

    const { data: matchesData } = await supabase
      .from("matches")
      .select("*");

    const { data: teamsData } = await supabase
      .from("teams")
      .select("*");

    setTeam(teamData);
    setPlayers(playersData || []);
    setGoals(goalsData || []);
    setMatches(matchesData || []);
    setAllTeams(teamsData || []);
  }

  function getTeamName(id: string) {
    return (
      allTeams.find((team) => team.id === id)?.name ||
      "Equipo"
    );
  }

  const teamMatches = matches.filter(
    (match) =>
      match.home_team_id === teamId ||
      match.away_team_id === teamId
  );

  const pj = teamMatches.length;

  const pg = teamMatches.filter((match) => {
    const favor =
      match.home_team_id === teamId
        ? match.home_score
        : match.away_score;

    const contra =
      match.home_team_id === teamId
        ? match.away_score
        : match.home_score;

    return favor > contra;
  }).length;

  const pe = teamMatches.filter((match) => {
    const favor =
      match.home_team_id === teamId
        ? match.home_score
        : match.away_score;

    const contra =
      match.home_team_id === teamId
        ? match.away_score
        : match.home_score;

    return favor === contra;
  }).length;

  const pp = pj - pg - pe;

  const gf = teamMatches.reduce((total, match) => {
    return (
      total +
      (match.home_team_id === teamId
        ? match.home_score
        : match.away_score)
    );
  }, 0);

  const gc = teamMatches.reduce((total, match) => {
    return (
      total +
      (match.home_team_id === teamId
        ? match.away_score
        : match.home_score)
    );
  }, 0);

  const dif = gf - gc;
  const pts = pg * 3 + pe;

  const goleadores = players
    .map((player) => ({
      ...player,
      goles: goals.filter(
        (goal) => goal.player_id === player.id
      ).length,
    }))
    .sort((a, b) => b.goles - a.goles);

  const ultimosResultados = teamMatches
    .filter(
      (match) =>
        match.home_score > 0 ||
        match.away_score > 0
    )
    .slice(0, 5);

  const proximosPartidos = teamMatches
    .filter(
      (match) =>
        match.home_score === 0 &&
        match.away_score === 0
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/tabla"
          className="mb-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
        >
          ← Volver
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
                {team?.name}
              </h1>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

            <Stat title="PJ" value={pj} />
            <Stat title="PG" value={pg} />
            <Stat title="PE" value={pe} />
            <Stat title="PP" value={pp} />
            <Stat title="GF" value={gf} />
            <Stat title="GC" value={gc} />
            <Stat title="DIF" value={dif} />
            <Stat title="PTS" value={pts} />

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <section className="rounded-2xl border p-5">
              <h2 className="mb-4 text-2xl font-black">
                Plantilla
              </h2>

              {players.map((player) => (
                <div
                  key={player.id}
                  className="border-b py-2"
                >
                  <p className="font-bold">
                    {player.full_name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {player.position}
                  </p>
                </div>
              ))}
            </section>

            <section className="rounded-2xl border p-5">
              <h2 className="mb-4 text-2xl font-black">
                Goleadores
              </h2>

              {goleadores.map((player) => (
                <div
                  key={player.id}
                  className="flex justify-between border-b py-2"
                >
                  <span>{player.full_name}</span>

                  <span className="font-black text-emerald-700">
                    {player.goles}
                  </span>
                </div>
              ))}
            </section>

          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <section className="rounded-2xl border p-5">
              <h2 className="mb-4 text-2xl font-black">
                Últimos resultados
              </h2>

              {ultimosResultados.map((match) => (
                <div
                  key={match.id}
                  className="border-b py-3"
                >
                  {getTeamName(match.home_team_id)}{" "}
                  {match.home_score} - {match.away_score}{" "}
                  {getTeamName(match.away_team_id)}
                </div>
              ))}
            </section>

            <section className="rounded-2xl border p-5">
              <h2 className="mb-4 text-2xl font-black">
                Próximos partidos
              </h2>

              {proximosPartidos.map((match) => (
                <div
                  key={match.id}
                  className="border-b py-3"
                >
                  {getTeamName(match.home_team_id)} vs{" "}
                  {getTeamName(match.away_team_id)}
                </div>
              ))}
            </section>

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
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="text-3xl font-black">
        {value}
      </p>
    </div>
  );
}