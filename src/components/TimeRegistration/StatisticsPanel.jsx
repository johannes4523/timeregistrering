import React from 'react';
import { calculateClientTotals, calculateConsultantTotals } from './utils/calculations';

const StatisticsPanel = ({ entries }) => {
  const clientTotals = calculateClientTotals(entries);
  const consultantTotals = calculateConsultantTotals(entries);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Statistikk</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Timer per kunde</h4>
          {Object.entries(clientTotals).map(([client, data]) => (
            <div key={client} className="mb-4">
              <div className="flex justify-between items-center text-sm">
                <span>{client}</span>
                <span className="font-medium">
                  {data.hours.toFixed(1)}t + {data.travelHours.toFixed(1)}t reise
                </span>
              </div>
              {Object.entries(data.projects).length > 0 && (
                <div className="ml-4 text-sm text-gray-600">
                  {Object.entries(data.projects).map(([project, hours]) => (
                    <div key={project} className="flex justify-between">
                      <span>{project}</span>
                      <span>{hours.hours.toFixed(1)}t</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-medium mb-2">Timer per konsulent</h4>
          {Object.entries(consultantTotals).map(([consultant, data]) => (
            <div key={consultant} className="mb-4">
              <div className="flex justify-between items-center text-sm">
                <span>{consultant}</span>
                <span className="font-medium">
                  {data.hours.toFixed(1)}t + {data.travelHours.toFixed(1)}t reise
                </span>
              </div>
              <div className="ml-4 text-sm text-gray-600">
                {Object.entries(data.clients).map(([client, hours]) => (
                  <div key={client} className="flex justify-between">
                    <span>{client}</span>
                    <span>{hours.hours.toFixed(1)}t</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
