import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';

import {
  createGoal,
  createMatch,
  createPlayer,
  createTeam,
  createTournament,
updateMatchData,
} from './actions';

type Tournament = { id: string; name: string };

type Team = {
  id: string;
  name?: string;
};

type Match = {
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
};

type Player = {
  id: string;
  full_name?: string;
  team_id?: string;
};

async function getAdminData() {
  if (!supabase) {
    return {
      tournaments: [],
      teams: [],
      matches: [],
      players: [],
    };
  }

  const [tournaments, teams, matches, players] = await Promise.all([
    supabase.from('tournaments').select('id, name').order('created_at', { ascending: false }),
    supabase.from('teams').select('id, name').order('name'),
    supabase.from('matches').select('*').order('match_date'),
    supabase.from('players').select('id, full_name, team_id').order('full_name'),
  ]);

  return {
    tournaments: (tournaments.data || []) as Tournament[],
    teams: (teams.data || []) as Team[],
    matches: (matches.data || []) as Match[],
    players: (players.data || []) as Player[],
  };
}

function Input({
  name,
  placeholder,
  type = 'text',
}: {
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
    />
  );
}

function Select({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
    >
      {children}
    </select>
  );
}

export default async function AdminPage() {
  const { tournaments, teams, matches, players } = await getAdminData();
  const firstTournament = tournaments[0]?.id || '';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500">
              <Trophy size={25} />
            </div>
            <div>
              <h1 className="text-xl font-black">Panel admin · Torneos Malvagol</h1>
              <div className="mt-4 flex flex-wrap gap-3">
  <Link
    href="/admin/partidos"
    className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white"
  >
    Administrar partidos
  </Link>

  <Link
    href="/admin/jugadores"
    className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-white"
  >
    Administrar jugadores
  </Link>

  <Link
    href="/admin/torneos"
    className="rounded-xl bg-sky-600 px-5 py-3 font-bold text-white"
  >
    Administrar torneos
  </Link>

  <Link
    href="/admin/equipos"
    className="rounded-xl bg-fuchsia-600 px-5 py-3 font-bold text-white"
  >
    Administrar equipos
  </Link>
</div>


              <p className="mt-2 text-sm text-slate-300">
                Captura torneos, equipos, jugadores y resultados
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20"
          >
            Ver pública
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-7 lg:grid-cols-2">
        <form action={createTournament} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Crear torneo</h2>
          <div className="grid gap-3">
            <Input name="name" placeholder="Nombre del torneo" />
            <Input name="category" placeholder="Categoría: Fútbol 7, Infantil..." />
            <Input name="season" placeholder="Temporada: 2026" />
            <button className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700">
              Guardar torneo
            </button>
          </div>
        </form>

        <form action={createTeam} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Registrar equipo</h2>
          <div className="grid gap-3">
            <Select name="tournament_id">
              <option value={firstTournament}>Torneo principal</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
            <Input name="name" placeholder="Nombre del equipo" />
            <Input name="coach" placeholder="Entrenador o delegado" />
            <button className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700">
              Guardar equipo
            </button>
          </div>
        </form>

        <form action={createPlayer} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Agregar jugador</h2>
          <div className="grid gap-3">
            <Select name="team_id">
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
            <Input name="full_name" placeholder="Nombre completo" />
            <Input name="number" placeholder="Número" type="number" />
            <Input name="position" placeholder="Posición" />
            <button className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700">
              Guardar jugador
            </button>
          </div>
        </form>

        <form action={createMatch} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Crear partido</h2>
          <div className="grid gap-3">
            <Select name="tournament_id">
              <option value={firstTournament}>Torneo principal</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>

            <Select name="home_team_id">
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>

            <Select name="away_team_id">
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>

            <Input name="match_date" placeholder="Fecha" type="datetime-local" />
            <Input name="field" placeholder="Cancha" />
            <Input
  name="round"
  placeholder="Jornada"
/>

            <button className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700">
              Guardar partido
            </button>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Capturar marcadores</h2>

          <div className="grid gap-3">
            {matches.map((match) => (
              <div key={match.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-4">
                  <p className="font-black">
                    {match.home_team || 'Local'} vs {match.away_team || 'Visitante'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {match.field || 'Sin cancha'} ·{' '}
                    {match.match_date
                      ? new Date(match.match_date).toLocaleString('es-MX')
                      : 'Sin fecha'}
                  </p>
                </div>

                <form action={updateMatchData} className="grid gap-3 md:grid-cols-3">
                  <input type="hidden" name="match_id" value={match.id} />

                  <input
                    name="home_goals"
                    type="number"
                    placeholder="Local"
                    className="rounded-xl border border-slate-200 px-3 py-2"
                  />

                  <input
                    name="away_goals"
                    type="number"
                    placeholder="Visitante"
                    className="rounded-xl border border-slate-200 px-3 py-2"
                  />

                  <button className="rounded-xl bg-slate-950 px-4 py-2 font-bold text-white hover:bg-slate-800">
                    Finalizar
                  </button>
                </form>

                <form action={createGoal} className="mt-4 grid gap-3 md:grid-cols-3">
                  <input type="hidden" name="match_id" value={match.id} />

                  <select
                    name="player_id"
                    className="rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <option value="">Jugador</option>

                    {players
                      .filter(
                        (player) =>
                          String(player.team_id) === String(match.home_team_id) ||
                          String(player.team_id) === String(match.away_team_id)
                      )
                      .map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.full_name || 'Sin nombre'}
                        </option>
                      ))}
                  </select>

                  <input
                    name="minute"
                    type="number"
                    placeholder="Minuto"
                    className="rounded-xl border border-slate-200 px-3 py-2"
                  />

                  <button className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700">
                    Registrar gol
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}