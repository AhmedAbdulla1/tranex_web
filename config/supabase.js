// Supabase configuration
const SUPABASE_URL = 'https://cwkiimxabpcxxwwvkzdh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3a2lpbXhhYnBjeHh3d3ZremRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4Mzg5NjUsImV4cCI6MjA3MTQxNDk2NX0.gIp5PPVNDOVOOK_zn5XIo8NRocpf-VrEVH7-NOX4hQs';

// Initialize Supabase client
const initSupabase = () => {
  if (typeof window !== 'undefined') {
    return window.supabaseClient || createClient();
  }
  return null;
};

const createClient = () => {
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  if (typeof window !== 'undefined') {
    window.supabaseClient = client;
  }
  return client;
};

export { initSupabase };

// Auth helper functions
export const signUp = async (email, password, metadata = {}) => {
  const supabase = initSupabase();
  return await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata }
  });
};

export const signIn = async (email, password) => {
  const supabase = initSupabase();
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const signOut = async () => {
  const supabase = initSupabase();
  return await supabase.auth.signOut();
};

export const resetPassword = async (email) => {
  const supabase = initSupabase();
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};

export const updatePassword = async (newPassword) => {
  const supabase = initSupabase();
  return await supabase.auth.updateUser({
    password: newPassword
  });
};

export const getCurrentUser = async () => {
  const supabase = initSupabase();
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

export const getSession = async () => {
  const supabase = initSupabase();
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
};
