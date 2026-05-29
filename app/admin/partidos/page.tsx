"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import MatchCard from "../../../components/admin/MatchCard";


interface Tournament {
  id: string;
  name: string;
}
interface Match {
  id: string;
  tournament_id: string;
  home_team_id: string;
  away_team_id: string;

  home_team?: string;
  away_team?: string;

  home_score: number;
  away_score: number;

  field: string;
  match_date: string;
  status: string;
}

interface Team {
  id: string;
  name: string;
}

export default function PartidosPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
const [matches, setMatches] = useState<Match[]>([]);
  const [tournamentId, setTournamentId] = useState("");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const [field, setField] = useState("");
  const [matchDate, setMatchDate] = useState("");

  useEffect(() => {
  loadTournaments();
  loadTeams();
  loadMatches();
}, []);

  async function loadTournaments() {
    if (!supabase) return;
    const { data } = await supabase
      .from("tournaments")
      .select("*")
      .order("name");

    if (data) {
      setTournaments(data);
    }
  }

  async function loadTeams() {
    if (!supabase) return;
    const { data } = await supabase
      .from("teams")
      .select("*")
      .order("name");

    if (data) {
      setTeams(data);
    }
  }
async function loadMatches() {
  if (!supabase) return;

  const { data } = await supabase
    .from("matches")
    .select("*")
    .order("match_date");

  if (data) {
    setMatches(data);
  }
}
  async function saveMatch(e: React.FormEvent) {
    if (!supabase) return;
    e.preventDefault();

    const { error } = await supabase.from("matches").insert([
      {
        tournament_id: tournamentId,
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        home_score: homeScore,
        away_score: awayScore,
        field,
        match_date: matchDate,
        status: "Finalizado",
      },
    ]);
    if (error) {
      alert("Error al guardar partido");
      console.log(error);
      return;
    }

    alert("Partido guardado");

    setHomeScore(0);
    setAwayScore(0);
    setField("");
    setMatchDate("");
  }

  return (
    <div className="p-8">
      <Link
  href="/admin"
  className="mb-4 inline-block rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white"
>
  ← Volver al panel admin
</Link>
      <h1 className="text-3xl font-black mb-6">
        Administración de Partidos
      </h1>
      <form
        onSubmit={saveMatch}
        className="bg-white rounded-3xl p-6 shadow grid gap-4 max-w-2xl"
      >
        <select
          value={tournamentId}
          onChange={(e) => setTournamentId(e.target.value)}
          className="border rounded-xl p-3"
        >
          <option value="">Selecciona torneo</option>

          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name}
            </option>
          ))}
        </select>

        <select
          value={homeTeamId}
          onChange={(e) => setHomeTeamId(e.target.value)}
          className="border rounded-xl p-3"
        >
          <option value="">Equipo local</option>

          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <select
          value={awayTeamId}
          onChange={(e) => setAwayTeamId(e.target.value)}
          className="border rounded-xl p-3"
        >
          <option value="">Equipo visitante</option>

          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
          </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Goles local"
            value={homeScore}
            onChange={(e) => setHomeScore(Number(e.target.value))}
            className="border rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Goles visitante"
            value={awayScore}
            onChange={(e) => setAwayScore(Number(e.target.value))}
            className="border rounded-xl p-3"
          />
        </div>
        
        <input
          type="text"
          placeholder="Cancha"
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="border rounded-xl p-3"
        />

        <input
          type="datetime-local"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
          className="border rounded-xl p-3"
        />

        <button
          type="submit"
          className="bg-emerald-600 text-white rounded-xl p-3 font-bold"
        >
          Guardar Partido
        </button>
      </form>
      <div className="mt-8 grid gap-3 max-w-2xl">
  <h2 className="text-2xl font-black">Partidos guardados</h2>

  {matches.map((match) => (
<MatchCard
  key={match.id}
  match={{
    ...match,
    home_team:
      teams.find(
        (team) => team.id === match.home_team_id
      )?.name || "Equipo Local",

    away_team:
      teams.find(
        (team) => team.id === match.away_team_id
      )?.name || "Equipo Visitante",
  }}
/>
))}
  <div className="mt-3 flex gap-2">
  
</div>
</div>
    </div>
  );
}
