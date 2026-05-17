"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Shield, Trophy, Users } from "lucide-react";
import { supabase } from "../lib/supabase";

type Tournament = {
  id: string;
  name?: string;
  nombre?: string;
  category?: string;
  categoria?: string;
};

type Team = {
  id: string;
  name?: string;
  nombre?: string;
  tournament_id?: string;
};

type Player = {
  id: string;
  name?: string;
  nombre?: string;
  full_name?: string;
  position?: string;
  posicion?: string;
  team_id?: string;
};

type Match = {
  id: string;
  tournament_id?: string;
  local_team_id?: string;
  visitor_team_id?: string;
  local_score?: number;
  visitor_score?: number;
  goals?: { player_id: string }[];
};

const categoryNames = [
  "Novatos Empresarial",
  "Veteranos 30 y Mayores",
  "Novatos Libre",
];
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black">{value}</p>
        </div>
        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(categoryNames[0]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;

      const { data: tournamentsData } = await supabase
        .from("tournaments")
        .select("*");

      const { data: teamsData } = await supabase.from("teams").select("*");

      const { data: playersData } = await supabase
        .from("players")
        .select("*");

      const { data: matchesData } = await supabase
        .from("matches")
        .select("*");

      setTournaments(tournamentsData || []);
      setTeams(teamsData || []);
      setPlayers(playersData || []);
      setMatches(matchesData || []);
    }

    loadData();
  }, []);

  // Filtrar torneo activo por categoría
  const activeTournament = tournaments.find((tournament) => {
    const tournamentCategory =
      (tournament.category || tournament.categoria || "")
        .toLowerCase()
        .trim();

    return tournamentCategory.includes(activeCategory.toLowerCase().trim());
  });
   // Equipos filtrados por torneo
  const filteredTeams = activeTournament
    ? teams.filter((team) => team.tournament_id === activeTournament.id)
    : [];

  // Evitar duplicados
  const uniqueTeams = filteredTeams.filter(
    (team, index, self) =>
      index ===
      self.findIndex(
        (item) => (item.name || item.nombre) === (team.name || team.nombre)
      )
  );

  const filteredTeamIds = uniqueTeams.map((team) => team.id);

  // Jugadores filtrados por equipos de la categoría
  const filteredPlayers = players.filter((player) =>
    filteredTeamIds.includes(player.team_id || "")
  );

  // Partidos filtrados por torneo
  const filteredMatches = activeTournament
    ? matches.filter((match) => match.tournament_id === activeTournament.id)
    : [];

  // Tabla general calculada automáticamente
  const standings = uniqueTeams.map((team) => {
    const pj = filteredMatches.filter(
      (m) => m.local_team_id === team.id || m.visitor_team_id === team.id
    ).length;

    const pg = filteredMatches.filter(
      (m) =>
        (m.local_team_id === team.id && m.local_score! > m.visitor_score!) ||
        (m.visitor_team_id === team.id && m.visitor_score! > m.local_score!)
    ).length;

    const pe = filteredMatches.filter(
      (m) =>
        m.local_score === m.visitor_score &&
        (m.local_team_id === team.id || m.visitor_team_id === team.id)
    ).length;

    const pp = pj - pg - pe;

    const gf = filteredMatches
      .filter((m) => m.local_team_id === team.id || m.visitor_team_id === team.id)
      .reduce(
        (sum, m) =>
          sum + (m.local_team_id === team.id ? m.local_score! : m.visitor_score!),
        0
      );

    const gc = filteredMatches
      .filter((m) => m.local_team_id === team.id || m.visitor_team_id === team.id)
      .reduce(
        (sum, m) =>
          sum + (m.local_team_id === team.id ? m.visitor_score! : m.local_score!),
        0
      );

    const pts = pg * 3 + pe;

    return {
      nombre: team.name || team.nombre || "Sin nombre",
      pj,
      pg,
      pe,
      pp,
      gf,
      gc,
      pts,
    };
  });
   // Top 10 goleadores
  const goalsMap: Record<string, number> = {};

  filteredPlayers.forEach((player) => {
    goalsMap[player.id] = filteredMatches.reduce(
      (sum, match) =>
        sum +
        (match.goals?.filter((g) => g.player_id === player.id).length || 0),
      0
    );
  });

  const topScorers = filteredPlayers
    .map((p) => ({ ...p, goals: goalsMap[p.id] || 0 }))
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);

  // Render
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500 p-3">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Torneos Malvagol</h1>
              <p className="text-sm text-slate-300">
                Sistema de estadísticas para fútbol 7
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="rounded-xl bg-emerald-500 px-5 py-2 font-bold"
          >
            Administrador del panel
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap gap-3">
          {categoryNames.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl border px-4 py-2 font-bold ${
                activeCategory === category
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-slate-950 p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-widest">
            Liga activa
          </p>
          <h2 className="mt-2 text-4xl font-black">Torneo Apertura Malvagol</h2>
          <p className="mt-4 max-w-xl">
            Consulta posiciones, resultados, próximos partidos, goleadores y
            estadísticas actualizadas del torneo.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard
            icon={Users}
            label="Equipos registrados"
            value={standings.length}
          />
          <StatCard
            icon={Trophy}
            label="Jugadores registrados"
            value={filteredPlayers.length}
          />
          <StatCard
            icon={CalendarDays}
            label="Partidos"
            value={filteredMatches.length}
          />
          <StatCard icon={Shield} label="Categoría" value={activeCategory} />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="text-3xl font-black">Tabla general</h3>
            <p className="mb-6 text-sm text-slate-500">
              Ordenada por puntos, diferencia de goles y goles a favor.
            </p>

            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-3">#</th>
                  <th>Equipo</th>
                  <th>PJ</th>
                  <th>PG</th>
                  <th>PE</th>
                  <th>PP</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, index) => (
                  <tr key={team.nombre} className="border-b">
                    <td className="py-3 font-bold">{index + 1}</td>
                    <td className="font-bold">{team.nombre}</td>
                    <td>{team.pj}</td>
                    <td>{team.pg}</td>
                    <td>{team.pe}</td>
                    <td>{team.pp}</td>
                    <td>{team.gf}</td>
                    <td>{team.gc}</td>
                    <td className="font-black text-emerald-700">{team.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <aside className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-3xl font-black">Top Goleadores</h3>
            <p className="mb-6 text-sm text-slate-500">
              Goleadores por categoría
            </p>

            <div className="space-y-3">
              {topScorers.map((player, index) => (
                <div key={player.id} className="rounded-2xl border p-4">
                  <p className="font-black">
                    {index + 1}. {player.full_name || player.name || player.nombre} – {player.goals} goles
                  </p>
                  <p className="text-sm text-slate-500">
                    {player.position || player.posicion || "Sin posición"}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
