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
  logo_url?: string | null;
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
type Goal = {
  id: string;
  player_id: string;
  match_id?: string;
  team_id?: string;
  minute?: number;
};

type Match = {
  id: string;
  tournament_id: string;

  home_team_id: string;
  away_team_id: string;

  home_score: number;
  away_score: number;

  field: string;
  match_date: string;

  status: string;
};

const categoryNames = [
  "Libre Intermedia",
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
const [goals, setGoals] = useState<Goal[]>([]);

useEffect(() => {
  async function loadData() {
    console.log("ENTRE A LOADDATA");

    if (!supabase) return;
console.log(
  "VERCEL URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL
);

console.log(
  "VERCEL KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30)
);
    const { data: tournamentsData, error: tournamentsError } =
      await supabase
        .from("tournaments")
        .select("*");

    console.log("TOURNAMENTS DATA API", tournamentsData);
    console.log("TOURNAMENTS ERROR API", tournamentsError);

    const { data: teamsData, error: teamsError } =
      await supabase
        .from("teams")
        .select("*");

    console.log("TEAMS DATA", teamsData);
    console.log("TEAMS ERROR", teamsError);

    const { data: playersData, error: playersError } =
      await supabase
        .from("players")
        .select("*");

    console.log("PLAYERS DATA", playersData);
    console.log("PLAYERS ERROR", playersError);

    const { data: matchesData, error: matchesError } =
      await supabase
        .from("matches")
        .select("*");

    console.log("MATCHES DATA", matchesData);
    console.log("MATCHES ERROR", matchesError);

    const { data: goalsData, error: goalsError } =
      await supabase
        .from("goals")
        .select("*");

    console.log("GOALS DATA", goalsData);
    console.log("GOALS ERROR", goalsError);

    setTournaments(tournamentsData || []);
    setTeams(teamsData || []);
    setPlayers(playersData || []);
    setMatches(matchesData || []);
    setGoals(goalsData || []);
  }

  console.log("VOY A EJECUTAR LOADDATA");
  loadData();
}, []);
  // Filtrar torneo activo por categoría
  console.log("TOURNAMENTS STATE", tournaments);
 const activeTournament = tournaments.find((tournament) => {
  console.log(
    "COMPARE",
    tournament.category,
    activeCategory
  );

  const tournamentCategory =
    (tournament.category || tournament.categoria || "")
      .toLowerCase()
      .trim();

  return tournamentCategory.includes(
    activeCategory.toLowerCase().trim()
  );
});
   // Equipos filtrados por torneo
  const filteredTeams = activeTournament
    ? teams.filter((team) => team.tournament_id === activeTournament.id)
    : [];
    console.log("TOURNAMENTS", tournaments);
console.log("ACTIVE CATEGORY", activeCategory);
console.log("ACTIVE TOURNAMENT", activeTournament);
console.log("TEAMS", teams.length);
console.log("FILTERED", filteredTeams.length);

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
const teamNameById = Object.fromEntries(
  teams.map((team) => [
    team.id,
    team.name || team.nombre || "Sin nombre",
  ])
);
const teamLogoById = Object.fromEntries(
  teams.map((team) => [
    team.id,
    team.logo_url || "",
  ])
);
const upcomingMatches = filteredMatches.filter(
  (match) =>
    (match.home_score ?? 0) === 0 &&
    (match.away_score ?? 0) === 0
);

const finishedMatches = filteredMatches.filter(
  (match) =>
    (match.home_score ?? 0) > 0 ||
    (match.away_score ?? 0) > 0
);
  // Tabla general calculada automáticamente
  const standings = uniqueTeams
  .map((team) => {
    const teamMatches = filteredMatches.filter(
      (match) =>
        match.home_team_id === team.id || match.away_team_id === team.id
    );

const pj = teamMatches.filter(
  (match) =>
    (match.home_score || 0) > 0 ||
    (match.away_score || 0) > 0
).length;
    const gf = teamMatches.reduce((total, match) => {
      if (match.home_team_id === team.id) {
        return total + (match.home_score || 0);
      }

      return total + (match.away_score || 0);
    }, 0);

    const gc = teamMatches.reduce((total, match) => {
      if (match.home_team_id === team.id) {
        return total + (match.away_score || 0);
      }

      return total + (match.home_score || 0);
    }, 0);

    const pg = teamMatches.filter((match) => {
      if (match.home_team_id === team.id) {
        return (match.home_score || 0) > (match.away_score || 0);
      }

      return (match.away_score || 0) > (match.home_score || 0);
    }).length;

    const pe = teamMatches.filter((match) => {
  const home = match.home_score || 0;
  const away = match.away_score || 0;

  return (home > 0 || away > 0) && home === away;
}).length;

    const pp = pj - pg - pe;

    const pts = pg * 3 + pe;

    return {
      nombre: team.name || team.nombre || "Sin nombre",
      pj,
      pg,
      pe,
      pp,
      gf,
      gc,
      dif: gf - gc,
      pts,
    };
  })
  .sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;

    const dgA = a.gf - a.gc;
    const dgB = b.gf - b.gc;

    if (dgB !== dgA) return dgB - dgA;

    return b.gf - a.gf;
  });
   // Top 10 goleadores
  const goalsMap: Record<string, number> = {};

  filteredPlayers.forEach((player) => {
  goalsMap[player.id] = goals.filter(
    (goal) => goal.player_id === player.id
  ).length;
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

          <div className="flex gap-3">
  <Link
    href="/tabla"
    className="rounded-xl bg-white px-5 py-2 font-bold text-slate-950"
  >
    Tabla
  </Link>

  <Link
    href="/goleadores"
    className="rounded-xl bg-emerald-500 px-5 py-2 font-bold text-white"
  >
    Goleadores
  </Link>

  <Link
    href="/rol"
    className="rounded-xl bg-sky-600 px-5 py-2 font-bold text-white"
  >
    Rol
  </Link>

  <Link
    href="/admin"
    className="rounded-xl bg-slate-800 px-5 py-2 font-bold text-white"
  >
    Admin
  </Link>
</div>
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
                  <th>DIF</th>
                  <th>PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, index) => (
                  <tr key={team.nombre} className="border-b">
  <td className="py-3 font-bold">{index + 1}</td>
  <td>
  <div className="flex items-center gap-2">
    {teams.find(
      (t) =>
        (t.name || t.nombre) === team.nombre
    )?.logo_url && (
      <img
        src={
          teams.find(
            (t) =>
              (t.name || t.nombre) === team.nombre
          )?.logo_url || ""
        }
        alt={team.nombre}
        className="h-8 w-8 object-contain"
      />
    )}

    <span className="font-bold">
      {team.nombre}
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
            <section className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
  <h3 className="text-3xl font-black">Próximos partidos</h3>
<p className="mb-6 text-sm text-slate-500">
  Juegos pendientes por disputarse.
</p>

<div className="space-y-3">
  {upcomingMatches.map((match) => (
    <div key={match.id} className="rounded-2xl border p-4">
      <div className="flex items-center gap-3">
  {teamLogoById[match.home_team_id || ""] && (
    <img
      src={teamLogoById[match.home_team_id || ""]}
      alt=""
      className="h-10 w-10 object-contain"
    />
  )}

  <span className="font-black">
    {teamNameById[match.home_team_id || ""] || "Local"}
  </span>

  <span className="text-emerald-700 font-bold">
    VS
  </span>

  {teamLogoById[match.away_team_id || ""] && (
    <img
      src={teamLogoById[match.away_team_id || ""]}
      alt=""
      className="h-10 w-10 object-contain"
    />
  )}

  <span className="font-black">
    {teamNameById[match.away_team_id || ""] || "Visitante"}
  </span>
</div>
      <p className="text-sm text-slate-500">
        {match.field || "Sin cancha"} ·{" "}
        {match.match_date
          ? new Date(match.match_date).toLocaleString("es-MX")
          : "Sin fecha"}
      </p>
    </div>
  ))}
</div>

<h3 className="mt-10 text-3xl font-black">Resultados</h3>
<p className="mb-6 text-sm text-slate-500">
  Marcadores finales registrados.
</p>

<div className="space-y-3">
  {finishedMatches.map((match) => (
    <div key={match.id} className="rounded-2xl border p-4">
      <p className="font-black">
        {teamNameById[match.home_team_id || ""] || "Local"}{" "}
        {match.home_score ?? 0} - {match.away_score ?? 0}{" "}
        {teamNameById[match.away_team_id || ""] || "Visitante"}
      </p>

      <p className="text-sm text-slate-500">
        {match.field || "Sin cancha"} ·{" "}
        {match.match_date
          ? new Date(match.match_date).toLocaleString("es-MX")
          : "Sin fecha"}
      </p>
    </div>
  ))}
</div>
</section>
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
