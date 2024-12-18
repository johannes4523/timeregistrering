import React from 'react';
import PropTypes from 'prop-types'

const RegistrationForm = ({
  currentEntry,
  setCurrentEntry,
  handleSubmit,
  editingId,
  cancelEdit,
  clients,
  consultants,
  isSubmitting
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? 'Rediger Timeregistrering' : 'Ny Timeregistrering'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dato
          </label>
          <input
            type="date"
            name="date"
            value={currentEntry.date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konsulent
          </label>
          <select
            name="consultant"
            value={currentEntry.consultant}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Velg konsulent</option>
            {(consultants || []).map((consultant) => (
              <option key={consultant} value={consultant}>
                {consultant}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kunde
          </label>
          <select
            name="client"
            value={currentEntry.client}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Velg kunde</option>
            {Object.keys(clients).map(client => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prosjekt
          </label>
          <select
            name="project"
            value={currentEntry.project}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Velg prosjekt</option>
            {currentEntry.client && clients[currentEntry.client]?.map(project => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timer
          </label>
          <input
            type="number"
            name="hours"
            value={currentEntry.hours}
            onChange={handleChange}
            required
            step="0.25"
            min="0"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reisetimer
          </label>
          <input
            type="number"
            name="travelHours"
            value={currentEntry.travelHours}
            onChange={handleChange}
            step="0.25"
            min="0"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beskrivelse
        </label>
        <textarea
          name="description"
          value={currentEntry.description}
          onChange={handleChange}
          required
          rows="3"
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-2">
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
          >
            Avbryt
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Lagrer...' : editingId ? 'Oppdater' : 'Registrer'}
        </button>
      </div>
    </form>
  );
};

RegistrationForm.propTypes = {
  currentEntry: PropTypes.object.isRequired,
  setCurrentEntry: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  editingId: PropTypes.string,
  cancelEdit: PropTypes.func.isRequired,
  clients: PropTypes.object.isRequired,
  consultants: PropTypes.array.isRequired,
  isSubmitting: PropTypes.bool.isRequired
};

export default RegistrationForm;