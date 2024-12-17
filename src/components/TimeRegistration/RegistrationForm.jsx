import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

const RegistrationForm = ({ 
  currentEntry, 
  setCurrentEntry, 
  handleSubmit, 
  editingId,
  cancelEdit,
  clients,
  isSubmitting 
}) => {
  // Optimaliser håndtering av endringer med useCallback
  const handleInputChange = useCallback((field, value) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: value
    }));
  }, [setCurrentEntry]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold" id="form-title">
          {editingId ? 'Rediger Timeregistrering' : 'Registrer Timer'}
        </h2>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            disabled={isSubmitting}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Avbryt redigering"
          >
            Avbryt Redigering
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="form-title">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block mb-1">Dato</span>
            <input
              type="date"
              id="registration-date"
              name="registration-date"
              value={currentEntry.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={isSubmitting}
              autoComplete="off"
            />
          </label>
          
          <label className="block">
            <span className="block mb-1">Konsulent</span>
            <input
              type="text"
              id="registration-consultant"
              name="registration-consultant"
              value={currentEntry.consultant}
              onChange={(e) => handleInputChange('consultant', e.target.value)}
              className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={isSubmitting}
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="block mb-1">Kunde</span>
            <select
              id="registration-client"
              name="registration-client"
              value={currentEntry.client}
              onChange={(e) => handleInputChange('client', e.target.value)}
              className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={isSubmitting}
            >
              <option value="">Velg kunde</option>
              {Object.keys(clients).map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </label>

          {currentEntry.client === 'Valori Care' && (
            <label className="block">
              <span className="block mb-1">Prosjekt</span>
              <select
                id="registration-project"
                name="registration-project"
                value={currentEntry.project}
                onChange={(e) => handleInputChange('project', e.target.value)}
                className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={isSubmitting}
              >
                <option value="">Velg prosjekt</option>
                {clients['Valori Care'].map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </label>
          )}

          <label className="block">
            <span className="block mb-1">Antall timer</span>
            <input
              type="number"
              id="registration-hours"
              name="registration-hours"
              value={currentEntry.hours}
              onChange={(e) => handleInputChange('hours', e.target.value)}
              className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              step="0.5"
              min="0"
              disabled={isSubmitting}
            />
          </label>

          <label className="block">
            <span className="block mb-1">Reisetimer</span>
            <input
              type="number"
              id="registration-travel"
              name="registration-travel"
              value={currentEntry.travelHours}
              onChange={(e) => handleInputChange('travelHours', e.target.value)}
              className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
              step="0.5"
              min="0"
              disabled={isSubmitting}
            />
          </label>

          <label className="block col-span-2">
            <span className="block mb-1">Kommentar</span>
            <textarea
              id="registration-description"
              name="registration-description"
              value={currentEntry.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows="3"
              disabled={isSubmitting}
            />
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            aria-label={isSubmitting ? 'Registrerer...' : 'Registrer timer'}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" aria-hidden="true"></span>
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