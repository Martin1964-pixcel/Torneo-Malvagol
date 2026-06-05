"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function TablaPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTournament, setActiveTournament] = useState<string>("todos");

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;

      const { data: teamsData } = await supabase.from("teams").select("*");
      const { data: matchesData } = await supabase.from("matches").select("*");
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

  const filteredTeams =
    activeTournament === "todos"
      ? teams
      : teams.filter((team) => team.tournament_id === activeTournament);

  const filteredMatches =
    activeTournament === "todos"
      ? matches
      : matches.filter((match) => match.tournament_id === activeTournament);

  const standings = filteredTeams
    .map((team) => {
      const played = filteredMatches.filter(
        (match) =>
          match.home_team_id === team.id || match.away_team_id === team.id
      );

      const gf = played.reduce((total, match) => {
        return (
          total +
          (match.home_team_id === team.id
            ? match.home_score || 0
            : match.away_score || 0)
        );
      }, 0);

      const gc = played.reduce((total, match) => {
        return (
          total +
          (match.home_team_id === team.id
            ? match.away_score || 0
            : match.home_score || 0)
        );
      }, 0);

      const pg = played.filter((match) => {
        const favor =
          match.home_team_id === team.id
            ? match.home_score || 0
            : match.away_score || 0;

        const contra =
          match.home_team_id === team.id
            ? match.away_score || 0
            : match.home_score || 0;

        return favor > contra;
      }).length;

      const pe = played.filter((match) => {
        const favor =
          match.home_team_id === team.id
            ? match.home_score || 0
            : match.away_score || 0;

        const contra =
          match.home_team_id === team.id
            ? match.away_score || 0
            : match.home_score || 0;

        return favor === contra;
      }).length;

      const pj = played.length;
      const pp = pj - pg - pe;
      const dif = gf - gc;
      const pts = pg * 3 + pe;

      return {
        id: team.id,
        name: team.name || "Sin nombre",
        pj,
        pg,
        pe,
        pp,
        gf,
        gc,
        dif,
        pts,
      };
    })
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dif !== a.dif) return b.dif - a.dif;
      return b.gf - a.gf;
    });

  const recentResults = filteredMatches
    .filter(
      (match) => (match.home_score || 0) > 0 || (match.away_score || 0) > 0
    )
    .sort(
      (a, b) =>
        new Date(b.match_date || "").getTime() -
        new Date(a.match_date || "").getTime()
    )
    .slice(0, 6);

  const upcomingMatches = filteredMatches
    .filter(
      (match) =>
        (match.home_score || 0) === 0 && (match.away_score || 0) === 0
    )
    .sort(
      (a, b) =>
        new Date(a.match_date || "").getTime() -
        new Date(b.match_date || "").getTime()
    )
    .slice(0, 6);

  function getTeamName(teamId: string) {
    return teams.find((team) => team.id === teamId)?.name || "Equipo";
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-10">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-4 shadow-sm md:p-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black md:text-5xl">Tabla</h1>

            <p className="mt-2 text-slate-500">
              Posiciones automáticas del torneo
            </p>
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

        <div className="rounded-2xl border border-slate-200 p-4 md:p-6">
          <p className="text-xl font-bold text-emerald-700">
            Tabla conectada 😄⚽
          </p>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th>Equipo</th>
                  <th>PJ</th>
                  <th>PG</th>
                  <th>PE</th>
                  <th>PP</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>DIF</th>
                  <th>PTS</th>
                </tr>
              </thead>

              <tbody>
                {standings.map((team, index) => (
                  <tr key={team.id} className="border-b">
                    <td className="px-4 py-3 font-bold">{index + 1}</td>
                   <td>
  <div className="flex items-center gap-2">
    {teams.find((t) => t.id === team.id)?.logo_url && (
      <img
        src={teams.find((t) => t.id === team.id)?.logo_url || ""}
        alt={team.name}
        className="h-8 w-8 rounded-full object-cover"
      />
    )}

    <span className="font-black">
      {team.name}
    </span>
  </div>
</td>
                    <td>{team.pj}</td>
                    <td>{team.pg}</td>
                    <td>{team.pe}</td>
                    <td>{team.pp}</td>
                    <td>{team.gf}</td>
                    <td>{team.gc}</td>
                    <td>{team.dif}</td>
                    <td className="font-black text-emerald-700">{team.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="mb-4 text-2xl font-black">
                Resultados recientes
              </h2>

              <div className="grid gap-3">
                {recentResults.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No hay resultados registrados.
                  </p>
                )}

                {recentResults.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <p className="font-black">
                      {getTeamName(match.home_team_id)} {match.home_score} -{" "}
                      {match.away_score} {getTeamName(match.away_team_id)}
                    </p>

                    <span className="block text-sm text-slate-500">
                      Jornada {match.round || 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="mb-4 text-2xl font-black">Próximos partidos</h2>

              <div className="grid gap-3">
                {upcomingMatches.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No hay partidos programados.
                  </p>
                )}

                {upcomingMatches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <p className="font-black">
                      {getTeamName(match.home_team_id)} vs{" "}
                      {getTeamName(match.away_team_id)}
                    </p>

                    <p className="text-sm text-slate-500">
                      Jornada {match.round || 1}
                      {match.field ? ` · ${match.field}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}