import { useState, useEffect, Fragment } from 'react';
import FilterPanel from './FilterPanel';
import StatisticsPanel from './StatisticsPanel';
import RegistrationForm from './RegistrationForm';
import TimeTable from './TimeTable';
import { exportToCSV } from './utils/export';
import { applyFilters } from './utils/filters';
import { timeRegistrationService } from '../../services/supabase';

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

  const [editingId, setEditingId] = useState(null);
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
      setTimeEntries(data);
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
    'Valori Care': ['Funding', 'Markedsføring SoMe', 'Produktutvikling', 'Administrasjon', 'Annet'],
  };

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (editingId) {
        // Oppdater eksisterende registrering
        result = await timeRegistrationService.updateEntry(editingId, currentEntry);
        setTimeEntries(prev => prev.map(entry => 
          entry.id === editingId ? result : entry
        ));
      } else {
        // Opprett ny registrering
        result = await timeRegistrationService.addEntry(currentEntry);
        setTimeEntries(prev => [...prev, result]);
      }

      // Reset form
      setCurrentEntry({
        date: new Date().toISOString().split('T')[0],
        client: '',
        project: '',
        hours: '',
        travelHours: '',
        description: '',
        consultant: currentEntry.consultant // Keep consultant
      });
      
      setEditingId(null);
      alert(editingId ? 'Timer oppdatert!' : 'Timer registrert!');
      
    } catch (error) {
      console.error('Feil ved registrering:', error);
      alert(`Feil ved registrering: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Er du sikker på at du vil slette denne timeregistreringen?')) {
      try {
        await timeRegistrationService.deleteEntry(id);
        setTimeEntries(prev => prev.filter(entry => entry.id !== id));
        alert('Timeregistrering slettet');
      } catch (error) {
        console.error('Feil ved sletting:', error);
        alert(`Feil ved sletting: ${error.message}`);
      }
    }
  };

  const handleEdit = (entry) => {
    setCurrentEntry({
      date: entry.date,
      client: entry.client,
      project: entry.project || '',
      hours: entry.hours,
      travelHours: entry.travel_hours || '',
      description: entry.description,
      consultant: entry.consultant
    });
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      client: '',
      project: '',
      hours: '',
      travelHours: '',
      description: '',
      consultant: currentEntry.consultant
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