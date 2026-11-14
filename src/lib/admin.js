import { supabase } from './supabase.js';

const TRACK_FIELDS = 'id,title,artist_name,genre,album,cover_url,audio_path,status,created_at';
const AUDIO_BUCKET = 'junubify-audio';

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

function mapReviewTrack(track) {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist_name,
    genre: track.genre,
    album: track.album,
    cover: track.cover_url || null,
    audioPath: track.audio_path,
    status: track.status,
    createdAt: track.created_at,
  };
}

export async function fetchPendingReviewTracks() {
  const { data, error } = await requireSupabase()
    .from('tracks')
    .select(TRACK_FIELDS)
    .eq('status', 'pending_review')
    .order('created_at', { ascending: true })
    .limit(100);
  if (error) throw error;
  return data.map(mapReviewTrack);
}

export async function createReviewAudioUrl(audioPath) {
  const { data, error } = await requireSupabase()
    .storage.from(AUDIO_BUCKET)
    .createSignedUrl(audioPath, 5 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function reviewTrack(trackId, status) {
  if (!['published', 'rejected'].includes(status)) throw new Error('Invalid review decision.');
  const { data, error } = await requireSupabase()
    .from('tracks')
    .update({ status })
    .eq('id', trackId)
    .eq('status', 'pending_review')
    .select('id')
    .single();
  if (error) throw error;
  return data;
}
