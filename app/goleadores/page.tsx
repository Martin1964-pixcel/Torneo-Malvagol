"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Player = {
  id: string;
  full_name?: string;
  name?: string;
  nombre?: string;
  position?: string;
  posicion?: string;
  team_id?: string;
};

type Team = {
  id: string;
  name?: string;
  nombre?: string;
  tournament_id?: string;
  logo_url?: string | null;
};

type Goal = {
  id: string;
  player_id: string;
};

export default function GoleadoresPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [tournaments, setTournaments] = useState<any[]>([]);
const [activeTournament, setActiveTournament] =
  useState<string>("todos");
  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      const { data: tournamentsData } = await supabase
  .from("tournaments")
  .select("*")
  .order("name");

      const { data: playersData } = await supabase
        .from("players")
        .select("*");

      const { data: teamsData } = await supabase
        .from("teams")
        .select("*");

      const { data: goalsData } = await supabase
        .from("goals")
        .select("*");

      setPlayers(playersData || []);
      setTeams(teamsData || []);
      setGoals(goalsData || []);
      setTournaments(tournamentsData || []);
    }

    loadData();
  }, []);

  const teamNameById = Object.fromEntries(
    teams.map((team) => [
      team.id,
      team.name || team.nombre || "Sin equipo",
    ])
  );
const teamLogoById = Object.fromEntries(
  teams.map((team) => [team.id, team.logo_url || ""])
);
  const filteredPlayers =
  activeTournament === "todos"
    ? players
    : players.filter((player) => {
        const team = teams.find(
          (team) => team.id === player.team_id
        );

        return (
          team &&
          (team as any).tournament_id ===
            activeTournament
        );
      });

const goleadores = filteredPlayers
  .map((player) => ({
    ...player,
    goles: goals.filter(
      (goal) => goal.player_id === player.id
    ).length,
  }))
  .sort((a, b) => {
    if (b.goles !== a.goles)
      return b.goles - a.goles;

    return (
      (a.full_name || "").localeCompare(
        b.full_name || ""
      )
    );
  });

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-600 p-3 text-white">
              <Trophy size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-black md:text-4xl">
                Tabla de Goleadores
              </h1>

              <p className="text-slate-500">
                Ranking general del torneo
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
          >
            Volver
          </Link>
        </div>
<div className="mb-6 flex flex-wrap gap-3">
  <button
    onClick={() => setActiveTournament("todos")}
    className={`rounded-xl border px-4 py-2 font-bold ${
      activeTournament === "todos"
        ? "bg-emerald-600 text-white"
        : "bg-white text-slate-700"
    }`}
  >
    Todos
  </button>

  {tournaments.map((tournament) => (
    <button
      key={tournament.id}
      onClick={() => setActiveTournament(tournament.id)}
      className={`rounded-xl border px-4 py-2 font-bold ${
        activeTournament === tournament.id
          ? "bg-emerald-600 text-white"
          : "bg-white text-slate-700"
      }`}
    >
      {tournament.category || tournament.name}
    </button>
  ))}
</div>
        <div className="space-y-4">
          {goleadores.map((player, index) => (
            <div
              key={player.id}
              className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
             <div className="flex items-center gap-4">
  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border bg-slate-100 p-2">
    {teamLogoById[player.team_id || ""] ? (
      <img
        src={teamLogoById[player.team_id || ""]}
        alt={teamNameById[player.team_id || ""] || "Equipo"}
        className="max-h-full max-w-full object-contain"
      />
    ) : (
      <span className="text-xs font-bold text-slate-400">
        Sin logo
      </span>
    )}
  </div>

  <div>
    <p className="text-2xl font-black">
      #{index + 1}{" "}
      {player.full_name ||
        player.name ||
        player.nombre}
    </p>

    <p className="text-slate-500">
      {teamNameById[player.team_id || ""] ||
        "Sin equipo"}
    </p>

    <p className="text-sm text-slate-400">
      {player.position ||
        player.posicion ||
        "Sin posición"}
    </p>
  </div>
</div>

              <div className="rounded-2xl bg-emerald-600 px-6 py-4 text-center text-white">
                <p className="text-4xl font-black">
                  {player.goles}
                </p>

                <p className="text-sm uppercase tracking-widest">
                  goles
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}