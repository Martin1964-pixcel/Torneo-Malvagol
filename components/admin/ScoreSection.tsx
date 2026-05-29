import GoalForm from "./GoalForm";

type Match = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_team?: string;
  away_team?: string;
  field: string;
  match_date: string;
};

type Player = {
  id: string;
  full_name?: string;
  name?: string;
  team_id?: string;
};

type Props = {
  matches: Match[];
  players: Player[];
  createGoal: (formData: FormData) => void;
  updateMatchScore: (formData: FormData) => void;
};

export default function ScoreSection({
  matches,
  players,
  createGoal,
  updateMatchScore,
}: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10">
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-black">Capturar marcadores</h2>

        <div className="grid gap-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="grid items-center gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-5"
            >
              <form action={updateMatchScore} className="contents">
                <input type="hidden" name="match_id" value={match.id} />

                <div className="md:col-span-2">
                  <p className="font-bold">
                    {match.home_team || "Local"} vs {match.away_team || "Visitante"}
                  </p>

                  <p className="text-sm text-slate-500">
                    {new Date(match.match_date).toLocaleString("es-MX")} · {match.field}
                  </p>
                </div>

                <input
                  name="home_goals"
                  placeholder="Local"
                  type="number"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />

                <input
                  name="away_goals"
                  placeholder="Visitante"
                  type="number"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />

                <button className="rounded-xl bg-slate-950 px-4 py-2 font-bold text-white hover:bg-slate-800">
                  Finalizar
                </button>
              </form>

              <form action={createGoal} className="md:col-span-5">
                <GoalForm players={players} match={match} />
              </form>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}