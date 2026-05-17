import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { createMatch, createPlayer, createTeam, createTournament, updateMatchScore } from './actions';

type Tournament = { id: string; name: string };
type Team = { id: string; name: string };
type Match = { id: string; home_team: string; away_team: string; match_date: string; field: string; home_goals: number | null; away_goals: number | null };

async function getAdminData() {
  if (!supabase) return { tournaments: [], teams: [], matches: [] };
  const [tournaments, teams, matches] = await Promise.all([
    supabase.from('tournaments').select('id, name').order('created_at', { ascending: false }),
    supabase.from('teams').select('id, name').order('name'),
    supabase.from('matches_public_view').select('*').order('match_date'),
  ]);
  return {
    tournaments: (tournaments.data || []) as Tournament[],
    teams: (teams.data || []) as Team[],
    matches: (matches.data || []) as Match[],
  };
}

function Input({ name, placeholder, type = 'text' }: { name: string; placeholder: string; type?: string }) {
  return <input name={name} type={type} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400" />;
}

function Select({ name, children }: { name: string; children: React.ReactNode }) {
  return <select name={name} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400">{children}</select>;
}

export default async function AdminPage() {
  const { tournaments, teams, matches } = await getAdminData();
  const firstTournament = tournaments[0]?.id || '';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500"><Trophy size={25} /></div>
            <div>
              <h1 className="text-xl font-black">Panel admin · Torneos Malvagol</h1>
              <p className="text-sm text-slate-300">Captura torneos, equipos, jugadores y resultados</p>
            </div>
          </div>
          <Link href="/" className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20">Ver pública</Link>
        </div>
      </header>

      {!supabase && (
        <div className="mx-auto mt-6 max-w-7xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          Falta conectar Supabase. Copia `.env.example` como `.env.local` y agrega tus llaves.
        </div>
      )}

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-7 lg:grid-cols-2">
        <form action={createTournament} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Crear torneo</h2>
          <div className="grid gap-3">
            <Input name="name" placeholder="Nombre del torneo" />
            <Input name="category" placeholder="Categoría: Fútbol 7, Infantil, Libre..." />
            <Input name="season" placeholder="Temporada: 2026" />
            <button className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700">Guardar torneo</button>
          </div>
        </form>

        <form action={createTeam} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Registrar equipo</h2>
          <div className="grid gap-3">
            <Select name="tournament_id"><option value={firstTournament}>Torneo principal</option>{tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
            <Input name="name" placeholder="Nombre del equipo" />
            <Input name="coach" placeholder="Entrenador o delegado" />
            <button className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700">Guardar equipo</button>
          </div>
        </form>

        <form action={createPlayer} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Agregar jugador</h2>
          <div className="grid gap-3">
            <Select name="team_id">{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
            <Input name="full_name" placeholder="Nombre completo" />
            <Input name="number" placeholder="Número" type="number" />
            <Input name="position" placeholder="Posición" />
            <button className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700">Guardar jugador</button>
          </div>
        </form>

        <form action={createMatch} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Crear partido</h2>
          <div className="grid gap-3">
            <Select name="tournament_id"><option value={firstTournament}>Torneo principal</option>{tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
            <Select name="home_team_id">{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
            <Select name="away_team_id">{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
            <Input name="match_date" placeholder="Fecha" type="datetime-local" />
            <Input name="field" placeholder="Cancha" />
            <button className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700">Guardar partido</button>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Capturar marcadores</h2>
          <div className="grid gap-3">
            {matches.map(match => (
              <form key={match.id} action={updateMatchScore} className="grid items-center gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-5">
                <input type="hidden" name="match_id" value={match.id} />
                <div className="md:col-span-2">
                  <p className="font-bold">{match.home_team} vs {match.away_team}</p>
                  <p className="text-sm text-slate-500">{new Date(match.match_date).toLocaleString('es-MX')} · {match.field}</p>
                </div>
                <Input name="home_goals" placeholder="Local" type="number" />
                <Input name="away_goals" placeholder="Visitante" type="number" />
                <button className="rounded-xl bg-slate-950 px-4 py-2 font-bold text-white hover:bg-slate-800">Finalizar</button>
              </form>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
