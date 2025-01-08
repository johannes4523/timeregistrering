import { useState, useEffect, Fragment } from 'react';
import FilterPanel from './FilterPanel';
import StatisticsPanel from './StatisticsPanel';
import RegistrationForm from './RegistrationForm';
import TimeTable from './TimeTable';
import { exportToCSV } from './utils/export';
import { applyFilters } from './utils/filters';
import { supabase, timeRegistrationService } from '../../services/supabase';

const TimeRegistration = () => {
  // State management
  const [timeEntries, setTimeEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentEntry, setCurrentEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    client: '',
    project: '',
    hours: '',
    travelHours: '',
    description: '',
    consultant: ''
  });

  const [editingId, setEditingId] = useState('');

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    client: '',
    consultant: '',
    project: '',
    search: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Last inn data når komponenten monteres
  useEffect(() => {
    fetchTimeEntries();
  }, []);

  // Hent data fra service
  const fetchTimeEntries = async () => {
    try {
      const data = await timeRegistrationService.getAllEntries();

      // Mapper travel_hours til travelHours for frontend
      const mappedData = data.map(entry => ({
        ...entry,
        travelHours: entry.travel_hours, // Mapper til frontend-format
      }));

      setTimeEntries(mappedData);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      alert('Kunne ikke hente timeregistreringer');
    } finally {
      setIsLoading(false);
    }
  };

  // Client configuration
  const clients = {
    'Valori - DigiRehab': [],
    'Valori - KMD': [],
    'Valori - Youwell': [],
    'Valori - EHiN': [],
    'Valori Care': ['Funding', 'Markedsføring SoMe', 'Produktutvikling', 'Administrasjon', 'Annet', 'Forskningsmidler'],
  };

  // Navn på konsulenter
  const consultants = ['Hanne', 'Kathrine', 'Johannes'];

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      
      if (editingId) {
        console.log("Updating entry (delete and create new) for ID:", editingId);
        
        // Først slett den gamle oppføringen
        try {
          await timeRegistrationService.deleteEntry(editingId);
          console.log("Successfully deleted old entry");
        } catch (error) {
          console.error("Failed to delete old entry:", error);
          throw new Error("Kunne ikke slette gammel registrering");
        }
        
        // Så legg til en ny oppføring
        try {
          result = await timeRegistrationService.addEntry(currentEntry);
          console.log("Successfully created new entry:", result);
        } catch (error) {
          console.error("Failed to create new entry:", error);
          throw new Error("Kunne ikke opprette ny registrering");
        }

        if (result) {
          // Oppdater frontend state
          setTimeEntries(prev => {
            const filtered = prev.filter(entry => entry.id !== editingId);
            return [...filtered, result];
          });

          // Behold datoen fra forrige registrering
          const lastUsedDate = currentEntry.date;
          
          // Reset form, men behold datoen
          setEditingId(null);
          setCurrentEntry({
            date: lastUsedDate,
            client: '',
            project: '',
            hours: '',
            travelHours: '',
            description: '',
            consultant: ''
          });
          
          alert('Timer oppdatert!');
        }
      } else {
        // Opprett ny registrering
        console.log("Creating new entry with data:", currentEntry);
        result = await timeRegistrationService.addEntry(currentEntry);
        console.log("Creation completed with result:", result);
        
        if (result) {
          setTimeEntries(prev => [...prev, result]);
          
          // Behold datoen fra forrige registrering
          const lastUsedDate = currentEntry.date;
          
          // Reset form, men behold datoen
          setCurrentEntry({
            date: lastUsedDate,
            client: '',
            project: '',
            hours: '',
            travelHours: '',
            description: '',
            consultant: ''
          });
          
          alert('Timer registrert!');
        }
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert(error.message || 'En feil oppstod ved registrering');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Invalid ID for deletion:", id);
      alert('Ugyldig ID for sletting');
      return;
    }

    if (window.confirm('Er du sikker på at du vil slette denne timeregistreringen?')) {
      try {
        console.log("Starting delete operation for ID:", id);
        
        // Prøv å slette
        await timeRegistrationService.deleteEntry(id);
        console.log("Delete operation successful");
        
        // Hvis slettingen var vellykket, oppdater frontend
        setTimeEntries(prev => {
          const updated = prev.filter(entry => entry.id !== id);
          console.log("Updated entries after deletion:", updated);
          return updated;
        });
        
        alert('Timeregistrering slettet');
        
        // Hvis vi var i redigeringsmodus for denne oppføringen, avbryt redigeringen
        if (editingId === id) {
          setEditingId(null);
          setCurrentEntry({
            date: new Date().toISOString().split('T')[0],
            client: '',
            project: '',
            hours: '',
            travelHours: '',
            description: '',
            consultant: ''
          });
        }
      } catch (error) {
        console.error('Delete operation failed:', error);
        alert(`Kunne ikke slette timeregistrering: ${error.message}`);
        
        // Hvis feilen indikerer at oppføringen ikke finnes, oppdater frontend uansett
        if (error.message.includes('Fant ikke oppføringen')) {
          setTimeEntries(prev => prev.filter(entry => entry.id !== id));
        }
      }
    }
  };

  const handleEdit = (entry) => {
    console.log("Starting edit with entry:", entry);
    setEditingId(entry.id);
    setCurrentEntry({
      date: entry.date,
      client: entry.client,
      project: entry.project,
      hours: entry.hours,
      travelHours: entry.travelHours || '',
      description: entry.description,
      consultant: entry.consultant
    });
    // Scroll til toppen av siden
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    // Behold datoen fra nåværende skjema
    const currentDate = currentEntry.date;
    
    setEditingId(null);
    setCurrentEntry({
      date: currentDate, // Beholder den nåværende datoen
      client: '',
      project: '',
      hours: '',
      travelHours: '',
      description: '',
      consultant: ''
    });
  };

  // Filter entries
  const filteredEntries = applyFilters(timeEntries, filters);

  if (isLoading) {
    return <div className="container mx-auto p-4">Laster timeregistreringer...</div>;
  }

  return (
    <Fragment>
      <div className="container mx-auto p-4">
        <div className="space-y-6">
          <RegistrationForm 
            currentEntry={currentEntry}
            setCurrentEntry={setCurrentEntry}
            handleSubmit={handleSubmit}
            editingId={editingId}
            cancelEdit={cancelEdit}
            clients={clients}
            consultants={consultants}
            isSubmitting={isSubmitting}
          />

          <FilterPanel 
            entries={timeEntries}
            filters={filters}
            setFilters={setFilters}
          />

          <StatisticsPanel entries={filteredEntries} />

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">Registrerte Timer</h2>
                <button
                  onClick={() => exportToCSV(filteredEntries, filters)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Eksporter Timer
                </button>
              </div>
              <div className="text-gray-600">
                Viser {filteredEntries.length} av {timeEntries.length} registreringer
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <TimeTable 
                entries={filteredEntries}
                editingId={editingId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TimeRegistration;