import PropTypes from 'prop-types';
import React from 'react';

const RegistrationForm = ({ 
  currentEntry, 
  setCurrentEntry, 
  handleSubmit, 
  editingId,
  cancelEdit,
  clients 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {editingId ? 'Rediger Timeregistrering' : 'Registrer Timer'}
        </h2>
        {editingId && (
          <button
            onClick={cancelEdit}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Avbryt Redigering
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            value={currentEntry.date}
            onChange={(e) => setCurrentEntry({...currentEntry, date: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          
          <input
            type="text"
            placeholder="Konsulent"
            value={currentEntry.consultant}
            onChange={(e) => setCurrentEntry({...currentEntry, consultant: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />

          <select
            value={currentEntry.client}
            onChange={(e) => setCurrentEntry({...currentEntry, client: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Velg kunde</option>
            {Object.keys(clients).map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>

          {currentEntry.client === 'Valori Care' && (
            <select
              value={currentEntry.project}
              onChange={(e) => setCurrentEntry({...currentEntry, project: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Velg prosjekt</option>
              {clients['Valori Care'].map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          )}

          <input
            type="number"
            placeholder="Antall timer"
            value={currentEntry.hours}
            onChange={(e) => setCurrentEntry({...currentEntry, hours: e.target.value})}
            className="w-full p-2 border rounded"
            required
            step="0.5"
            min="0"
          />

          <input
            type="number"
            placeholder="Reisetimer"
            value={currentEntry.travelHours}
            onChange={(e) => setCurrentEntry({...currentEntry, travelHours: e.target.value})}
            className="w-full p-2 border rounded"
            step="0.5"
            min="0"
          />

          <textarea
            placeholder="Kommentar"
            value={currentEntry.description}  // Changed from comment to description to match state
            onChange={(e) => setCurrentEntry({...currentEntry, description: e.target.value})}
            className="w-full p-2 border rounded col-span-2"
            rows="3"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {editingId ? 'Oppdater' : 'Registrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

RegistrationForm.propTypes = {
  currentEntry: PropTypes.shape({
    date: PropTypes.string.isRequired,
    consultant: PropTypes.string.isRequired,
    client: PropTypes.string.isRequired,
    project: PropTypes.string,
    hours: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    travelHours: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    description: PropTypes.string  // Changed from comment to description to match state
  }).isRequired,
  setCurrentEntry: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  editingId: PropTypes.number,
  cancelEdit: PropTypes.func,
  clients: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.string)
  ).isRequired
};

RegistrationForm.defaultProps = {
  editingId: null,
  cancelEdit: () => {},
};

export default RegistrationForm;