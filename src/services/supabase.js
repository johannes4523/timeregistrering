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
            .order('date', { ascending: false });
        
        if (error) throw error;
        
        console.log("Hentede data fra Supabase:", data); // Sjekk ID-er og felt
        
        // Mapper travel_hours til travelHours for frontend
        return data.map(entry => ({
            ...entry,
            id: entry.id, // Sørg for at ID-en beholdes
            travelHours: entry.travel_hours
        }));
        },
    

  async addEntry(entry) {
    const { data, error } = await supabase
      .from('time_entries')
      .insert([{
        date: entry.date,
        client: entry.client,
        project: entry.project,
        hours: entry.hours,
        travel_hours: entry.travelHours === '' ? 0 : Number(entry.travelHours),
        description: entry.description,
        consultant: entry.consultant,
        timestamp: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    return data[0] ? { ...data[0], travelHours: data[0].travel_hours } : null;
},

  async updateEntry(id, entry) {
    console.log("Oppdaterer ID:", id, "med data:", entry); // Sjekk hva som sendes inn

    const parsedId = parseInt(id, 10);

    console.log("Oppdaterer entry med ID: ", parsedId, "og data ", entry);

    const { data, error } = await supabase
      .from('time_entries')
      .update({
        date: entry.date,
        client: entry.client,
        project: entry.project,
        hours: Number(entry.hours),
        travel_hours: entry.travelHours === '' ? 0 : Number(entry.travelHours),
        description: entry.description,
        consultant: entry.consultant
      })
      .eq('id', parsedId) //bruk integer for ID      
      .select()
    
      if (error) {
        console.error('Feil ved oppdatering:', error.message);
        throw error;
      }
      
      console.log("Data som sendes til Supabase:", {
        id: parseInt(id, 10), // Sørg for integer ID
        date: entry.date,
        client: entry.client,
        project: entry.project,
        hours: Number(entry.hours),
        travel_hours: entry.travelHours === '' ? 0 : Number(entry.travelHours),
        description: entry.description,
        consultant: entry.consultant
      });
      

      // Returner første oppdaterte rad
      console.log("Oppdatering fullført: ", data);
      return data[0];
    },

  async deleteEntry(id) {
    console.log("sletter ID:", id);  // Sjekk hva som sendes inn
    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', id)

    if (error) {
    console.error('Feil ved sletting:', error.message);
    throw error;
    }

    if (count === 0) {
    console.warn('Ingen rader ble slettet. Sjekk ID.');
    throw new Error('Kunne ikke slette registrering. Prøv igjen.');
    }
  }
}

console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
