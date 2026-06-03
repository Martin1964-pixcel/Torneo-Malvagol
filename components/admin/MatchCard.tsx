"use client";

import { useState } from "react";
import { updateMatchData, deleteMatch } from "../../app/admin/actions";

interface MatchCardProps {
  match: {
    id: string;
    home_team?: string;
    away_team?: string;
    home_score: number;
    away_score: number;
    field: string;
    match_date: string;
    round?: number;
    status?: string;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const isFinished =
    (match.home_score || 0) > 0 || (match.away_score || 0) > 0;

  const status = isFinished ? "Finalizado" : "Programado";

  const statusClass =
    status === "Finalizado"
      ? "bg-emerald-600 text-white"
      : "bg-amber-400 text-slate-950";

  const formattedDate = match.match_date
    ? new Date(match.match_date).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Sin fecha";

  const formattedTime = match.match_date
    ? new Date(match.match_date).toLocaleTimeString("es-MX", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl">
      <div className="flex flex-wrap items-center gap-2 text-lg font-black">
        <span>{match.home_team || "Equipo Local"}</span>

        <span className="rounded-xl bg-emerald-100 px-3 py-1 text-emerald-700">
          {match.home_score} - {match.away_score}
        </span>

        <span>{match.away_team || "Equipo Visitante"}</span>
      </div>

      <span
        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-black uppercase ${statusClass}`}
      >
        {status}
      </span>

      <p className="mt-2 text-sm text-slate-500">
        {match.field || "Sin cancha"} · {formattedDate}
        {formattedTime ? ` · ${formattedTime}` : ""}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        Jornada {match.round || 1}
      </p>

      {isEditing && (
        <form
          action={updateMatchData}
          className="mt-3 grid gap-3 rounded-xl bg-amber-50 p-3"
        >
          <input type="hidden" name="match_id" value={match.id} />

          <input
            type="number"
            name="home_score"
            defaultValue={match.home_score}
            className="rounded-xl border p-2"
            placeholder="Goles local"
          />

          <input
            type="number"
            name="away_score"
            defaultValue={match.away_score}
            className="rounded-xl border p-2"
            placeholder="Goles visitante"
          />

          <input
            type="text"
            name="field"
            defaultValue={match.field}
            className="rounded-xl border p-2"
            placeholder="Cancha"
          />

          <input
            type="number"
            name="round"
            defaultValue={match.round || 1}
            className="rounded-xl border p-2"
            placeholder="Jornada"
          />

          <input
            type="datetime-local"
            name="match_date"
            defaultValue={
              match.match_date
                ? new Date(match.match_date).toISOString().slice(0, 16)
                : ""
            }
            className="rounded-xl border p-2"
          />

          <button
            type="submit"
            className="rounded-xl bg-emerald-600 p-2 font-bold text-white"
          >
            Guardar cambios
          </button>
        </form>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white"
        >
          {isEditing ? "Cancelar" : "Editar"}
        </button>

        <form action={deleteMatch}>
          <input type="hidden" name="match_id" value={match.id} />

          <button
            type="submit"
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
          >
            Eliminar
          </button>
        </form>
      </div>
    </div>
  );
}