// Utility functions for calculations and statistics
export const calculateTotalHours = (entries) => {
  return entries.reduce((total, entry) => {
    return total + (Number(entry.hours) || 0) + (Number(entry.travelHours) || 0);
  }, 0).toFixed(1);
};

export const calculateClientTotals = (entries) => {
  console.log("Entries for total hours:", entries); // Sjekk hva som finnes i data
  return entries.reduce((acc, entry) => {
    const client = entry.client;
    if (!acc[client]) {
      acc[client] = {
        hours: 0,
        travelHours: 0,
        projects: {}
      };
    }
    
    acc[client].hours += Number(entry.hours) || 0;
    acc[client].travelHours += Number(entry.travelHours) || 0;
    
    if (entry.project) {
      if (!acc[client].projects[entry.project]) {
        acc[client].projects[entry.project] = {
          hours: 0,
          travelHours: 0
        };
      }
      acc[client].projects[entry.project].hours += Number(entry.hours) || 0;
      acc[client].projects[entry.project].travelHours += Number(entry.travelHours) || 0;
    }
    
    return acc;
  }, {});
};

export const calculateConsultantTotals = (entries) => {
  return entries.reduce((acc, entry) => {
    const consultant = entry.consultant;
    if (!acc[consultant]) {
      acc[consultant] = {
        hours: 0,
        travelHours: 0,
        clients: {}
      };
    }
    
    acc[consultant].hours += Number(entry.hours) || 0;
    acc[consultant].travelHours += Number(entry.travelHours) || 0;
    
    if (!acc[consultant].clients[entry.client]) {
      acc[consultant].clients[entry.client] = {
        hours: 0,
        travelHours: 0
      };
    }
    acc[consultant].clients[entry.client].hours += Number(entry.hours) || 0;
    acc[consultant].clients[entry.client].travelHours += Number(entry.travelHours) || 0;
    
    return acc;
  }, {});
};
