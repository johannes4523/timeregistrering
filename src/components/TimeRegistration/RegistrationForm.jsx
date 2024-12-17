import PropTypes from 'prop-types';
import React from 'react';

const RegistrationForm = ({ 
  currentEntry, 
  setCurrentEntry, 
  handleSubmit, 
  editingId,
  cancelEdit,
  clients,
  isSubmitting 
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
            disabled={isSubmitting}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={isSubmitting}
          />
          
          <input
            type="text"
            placeholder="Konsulent"
            value={currentEntry.consultant}
            onChange={(e) => setCurrentEntry({...currentEntry, consultant: e.target.value})}
            className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={isSubmitting}
          />

          <select
            value={currentEntry.client}
            onChange={(e) => setCurrentEntry({...currentEntry, client: e.target.value})}
            className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={isSubmitting}
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
              className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={isSubmitting}
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
            className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            step="0.5"
            min="0"
            disabled={isSubmitting}
          />

          <input
            type="number"
            placeholder="Reisetimer"
            value={currentEntry.travelHours}
            onChange={(e) => setCurrentEntry({...currentEntry, travelHours: e.target.value})}
            className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            step="0.5"
            min="0"
            disabled={isSubmitting}
          />

          <textarea
            placeholder="Kommentar"
            value={currentEntry.description}
            onChange={(e) => setCurrentEntry({...currentEntry, description: e.target.value})}
            className="w-full p-2 border rounded col-span-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows="3"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>{editingId ? 'Oppdaterer...' : 'Registrerer...'}</span>
              </>
            ) : (
              <span>{editingId ? 'Oppdater' : 'Registrer'}</span>
            )}
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
    description: PropTypes.string
  }).isRequired,
  setCurrentEntry: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  editingId: PropTypes.number,
  cancelEdit: PropTypes.func,
  clients: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.string)
  ).isRequired,
  isSubmitting: PropTypes.bool
};

RegistrationForm.defaultProps = {
  editingId: null,
  cancelEdit: () => {},
  isSubmitting: false
};

export default RegistrationForm;