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
  tournament_id?: string;
}

export default function PartidosPage() {
  
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const [tournamentId, setTournamentId] = useState("");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [field, setField] = useState("");
  const [matchDate, setMatchDate] = useState("");
const [editingMatchId, setEditingMatchId] = useState("");
  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    if (!supabase) return;

    const { data: tournamentsData } = await supabase
      .from("tournaments")
      .select("*")
      .order("name");

    const { data: teamsData } = await supabase
      .from("teams")
      .select("*")
      .order("name");

    setTournaments(tournamentsData || []);
    setTeams(teamsData || []);

    if (tournamentsData && tournamentsData.length > 0) {
      const firstTournamentId = tournamentsData[0].id;

      setTournamentId(firstTournamentId);
      setFilteredTeams(
        (teamsData || []).filter(
          (team) => team.tournament_id === firstTournamentId
        )
      );

      await loadMatches(firstTournamentId);
    }
  }

  async function loadMatches(selectedTournamentId: string) {
    if (!supabase) return;

    const { data } = await supabase
      .from("matches")
      .select("*")
      .eq("tournament_id", selectedTournamentId)
      .order("match_date");

    setMatches(data || []);
  }
function changeTournament(selectedTournamentId: string) {
  setTournamentId(selectedTournamentId);
  setHomeTeamId("");
  setAwayTeamId("");

  const filtered = teams.filter(
    (team) => team.tournament_id === selectedTournamentId
  );

  console.log("TORNEO:", selectedTournamentId);
  console.log("FILTRADOS:", filtered);

  setFilteredTeams(filtered);

    loadMatches(selectedTournamentId);
  }

  async function saveMatch(e: React.FormEvent) {
  e.preventDefault();

  if (!supabase) return;

  if (!tournamentId || !homeTeamId || !awayTeamId || !matchDate) {
    alert("Selecciona torneo, equipos y fecha del partido");
    return;
  }

  if (homeTeamId === awayTeamId) {
    alert("El equipo local y visitante no pueden ser el mismo");
    return;
  }

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
  console.error(error);
  alert("Error al guardar partido");
  return;
}

await loadMatches(tournamentId);

setHomeTeamId("");
setAwayTeamId("");
setHomeScore(0);
setAwayScore(0);
setField("");
setMatchDate("");
}
async function updateMatch(e: React.FormEvent) {
  e.preventDefault();

  if (!supabase) return;

  if (!editingMatchId) return;

  const { error } = await supabase
    .from("matches")
    .update({
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      home_score: homeScore,
      away_score: awayScore,
      field,
      match_date: matchDate,
    })
    .eq("id", editingMatchId);

  if (error) {
    console.error(error);
    alert("Error al actualizar partido");
    return;
  }
  await loadMatches(tournamentId);

setEditingMatchId("");

  alert("Partido actualizado");


  setEditingMatchId("");
  setHomeTeamId("");
  setAwayTeamId("");
  setHomeScore(0);
  setAwayScore(0);
  setField("");
  setMatchDate("");
}
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-4 inline-block rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white"
        >
          ← Volver al panel admin
        </Link>

        <h1 className="mb-6 text-3xl font-black md:text-5xl">
          Administración de Partidos
        </h1>

        <form
  onSubmit={
    editingMatchId
      ? updateMatch
      : saveMatch
  }
        >
          <select
            value={tournamentId}
            onChange={(e) => changeTournament(e.target.value)}
            className="rounded-xl border p-3"
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
            className="rounded-xl border p-3"
          >
            <option value="">Equipo local</option>

            {filteredTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            value={awayTeamId}
            onChange={(e) => setAwayTeamId(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option value="">Equipo visitante</option>

            {filteredTeams.map((team) => (
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
              className="rounded-xl border p-3"
            />

            <input
              type="number"
              placeholder="Goles visitante"
              value={awayScore}
              onChange={(e) => setAwayScore(Number(e.target.value))}
              className="rounded-xl border p-3"
            />
          </div>

          <input
            type="text"
            placeholder="Cancha"
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="rounded-xl border p-3"
          />

          <input
            type="datetime-local"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
            className="rounded-xl border p-3"
          />

          <button
  type="submit"
  className="rounded-xl bg-emerald-600 p-3 font-bold text-white"
>
  {editingMatchId
    ? "Actualizar Partido"
    : "Guardar Partido"}
</button>
        </form>

        <div className="mt-8 grid max-w-2xl gap-3">
  <h2 className="text-2xl font-black">Partidos guardados</h2>

  {matches.length === 0 && (
    <div className="rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
      No hay partidos registrados en esta categoría.
    </div>
  )}

  {matches.map((match) => (
    <MatchCard
      key={match.id}
      match={{
        ...match,
        home_team:
          teams.find((team) => team.id === match.home_team_id)?.name ||
          "Equipo Local",
        away_team:
          teams.find((team) => team.id === match.away_team_id)?.name ||
          "Equipo Visitante",
      }}
    />
  ))}
</div>
      </div>
    </div>
  );
}