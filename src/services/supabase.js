import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
        travel_hours: entry.travelHours,
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


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
