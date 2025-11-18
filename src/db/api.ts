import { supabase } from './supabase';
import type { Profile, GameProgress, LeaderboardEntry } from '@/types/types';

// Get current user profile
export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

// Get user's game progress
export async function getGameProgress(userId: string): Promise<GameProgress | null> {
  const { data, error } = await supabase
    .from('game_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching game progress:', error);
    return null;
  }

  return data;
}

// Update game progress
export async function updateGameProgress(
  userId: string,
  level: number,
  score: number
): Promise<boolean> {
  const { error } = await supabase.rpc('update_game_progress', {
    p_user_id: userId,
    p_level: level,
    p_score: score,
  });

  if (error) {
    console.error('Error updating game progress:', error);
    return false;
  }

  return true;
}

// Get leaderboard
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('highest_level', { ascending: false })
    .order('total_score', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

// Get all profiles (for admin)
export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

// Update profile username
export async function updateUsername(userId: string, username: string): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', userId);

  if (error) {
    console.error('Error updating username:', error);
    return false;
  }

  return true;
}
