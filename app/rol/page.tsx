"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Trophy } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Team = {
  id: string;
  name?: string;
  tournament_id?: string;
  logo_url?: string | null;
};

type Match = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  round?: number;
  match_date?: string;
  field?: string;
  tournament_id?: string;
};

type Tournament = {
  id: string;
  name?: string;
  category?: string;
};

export default function RolPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTournament, setActiveTournament] = useState<string>("todos");

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;

      const { data: teamsData } = await supabase.from("teams").select("*");

      const { data: matchesData } = await supabase
        .from("matches")
        .select("*")
        .order("round", { ascending: true })
        .order("match_date", { ascending: true });

      const { data: tournamentsData } = await supabase
        .from("tournaments")
        .select("*")
        .order("name");

      setTeams(teamsData || []);
      setMatches(matchesData || []);
      setTournaments(tournamentsData || []);
    }

    loadData();
  }, []);

  const filteredMatches =
    activeTournament === "todos"
      ? matches
      : matches.filter((match) => match.tournament_id === activeTournament);

  const matchesByRound = filteredMatches.reduce((acc, match) => {
    const round = match.round || 1;

    if (!acc[round]) {
      acc[round] = [];
    }

    acc[round].push(match);

    return acc;
  }, {} as Record<number, Match[]>);

  const orderedRounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  function getTeam(teamId: string) {
  return teams.find((team) => team.id === teamId);
}
function getTeamLogo(teamId: string) {
  return (
    teams.find((team) => team.id === teamId)?.logo_url || ""
  );
}
  function formatDate(date?: string) {
    if (!date) return "Fecha por definir";

    return new Date(date).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(date?: string) {
    if (!date) return "Hora por definir";

    return new Date(date).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-10">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-4 shadow-sm md:p-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-600 p-3 text-white">
                <CalendarDays size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-black md:text-5xl">
                  Rol de Juegos
                </h1>

                <p className="mt-2 text-slate-500">
                  Partidos agrupados por jornada
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-slate-950 px-5 py-3 text-center font-bold text-white"
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

        {orderedRounds.length === 0 && (
          <div className="rounded-2xl border border-slate-200 p-6">
            <p className="text-slate-500">No hay partidos programados.</p>
          </div>
        )}

        <div className="grid gap-6">
          {orderedRounds.map((round) => (
            <section
              key={round}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 md:p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-slate-950 p-3 text-white">
                  <Trophy size={22} />
                </div>

                <div>
                  <p className="text-sm font-bold uppercase text-emerald-700">
                    Jornada
                  </p>
                  <h2 className="text-3xl font-black">{round}</h2>
                </div>
              </div>

              <div className="grid gap-4">
                {matchesByRound[round].map((match) => (
                  <article
                    key={match.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div className="flex flex-col gap-3">
  <div className="flex items-center gap-3">
    {getTeamLogo(match.home_team_id) && (
      <img
        src={getTeamLogo(match.home_team_id)}
        alt={getTeam(match.home_team_id)?.name || "Equipo"}
        className="h-12 w-12 object-contain"
      />
    )}

    <Link
      href={`/equipos/${match.home_team_id}`}
      className="text-xl font-black hover:text-emerald-600"
    >
      {getTeam(match.home_team_id)?.name || "Equipo"}
    </Link>
  </div>

  <p className="ml-16 text-sm font-bold text-emerald-700">
    VS
  </p>

  <div className="flex items-center gap-3">
    {getTeamLogo(match.away_team_id) && (
      <img
        src={getTeamLogo(match.away_team_id)}
        alt={getTeam(match.away_team_id)?.name || "Equipo"}
        className="h-12 w-12 object-contain"
      />
    )}

    <Link
      href={`/equipos/${match.away_team_id}`}
      className="text-xl font-black hover:text-emerald-600"
    >
      {getTeam(match.away_team_id)?.name || "Equipo"}
    </Link>
  </div>
</div>

                      <div className="rounded-2xl bg-slate-100 p-4 text-sm md:text-right">
                        <p className="font-black text-slate-900">
                          {match.field || "Cancha por definir"}
                        </p>

                        <p className="mt-1 text-slate-600">
                          {formatDate(match.match_date)}
                        </p>

                        <p className="mt-1 font-bold text-emerald-700">
                          {formatTime(match.match_date)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}