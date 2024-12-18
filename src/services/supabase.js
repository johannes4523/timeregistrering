import { createClient } from '@supabase/supabase-js';

console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = "https://plimkzmplcuofimmxegh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaW1rem1wbGN1b2ZpbW14ZWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NTU2MjcsImV4cCI6MjA1MDAzMTYyN30.002eV1GJU_FOooiS34Wu2ouDrkoAWZNySMRjL-sP2uQ";


if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("supabaseUrl and supabaseAnonKey are required.");
  }

// Time registration functions
export const timeRegistrationService = {
  async getAllEntries() {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async addEntry(entry) {
    const { data, error } = await supabase
      .from('time_entries')
      .insert([{
        date: entry.date,
        client: entry.client,
        project: entry.project,
        hours: entry.hours,
        travel_hours: entry.travel_hours,
        description: entry.description,
        consultant: entry.consultant,
        timestamp: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateEntry(id, entry) {
    const { data, error } = await supabase
      .from('time_entries')
      .update({
        date: entry.date,
        client: entry.client,
        project: entry.project,
        hours: entry.hours,
        travel_hours: entry.travelHours,
        description: entry.description,
        consultant: entry.consultant
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteEntry(id) {
    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
