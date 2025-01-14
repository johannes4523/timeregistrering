import React from 'react';

const TimeTable = ({ entries, editingId, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Dato</th>
            <th className="border p-2">Konsulent</th>
            <th className="border p-2">Kunde</th>
            <th className="border p-2">Prosjekt</th>
            <th className="border p-2">Timer</th>
            <th className="border p-2">Reisetimer</th>
            <th className="border p-2">Beskrivelse</th>
            <th className="border p-2">Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {entries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(entry => (
              <tr key={entry.id} className={editingId === entry.id ? 'bg-blue-50' : ''}>
                <td className="border p-2">{entry.date}</td>
                <td className="border p-2">{entry.consultant}</td>
                <td className="border p-2">{entry.client}</td>
                <td className="border p-2">{entry.project}</td>
                <td className="border p-2">{entry.hours}</td>
                <td className="border p-2">{entry.travelHours}</td>
                <td className="border p-2">{entry.description}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => onEdit(entry)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Rediger
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Slett
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable;
