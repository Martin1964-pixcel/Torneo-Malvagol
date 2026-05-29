"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";


interface Player {
  id: string;
  full_name: string;
  number: number;
  position: string;
}

export default function JugadoresPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    if (!supabase) return;

    const { data } = await supabase
      .from("players")
      .select("*")
      .order("full_name");

    if (data) {
      setPlayers(data);
    }
  }

  async function updatePlayer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;

    const formData = new FormData(e.currentTarget);

    const playerId = String(formData.get("player_id") || "");
    const fullName = String(formData.get("full_name") || "");
    const number = Number(formData.get("number") || 0);
    const position = String(formData.get("position") || "");

    await supabase
      .from("players")
      .update({
        full_name: fullName,
        number,
        position,
      })
      .eq("id", playerId);

    setEditingPlayer(null);
    await loadPlayers();
  }

  async function deletePlayer(playerId: string) {
    if (!supabase) return;

    await supabase
      .from("players")
      .delete()
      .eq("id", playerId);

    await loadPlayers();
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-black">
        <Link
  href="/admin"
  className="mb-4 inline-block rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white"
>
  ← Volver al panel admin
</Link>
        Administración de Jugadores
      </h1>

      <div className="grid gap-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="rounded-2xl border bg-white p-4 shadow-sm"
          >
            <p className="text-lg font-black">
              {player.full_name || "Sin nombre"}
            </p>

            <p className="text-sm text-slate-600">
              Número: {player.number}
            </p>

            <p className="text-sm text-slate-600">
              Posición: {player.position || "Sin posición"}
            </p>

            {editingPlayer === player.id && (
              <form
                onSubmit={updatePlayer}
                className="mt-3 grid gap-3 rounded-xl bg-amber-50 p-3"
              >
                <input type="hidden" name="player_id" value={player.id} />

                <input
                  type="text"
                  name="full_name"
                  defaultValue={player.full_name}
                  className="rounded-xl border p-2"
                  placeholder="Nombre"
                />

                <input
                  type="number"
                  name="number"
                  defaultValue={player.number}
                  className="rounded-xl border p-2"
                  placeholder="Número"
                />

                <input
                  type="text"
                  name="position"
                  defaultValue={player.position}
                  className="rounded-xl border p-2"
                  placeholder="Posición"
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
                  setEditingPlayer(
                    editingPlayer === player.id ? null : player.id
                  )
                }
                className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white"
              >
                {editingPlayer === player.id ? "Cancelar" : "Editar"}
              </button>

              <button
                onClick={() => deletePlayer(player.id)}
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