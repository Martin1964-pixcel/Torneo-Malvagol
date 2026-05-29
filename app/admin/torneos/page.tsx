"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

interface Tournament {
  id: string;
  name: string;
  category: string;
  season: string;
}

export default function TorneosPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [editingTournament, setEditingTournament] = useState<string | null>(null);

  useEffect(() => {
    loadTournaments();
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

  async function updateTournament(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;

    const formData = new FormData(e.currentTarget);

    await supabase
      .from("tournaments")
      .update({
        name: String(formData.get("name") || ""),
        category: String(formData.get("category") || ""),
        season: String(formData.get("season") || ""),
      })
      .eq("id", String(formData.get("tournament_id") || ""));

    setEditingTournament(null);
    await loadTournaments();
  }

  async function deleteTournament(tournamentId: string) {
    if (!supabase) return;

    await supabase
      .from("tournaments")
      .delete()
      .eq("id", tournamentId);

    await loadTournaments();
  }

  return (
    <div className="p-8">
      <Link
        href="/admin"
        className="mb-4 inline-block rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white"
      >
        ← Volver al panel admin
      </Link>

      <h1 className="mb-6 text-3xl font-black">
        Administración de Torneos y Categorías
      </h1>

      <div className="grid gap-4">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="rounded-2xl border bg-white p-4 shadow-sm"
          >
            <p className="text-lg font-black">
              {tournament.name || "Sin nombre"}
            </p>

            <p className="text-sm text-slate-600">
              Categoría: {tournament.category || "Sin categoría"}
            </p>

            <p className="text-sm text-slate-600">
              Temporada: {tournament.season || "Sin temporada"}
            </p>

            {editingTournament === tournament.id && (
              <form
                onSubmit={updateTournament}
                className="mt-3 grid gap-3 rounded-xl bg-amber-50 p-3"
              >
                <input type="hidden" name="tournament_id" value={tournament.id} />

                <input
                  type="text"
                  name="name"
                  defaultValue={tournament.name}
                  className="rounded-xl border p-2"
                  placeholder="Nombre del torneo"
                />

                <input
                  type="text"
                  name="category"
                  defaultValue={tournament.category}
                  className="rounded-xl border p-2"
                  placeholder="Categoría"
                />

                <input
                  type="text"
                  name="season"
                  defaultValue={tournament.season}
                  className="rounded-xl border p-2"
                  placeholder="Temporada"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 p-2 font-bold text-white"
                >
                  Guardar cambios
                </button>
              </form>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() =>
                  setEditingTournament(
                    editingTournament === tournament.id ? null : tournament.id
                  )
                }
                className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white"
              >
                {editingTournament === tournament.id ? "Cancelar" : "Editar"}
              </button>

              <button
                onClick={() => deleteTournament(tournament.id)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}