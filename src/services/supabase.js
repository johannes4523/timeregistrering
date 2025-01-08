import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://plimkzmplcuofimmxegh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaW1rem1wbGN1b2ZpbW14ZWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NTU2MjcsImV4cCI6MjA1MDAzMTYyN30.002eV1GJU_FOooiS34Wu2ouDrkoAWZNySMRjL-sP2uQ";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("supabaseUrl and supabaseAnonKey are required.");
}

// Initialiser Supabase-klienten
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Time registration functions
export const timeRegistrationService = {
  async getAllEntries() {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    console.log("Hentede data fra Supabase:", data);
    
    return data.map(entry => ({
      ...entry,
      id: entry.id,
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
      .select();
    
    if (error) throw error;
    return data[0] ? { ...data[0], travelHours: data[0].travel_hours } : null;
  },

  async updateEntry(id, entry) {
    const parsedId = parseInt(id, 10);
    console.log("Starting updateEntry with ID:", parsedId);
    console.log("Entry data to update:", entry);

    try {
      // Først sjekk om oppføringen eksisterer
      const { data: existingData, error: checkError } = await supabase
        .from('time_entries')
        .select('*')
        .eq('id', parsedId)
        .single();

      console.log("Existing data check:", { existingData, checkError });

      if (checkError) {
        console.error('Error checking existing entry:', checkError);
        throw checkError;
      }

      if (!existingData) {
        console.error('No existing entry found with ID:', parsedId);
        throw new Error('Kunne ikke finne registreringen');
      }

      // Forbered oppdatert data
      const updateData = {
        date: entry.date,
        client: entry.client,
        project: entry.project,
        hours: Number(entry.hours),
        travel_hours: entry.travelHours === '' ? 0 : Number(entry.travelHours),
        description: entry.description,
        consultant: entry.consultant
      };

      console.log("Update data prepared:", updateData);

      // Utfør oppdateringen
      const { data: updateResult, error: updateError } = await supabase
        .from('time_entries')
        .update(updateData)
        .eq('id', parsedId)
        .select()
        .single();

      console.log("Update operation result:", { updateResult, updateError });

      if (updateError) {
        console.error('Error during update operation:', updateError);
        throw updateError;
      }

      if (!updateResult) {
        console.error('No data returned after update');
        throw new Error('Kunne ikke oppdatere registreringen');
      }

      // Map data til frontend format
      const result = {
        ...updateResult,
        id: updateResult.id,
        travelHours: updateResult.travel_hours
      };

      console.log("Final result to return:", result);
      return result;

    } catch (error) {
      console.error('Error in updateEntry:', error);
      throw error;
    }
  },

  async deleteEntry(id) {
    const parsedId = parseInt(id, 10);
    console.log("Starting delete operation for ID:", parsedId);

    try {
      // Først verifiser at oppføringen eksisterer
      const { data: existingData, error: checkError } = await supabase
        .from('time_entries')
        .select('*')
        .eq('id', parsedId)
        .single();

      console.log("Check for existing entry:", { existingData, checkError });

      if (checkError) {
        console.error('Error checking entry existence:', checkError);
        throw new Error('Kunne ikke verifisere oppføringen');
      }

      if (!existingData) {
        console.error('Entry not found:', parsedId);
        throw new Error('Fant ikke oppføringen som skulle slettes');
      }

      // Utfør slettingen med en annen tilnærming
      const { error: deleteError } = await supabase
        .from('time_entries')
        .delete()
        .filter('id', 'eq', parsedId);

      console.log("Delete operation completed");

      if (deleteError) {
        console.error('Error during delete operation:', deleteError);
        throw new Error('Kunne ikke slette oppføringen: ' + deleteError.message);
      }

      // Dobbeltsjekk at oppføringen er borte
      const { data: checkAfterDelete, error: checkAfterError } = await supabase
        .from('time_entries')
        .select('*')
        .eq('id', parsedId)
        .single();

      console.log("Verification after delete:", { checkAfterDelete, checkAfterError });

      if (checkAfterDelete) {
        console.error('Entry still exists after deletion');
        throw new Error('Oppføringen ble ikke slettet');
      }

      console.log("Successfully verified deletion");
      return true;
    } catch (error) {
      console.error('Delete operation failed:', error);
      throw error;
    }
  },
};
