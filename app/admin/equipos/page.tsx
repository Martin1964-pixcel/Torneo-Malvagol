"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Team = {
  id: string;
  name?: string;
  tournament_id?: string;
  logo_url?: string | null;
};

type Tournament = {
  id: string;
  name: string;
  category?: string;
};

export default function EquiposPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTournament, setActiveTournament] = useState<string>("");
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [uploadingTeam, setUploadingTeam] = useState<string | null>(null);

  useEffect(() => {
    loadTournaments();
  }, []);

  async function loadTournaments() {
    if (!supabase) return;

    const { data } = await supabase
      .from("tournaments")
      .select("*")
      .order("name");

    if (data && data.length > 0) {
      setTournaments(data);
      setActiveTournament(data[0].id);
      await loadTeams(data[0].id);
    }
  }

  async function loadTeams(tournamentId: string) {
    if (!supabase) return;

    const { data } = await supabase
      .from("teams")
      .select("*")
      .eq("tournament_id", tournamentId)
      .order("name");

    setTeams(data || []);
  }

  async function updateTeam(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!supabase) return;

    const formData = new FormData(e.currentTarget);

    await supabase
      .from("teams")
      .update({
        name: String(formData.get("name") || ""),
      })
      .eq("id", String(formData.get("team_id") || ""));

    setEditingTeam(null);
    await loadTeams(activeTournament);
  }

  async function uploadLogo(teamId: string, file: File | null) {
    if (!supabase || !file) return;

    setUploadingTeam(teamId);

    const fileExtension = file.name.split(".").pop();
    const filePath = `${teamId}-${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("team-logos")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      alert("No se pudo subir el logo.");
      console.error(uploadError);
      setUploadingTeam(null);
      return;
    }

    const { data } = supabase.storage
      .from("team-logos")
      .getPublicUrl(filePath);

    const logoUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("teams")
      .update({
        logo_url: logoUrl,
      })
      .eq("id", teamId);

    if (updateError) {
      alert("El logo subió, pero no se pudo guardar en el equipo.");
      console.error(updateError);
      setUploadingTeam(null);
      return;
    }

    await loadTeams(activeTournament);
    setUploadingTeam(null);
  }

  async function deleteTeam(teamId: string) {
    if (!supabase) return;

    await supabase.from("teams").delete().eq("id", teamId);

    await loadTeams(activeTournament);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
        >
          ← Volver al panel admin
        </Link>

        <h1 className="mb-6 text-3xl font-black md:text-5xl">
          Administración de Equipos
        </h1>

        <div className="mb-6 flex flex-wrap gap-3">
          {tournaments.map((tournament) => (
            <button
              key={tournament.id}
              onClick={() => {
                setActiveTournament(tournament.id);
                loadTeams(tournament.id);
              }}
              className={`rounded-xl px-4 py-2 font-bold ${
                activeTournament === tournament.id
                  ? "bg-emerald-600 text-white"
                  : "bg-white"
              }`}
            >
              {tournament.name}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {teams.map((team) => (
            <div key={team.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border bg-slate-100">
                    {team.logo_url ? (
  <img
    src={team.logo_url}
    alt={team.name || "Logo del equipo"}
    className="h-full w-full object-cover"
  />
) : (
                      <span className="text-xs font-bold text-slate-400">
                        Sin logo
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-2xl font-black">
                      {team.name || "Sin nombre"}
                    </p>

                    {uploadingTeam === team.id && (
                      <p className="mt-1 text-sm font-bold text-emerald-700">
                        Subiendo logo...
                      </p>
                    )}
                  </div>
                </div>

                <label className="cursor-pointer rounded-xl bg-sky-600 px-4 py-2 text-center font-bold text-white">
                  Subir logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      uploadLogo(team.id, e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>

              {editingTeam === team.id && (
                <form onSubmit={updateTeam} className="mt-4 grid gap-3">
                  <input type="hidden" name="team_id" value={team.id} />

                  <input
                    type="text"
                    name="name"
                    defaultValue={team.name}
                    className="rounded-xl border p-3"
                    placeholder="Nombre del equipo"
                  />

                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 p-3 font-bold text-white"
                  >
                    Guardar cambios
                  </button>
                </form>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    setEditingTeam(editingTeam === team.id ? null : team.id)
                  }
                  className="rounded-xl bg-amber-500 px-4 py-2 font-bold text-white"
                >
                  {editingTeam === team.id ? "Cancelar" : "Editar"}
                </button>

                <button
                  onClick={() => deleteTeam(team.id)}
                  className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}