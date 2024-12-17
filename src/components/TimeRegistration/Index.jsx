import { useState, useEffect, Fragment } from 'react';
import FilterPanel from './FilterPanel';
import StatisticsPanel from './StatisticsPanel';
import RegistrationForm from './RegistrationForm.jsx';
import TimeTable from './TimeTable';
import { exportToCSV } from './utils/export';
import { applyFilters } from './utils/filters';

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
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setTimeEntries(prev => prev.map(entry => 
        entry.id === editingId ? { ...currentEntry, id: editingId } : entry
      ));
      setEditingId(null);
    } else {
      const newEntry = {
        ...currentEntry,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      setTimeEntries(prev => [...prev, newEntry]);
    }
    
    setCurrentEntry(prev => ({
      date: new Date().toISOString().split('T')[0],
      client: '',
      project: '',
      hours: '',
      travelHours: '',
      description: '',
      consultant: prev.consultant
    }));

    alert(editingId ? 'Timer oppdatert!' : 'Timer registrert!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Er du sikker på at du vil slette denne timeregistreringen?')) {
      setTimeEntries(prev => prev.filter(entry => entry.id !== id));
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