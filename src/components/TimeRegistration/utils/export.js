import { applyFilters } from './filters';  // Importer applyFilters fra filters.js

export const exportToCSV = (entries, filters = null) => {
  // Apply filters if provided
  let dataToExport = filters ? applyFilters(entries, filters) : entries;
  
  const headers = ['Dato', 'Konsulent', 'Kunde', 'Prosjekt', 'Timer', 'Reisetimer', 'Beskrivelse'];
  const data = dataToExport.map(entry => [
    entry.date,
    entry.consultant,
    entry.client,
    entry.project || '',
    entry.hours,
    entry.travelHours || '',
    entry.description.replace(/,/g, ';')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `timeregistrering${filters ? '-filtrert' : ''}.csv`;
  link.click();
};