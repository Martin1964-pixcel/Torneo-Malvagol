"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
type Team = {
  id: string;
  name?: string;
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

export default function TablaPage() {
  const [teams, setTeams] = useState<Team[]>([]);
const [matches, setMatches] = useState<Match[]>([]);
const [activeTournament, setActiveTournament] = useState<string>("todos");
const [tournaments, setTournaments] = useState<any[]>([]);
const standings = (
  activeTournament === "todos"
    ? teams
    : teams.filter(
        (team: any) =>
          team.tournament_id === activeTournament
      )
).map((team) => {
    const played = matches.filter(
      (match) =>
         (activeTournament === "todos" ||
           match.tournament_id === activeTournament) &&
      (match.home_team_id === team.id ||
         match.away_team_id === team.id)
    );

    const gf = played.reduce((total, match) => {
      return total + (match.home_team_id === team.id ? match.home_score || 0 : match.away_score || 0);
    }, 0);

    const gc = played.reduce((total, match) => {
      return total + (match.home_team_id === team.id ? match.away_score || 0 : match.home_score || 0);
    }, 0);

    const pg = played.filter((match) => {
      const favor = match.home_team_id === team.id ? match.home_score || 0 : match.away_score || 0;
      const contra = match.home_team_id === team.id ? match.away_score || 0 : match.home_score || 0;
      return favor > contra;
    }).length;

    const pe = played.filter((match) => {
      const favor = match.home_team_id === team.id ? match.home_score || 0 : match.away_score || 0;
      const contra = match.home_team_id === team.id ? match.away_score || 0 : match.home_score || 0;
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
    const recentResults = matches
  .filter(
    (match) =>
      (match.home_score || 0) > 0 ||
      (match.away_score || 0) > 0
  )
  .slice(-6)
  .reverse();
    return b.gf - a.gf;
  });

useEffect(() => {
  async function loadData() {
    if (!supabase) return;

    const { data: teamsData } = await supabase
      .from("teams")
      .select("*");

    const { data: matchesData } = await supabase
      .from("matches")
      .select("*");
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

const recentResults: Match[] = matches
  .filter(
    (match) =>
      (match.home_score || 0) > 0 ||
      (match.away_score || 0) > 0
  )
  .slice(-6)
  .reverse();
  const upcomingMatches = matches
  .filter(
    (match) =>
      (activeTournament === "todos" ||
        match.tournament_id === activeTournament) &&
      match.home_score === 0 &&
      match.away_score === 0
  )
  .slice(0, 6);
  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-4 shadow-sm md:p-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black md:text-5xl">
              /Tabla
            </h1>
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

        <div className="rounded-2xl border border-slate-200 p-6">
          <p className="text-xl font-bold text-emerald-700">
            Tabla conectada 😄⚽
          </p>
<div className="overflow-x-auto">
  </div> 
         <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
  <table className="w-full text-left text-sm">
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
          <td className="font-black">{team.name}</td>
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
<div className="grid gap-6 md:grid-cols-2">
<div className="mt-8 rounded-2xl border border-slate-200 p-6">
  <h2 className="mb-4 text-2xl font-black">
    Resultados recientes
  </h2>

  <div className="grid gap-3">
    {recentResults.map((match) => {
      const upcomingMatches: Match[] = matches
  .filter(
    (match) =>
      (match.home_score || 0) === 0 &&
      (match.away_score || 0) === 0
  )
  .slice(0, 6);
      const homeTeam = teams.find(
        (team) => team.id === match.home_team_id
      );

      const awayTeam = teams.find(
        (team) => team.id === match.away_team_id
      );

      return (
        <div
          key={match.id}
          className="rounded-xl border border-slate-200 px-4 py-3"
        >
          <p className="font-black">
            {homeTeam?.name || "Local"}{" "}
            {match.home_score} - {match.away_score}{" "}
            {awayTeam?.name || "Visitante"}
            <span className="block text-sm text-slate-500">
  Jornada {match.round || 1}
</span>
          </p>
        </div>
      );
    })}
  </div>
</div>
<div className="grid gap-6 md:grid-cols-2"></div>
<div className="mt-8 rounded-2xl border border-slate-200 p-6">
  <h2 className="mb-4 text-2xl font-black">
    Próximos partidos    
  </h2>
  

  <div className="grid gap-3">
    {upcomingMatches.map((match) => {
      const homeTeam = teams.find(
        (team) => team.id === match.home_team_id
      );

      const awayTeam = teams.find(
        (team) => team.id === match.away_team_id
      );

      return (
        <div
          key={match.id}
          className="rounded-xl border border-slate-200 px-4 py-3"
        >
          <p className="font-black">
            {homeTeam?.name || "Local"} vs{" "}
            {awayTeam?.name || "Visitante"}
          </p>
        </div>
      );
    })}
  </div>
</div>
       </div>
    </div>
      </div>
    </main>
  );
}