import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const configuredAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const supabaseConfigured = Boolean(url && anonKey);
export const adminEmails = configuredAdminEmails;
export const supabase = supabaseConfigured ? createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;

export const isTrustedAdminSession = (session) => {
  if (!session?.user) return false;
  if (session.user.app_metadata?.role === 'admin') return true;
  const email = session.user.email?.toLowerCase();
  return Boolean(email && adminEmails.includes(email));
};
