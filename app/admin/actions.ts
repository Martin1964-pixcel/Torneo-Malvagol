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
  await supabase.from('matches').insert({
    tournament_id: String(formData.get('tournament_id') || ''),
    home_team_id: String(formData.get('home_team_id') || ''),
    away_team_id: String(formData.get('away_team_id') || ''),
    match_date: String(formData.get('match_date') || ''),
    field: String(formData.get('field') || 'Cancha 1'),
  });
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateMatchScore(formData: FormData) {
  if (!supabase) return;
  await supabase.from('matches').update({
    home_goals: Number(formData.get('home_goals') || 0),
    away_goals: Number(formData.get('away_goals') || 0),
    status: 'finalizado',
  }).eq('id', String(formData.get('match_id') || ''));
  revalidatePath('/admin');
  revalidatePath('/');
}
