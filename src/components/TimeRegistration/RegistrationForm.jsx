import { useState, useEffect, Fragment } from 'react';
import FilterPanel from './FilterPanel';
import StatisticsPanel from './StatisticsPanel';
import RegistrationForm from './RegistrationForm';
import TimeTable from './TimeTable';
import { exportToCSV } from './utils/export';
import { applyFilters } from './utils/filters';
import { excelService } from '../../services/excelService';

const TimeRegistration = () => {
  // State management
  const [timeEntries, setTimeEntries] = useState(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

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
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser Excel service når komponenten lastes
  useEffect(() => {
    const initializeExcelService = async () => {
      try {
        await excelService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Excel service:', error);
      }
    };

    initializeExcelService();
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  // Client configuration
  const clients = {
    'Valori - DigiRehab': [],
    'Valori - KMD': [],
    'Valori - Youwell': [],
    'Valori Care': ['Funding', 'Markedsføring SoMe', 'Produktutvikling', 'Administrasjon', 'Annet'],
    'Valori - EHiN': [],
  };

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Starting submission...');
      
      // Sikre at Excel service er initialisert
      if (!isInitialized) {
        await excelService.initialize();
        setIsInitialized(true);
      }

      let updatedEntry;
      
      if (editingId) {
        updatedEntry = { ...currentEntry, id: editingId };
        setTimeEntries(prev => prev.map(entry => 
          entry.id === editingId ? updatedEntry : entry
        ));
      } else {
        updatedEntry = {
          ...currentEntry,
          id: Date.now(),
          timestamp: new Date().toISOString()
        };
        setTimeEntries(prev => [...prev, updatedEntry]);
      }

      // Registrer i Excel
      console.log('Attempting Excel registration...');
      const excelResult = await excelService.registerTime(updatedEntry);
      console.log('Excel registration result:', excelResult);
      
      // Reset skjema
      setCurrentEntry({
        date: new Date().toISOString().split('T')[0],
        client: '',
        project: '',
        hours: '',
        travelHours: '',
        description: '',
        consultant: currentEntry.consultant // Behold konsulent
      });
      
      setEditingId(null);
      alert(editingId ? 'Timer oppdatert i både systemet og Excel!' : 'Timer registrert i både systemet og Excel!');
      
    } catch (error) {
      console.error('Feil ved registrering:', error);
      alert(`Feil ved registrering: ${error.message}`);
      
      // Hvis Excel-oppdatering feiler, behold dataene i skjemaet
      if (!editingId) {
        setTimeEntries(prev => prev.filter(entry => entry.id !== currentEntry.id));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of the component remains the same...
  const handleDelete = async (id) => {
    if (window.confirm('Er du sikker på at du vil slette denne timeregistreringen?')) {
      try {
        setTimeEntries(prev => prev.filter(entry => entry.id !== id));
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
      travelHours: entry.travelHours || '',
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