// Fonctions d'exportation de données et de rapports

export const exportToCSV = (meters, filename = 'SME_Marsa_Maroc_Mesures.csv') => {
  if (!meters || meters.length === 0) return;

  const headers = [
    'Code Compteur',
    'Poste',
    'Désignation / Point de Comptage',
    'Catégorie',
    'Modèle Appareil',
    'Adresse IP',
    'Port',
    'Esclave ID',
    'Statut Modbus',
    'Puissance Active P (kW)',
    'Puissance Réactive Q (kVAR)',
    'Puissance Apparente S (kVA)',
    'Facteur de Puissance (cos phi)',
    'Fréquence (Hz)',
    'Tension V1 (V)',
    'Tension Composee U12 (V)',
    'Courant Phase 1 (A)',
    'THD Courant (%)',
    'Énergie Active Cumulée (kWh)',
    'Dernier Horodatage'
  ];

  const rows = meters.map(m => [
    m.code,
    m.substationCode,
    `"${m.label.replace(/"/g, '""')}"`,
    m.category,
    m.model,
    m.ipAddress,
    m.port,
    m.slaveId,
    m.status,
    m.powerKW.toFixed(1),
    m.powerKVAR.toFixed(1),
    m.powerKVA.toFixed(1),
    m.cosPhi.toFixed(3),
    m.freqHz.toFixed(2),
    m.voltageV ? m.voltageV[0].toFixed(1) : '-',
    m.phaseVoltageV ? m.phaseVoltageV[0].toFixed(1) : '-',
    m.currentA ? m.currentA[0].toFixed(1) : '-',
    m.thdI.toFixed(1),
    m.energyTotalKWh.toFixed(0),
    m.lastUpdate
  ]);

  const csvContent = '\uFEFF' + [
    headers.join(';'),
    ...rows.map(r => r.join(';'))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data, filename = 'SME_Marsa_Maroc_Export.json') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const printDocument = () => {
  window.print();
};
