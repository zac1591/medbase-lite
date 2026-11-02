/**
 * 🚀 PRO FEATURE: SUPABASE INTEGRATION
 * 
 * MedBase Lite uses simulated local data (mockData.ts) to demonstrate the UI.
 * 
 * In MedBase Pro, this file contains the actual Supabase SDK initialization,
 * securely connecting the React frontend to a live PostgreSQL database, 
 * handling Auth, and enforcing Row Level Security (RLS) policies.
 * 
 * Upgrade at: https://medbase.tech
 */

// Dummy export to prevent residual imports from breaking the Lite version build.
export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: null, error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
} as any;