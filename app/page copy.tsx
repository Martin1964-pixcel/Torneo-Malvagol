import Link from "next/link";
import { CalendarDays, Goal, Shield, Trophy, Users } from "lucide-react";
import { sampleMatches, sampleScorers, sampleStandings } from "../lib/sample-data";

const activeCategory = "Novatos Empresarial";

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
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
        </div>
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const standings =
    sampleStandings.find((item) => item.category === activeCategory)?.teams || [];

  const scorers = sampleScorers.filter(
    (item) => item.category === activeCategory
  );

  const matches = sampleMatches.filter(
    (item) => item.category === activeCategory
  );

  const goals = standings.reduce((total, team) => total + Number(team.gf || 0), 0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-500 p-3">
              <Trophy size={28} />
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
            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white"
          >
            Administrador del panel
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-slate-950 p-8 text-white shadow-sm">
          <p className="mb-3 font-bold">Liga activa</p>
          <h2 className="text-4xl font-black">Torneo Apertura Malvagol</h2>
          <p className="mt-4 max-w-xl">
            Consulta posiciones, resultados, próximos partidos, goleadores y
            estadísticas actualizadas del torneo.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-4">
          <StatCard icon={Users} label="Equipos registrados" value={standings.length} />
          <StatCard icon={Goal} label="Goles anotados" value={goals} />
          <StatCard icon={CalendarDays} label="Partidos" value={matches.length} />
          <StatCard icon={Shield} label="Categoría" value={activeCategory} />
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="text-xl font-black">Tabla general</h3>
            <p className="mb-5 text-sm text-slate-500">
              Ordenada por puntos, diferencia de goles y goles a favor.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
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
                    <tr key={team.name} className="border-b">
                      <td className="py-3 font-bold">{index + 1}</td>
                      <td className="font-bold">{team.name}</td>
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
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-black">Goleadores</h3>
            <div className="space-y-3">
              {scorers.map((item, index) => (
                <div
                  key={`${item.player}-${item.team}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
                >
                  <div>
                    <p className="font-bold">
                      {index + 1}. {item.player}
                    </p>
                    <p className="text-sm text-slate-500">{item.team}</p>
                  </div>
                  <p className="text-2xl font-black text-emerald-700">
                    {item.goals}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-7 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-xl font-black">Próximos partidos</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {matches.map((match) => (
              <div
                key={`${match.home}-${match.away}`}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-sm text-slate-500">
                  {match.date} · {match.time} · {match.field}
                </p>
                <p className="mt-2 text-lg font-black">{match.home}</p>
                <p className="text-sm font-bold text-slate-400">vs</p>
                <p className="text-lg font-black">{match.away}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}