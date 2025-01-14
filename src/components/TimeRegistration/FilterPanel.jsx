import React from 'react';
import { getUniqueValues } from './utils/filters';

const FilterPanel = ({ entries, filters, setFilters }) => {
  const uniqueConsultants = getUniqueValues(entries, 'consultant');
  const uniqueClients = getUniqueValues(entries, 'client');
  const uniqueProjects = getUniqueValues(entries, 'project');

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      client: '',
      consultant: '',
      project: '',
      search: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filtrer Timer</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Nullstill filter
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Periode</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Velg kunde/konsulent</label>
          <select
            value={filters.client}
            onChange={(e) => setFilters({...filters, client: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="">Alle kunder</option>
            {uniqueClients.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>
          
          <select
            value={filters.consultant}
            onChange={(e) => setFilters({...filters, consultant: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="">Alle konsulenter</option>
            {uniqueConsultants.map(consultant => (
              <option key={consultant} value={consultant}>{consultant}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Søk og prosjekt</label>
          <input
            type="text"
            placeholder="Søk i beskrivelse..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="w-full p-2 border rounded"
          />
          
          <select
            value={filters.project}
            onChange={(e) => setFilters({...filters, project: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="">Alle prosjekter</option>
            {uniqueProjects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
