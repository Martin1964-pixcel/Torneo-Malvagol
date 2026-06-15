'use server';
import { revalidatePath } from 'next/cache';
import { supabase } from '../../lib/supabase';
export async function createTournament(formData: FormData) {
  if (!supabase) return;
  await supabase.from('tournaments').insert({
    name: String(formData.get('name') || ''),
    category: String(formData.get('category') || 'Fútbol 7'),
    season: String(formData.get('season') || '2026'),
  });
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createTeam(formData: FormData) {
  if (!supabase) return;
  await supabase.from('teams').insert({
    tournament_id: String(formData.get('tournament_id') || ''),
    name: String(formData.get('name') || ''),
    coach: String(formData.get('coach') || ''),
  });
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createPlayer(formData: FormData) {
  if (!supabase) return;
  await supabase.from('players').insert({
    team_id: String(formData.get('team_id') || ''),
    full_name: String(formData.get('full_name') || ''),
    number: Number(formData.get('number') || 0),
    position: String(formData.get('position') || ''),
  });
  revalidatePath('/admin');
}

export async function createMatch(formData: FormData) {
  if (!supabase) return;

  const homeTeamId = String(formData.get('home_team_id') || '');
  const awayTeamId = String(formData.get('away_team_id') || '');

  const { data: homeTeamData } = await supabase
    .from('teams')
    .select('name')
    .eq('id', homeTeamId)
    .single();

  const { data: awayTeamData } = await supabase
    .from('teams')
    .select('name')
    .eq('id', awayTeamId)
    .single();

  await supabase.from('matches').insert({
    tournament_id: String(formData.get('tournament_id') || ''),

    home_team_id: homeTeamId,
    away_team_id: awayTeamId,

    home_team: homeTeamData?.name || '',
    away_team: awayTeamData?.name || '',

    match_date: String(formData.get('match_date') || ''),
    field: String(formData.get('field') || 'Cancha 1'),
    round: Number(formData.get('round') || 1),
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateTeam(formData: FormData) {
  if (!supabase) return;

  await supabase
    .from('teams')
    .update({
      name: String(formData.get('name') || ''),
      coach: String(formData.get('coach') || ''),
    })
    .eq('id', String(formData.get('team_id') || ''));

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/tabla');
}
export async function createGoal(formData: FormData) {
  if (!supabase) return;

  const playerId = String(formData.get('player_id') || '');

  const { data: playerData } = await supabase
    .from('players')
    .select('team_id')
    .eq('id', playerId)
    .single();

  const goals = Number(formData.get('goals') || 1);

  const goalsToInsert = Array.from(
    { length: goals },
    () => ({
      match_id: String(formData.get('match_id') || ''),
      player_id: playerId,
      team_id: playerData?.team_id || null,
      minute: Number(formData.get('minute') || 0),
    })
  );

  await supabase
    .from('goals')
    .insert(goalsToInsert);

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/goleadores');
}
export async function updateMatchData(formData: FormData) {
  if (!supabase) return;

  await supabase
    .from("matches")
    .update({
      home_score: Number(formData.get("home_score") || 0),
      away_score: Number(formData.get("away_score") || 0),
      field: String(formData.get("field") || ""),
      round: Number(formData.get("round") || 1),
      match_date: String(formData.get("match_date") || ""),
    })
    .eq("id", String(formData.get("match_id") || ""));

  revalidatePath("/admin/partidos");
  revalidatePath("/tabla");
  revalidatePath("/");
}

export async function deleteMatch(formData: FormData) {
  if (!supabase) return;

  await supabase
    .from("matches")
    .delete()
    .eq("id", String(formData.get("match_id") || ""));

  revalidatePath("/admin/partidos");
  revalidatePath("/admin");
  revalidatePath("/tabla");
  revalidatePath("/");
}

export async function deleteGoal(formData: FormData) {
  if (!supabase) return;

  await supabase
    .from("goals")
    .delete()
    .eq("id", String(formData.get("goal_id") || ""));

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/goleadores");
}
export async function removeGoal(formData: FormData) {
  if (!supabase) return;

  const playerId = String(formData.get("player_id") || "");
  const matchId = String(formData.get("match_id") || "");

  const { data: goal } = await supabase
    .from("goals")
    .select("id")
    .eq("player_id", playerId)
    .eq("match_id", matchId)
    .limit(1)
    .single();

  if (!goal) return;

  await supabase
    .from("goals")
    .delete()
    .eq("id", goal.id);

  revalidatePath("/goleadores");
}
export async function updatePlayerData(formData: FormData) {
  if (!supabase) return;

  await supabase
    .from("players")
    .update({
      full_name: String(formData.get("full_name") || ""),
      number: Number(formData.get("number") || 0),
      position: String(formData.get("position") || ""),
    })
    .eq("id", String(formData.get("player_id") || ""));

  revalidatePath("/admin/jugadores");
  revalidatePath("/goleadores");
}
export async function addGoal(formData: FormData) {
  if (!supabase) return;

  const playerId = String(formData.get("player_id") || "");
  const matchId = String(formData.get("match_id") || "");

  const { data: player } = await supabase
    .from("players")
    .select("team_id")
    .eq("id", playerId)
    .single();

  await supabase
    .from("goals")
    .insert({
      match_id: matchId,
      player_id: playerId,
      team_id: player?.team_id || null,
      minute: 0,
    });

  revalidatePath("/goleadores");
}

export async function deletePlayer(formData: FormData) {
  if (!supabase) return;

  await supabase
    .from("players")
    .delete()
    .eq("id", String(formData.get("player_id") || ""));

  revalidatePath("/admin/jugadores");
  revalidatePath("/goleadores");
}