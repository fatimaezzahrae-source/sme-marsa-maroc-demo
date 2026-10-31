// Données et Référentiels ISO 50001:2018 - Marsa Maroc DEPA Port d'Agadir
// Marché n° 12/DEPA/2026

export const ISO_50001_DATA = {
  baselineYear: 2024,
  certificationStandard: 'ISO 50001:2018',
  smiScope: 'Manutention portuaire, traction, outillage, réfrigération et services aux navires',
  energyReviewPeriod: 'Octobre 2026',
  
  // Indicateurs de Performance Énergétique (IPE / EnPI)
  indicators: [
    {
      id: 'IPE-01',
      code: 'IPE Global Port',
      name: 'Intensité Énergétique Globale Portuaire',
      formula: 'Consommation Totale (kWh) / Trafic Total Équivalent (T)',
      unit: 'kWh / Tonne',
      currentValue: 4.82,
      targetValue: 4.50,
      baselineValue: 5.25,
      deltaVsBaseline: -8.19, // % d'amélioration
      status: 'GOOD',
      substation: 'Tous Postes (PT 1, X, Z, 4, Y, 7)',
      description: 'Mesure de l’efficacité énergétique globale de l’ensemble des opérations portuaires DEPA.'
    },
    {
      id: 'IPE-02',
      code: 'IPE Conteneurs',
      name: 'Consommation par Mouvement de Portique STS',
      formula: 'Énergie Portiques STS-01 & STS-02 (kWh) / Nb Mouvements',
      unit: 'kWh / Mouvement',
      currentValue: 18.4,
      targetValue: 17.5,
      baselineValue: 20.8,
      deltaVsBaseline: -11.54,
      status: 'GOOD',
      substation: 'PT X (Terminal Conteneurs)',
      description: 'Efficacité énergétique des cycles de levage et transbordement navire-quai.'
    },
    {
      id: 'IPE-03',
      code: 'IPE Reefer Park',
      name: 'Consommation par Conteneur Frigorifique Branché',
      formula: 'Énergie Reefer Park (kWh) / (Nb Reefers branchés × Jours)',
      unit: 'kWh / Reefer / Jour',
      currentValue: 42.6,
      targetValue: 40.0,
      baselineValue: 46.2,
      deltaVsBaseline: -7.79,
      status: 'WARNING',
      substation: 'PT Y (Parc Frigorifique)',
      description: 'Surveillance de la charge thermique et de l’efficacité du maintien en température des reefers.'
    },
    {
      id: 'IPE-04',
      code: 'IPE Vracs & Silos',
      name: 'Énergie Spécifique Manutention Vracs Céréaliers',
      formula: 'Énergie Silos PT 4 (kWh) / Tonnes de céréales déchargées',
      unit: 'kWh / Tonne vrac',
      currentValue: 2.15,
      targetValue: 2.00,
      baselineValue: 2.42,
      deltaVsBaseline: -11.16,
      status: 'GOOD',
      substation: 'PT 4 (Silos Agroalimentaires)',
      description: 'Rendement des chaînes de transport par élévateurs à godets et bandes transporteuses.'
    },
    {
      id: 'IPE-05',
      code: 'IPE Outillage Quai',
      name: 'Énergie par Heure de Fonctionnement Grue Mobile',
      formula: 'Énergie Grues Gottwald (kWh) / Heures de Fonctionnement',
      unit: 'kWh / Heure grue',
      currentValue: 68.2,
      targetValue: 65.0,
      baselineValue: 74.0,
      deltaVsBaseline: -7.84,
      status: 'GOOD',
      substation: 'PT Z (Outillage Quai Ouest)',
      description: 'Supervision de la performance électromécanique des grues polyvalentes.'
    },
    {
      id: 'IPE-06',
      code: 'IPE Pertes Réseau & Transfos',
      name: 'Taux de Rendement Transformateurs & Pertes Boucle 22kV',
      formula: '(Énergie BT Utile / Énergie MT ONEE Injectée) × 100',
      unit: '% Rendement',
      currentValue: 97.4,
      targetValue: 97.8,
      baselineValue: 96.2,
      deltaVsBaseline: +1.25,
      status: 'GOOD',
      substation: 'Ensemble des 6 Postes',
      description: 'Évaluation des pertes fer et Joule des transformateurs MT/BT du Port d’Agadir.'
    }
  ],

  // Situation Énergétique de Référence (SER) - Données historiques 2026 vs Baseline 2024
  monthlyData: [
    { month: 'Janvier', realKWh: 890000, baselineKWh: 940000, savingsKWh: 50000, cusumKWh: 50000, teus: 18400, bulkTons: 195000 },
    { month: 'Février', realKWh: 840000, baselineKWh: 895000, savingsKWh: 55000, cusumKWh: 105000, teus: 17800, bulkTons: 188000 },
    { month: 'Mars', realKWh: 920000, baselineKWh: 980000, savingsKWh: 60000, cusumKWh: 165000, teus: 19500, bulkTons: 202000 },
    { month: 'Avril', realKWh: 960000, baselineKWh: 1025000, savingsKWh: 65000, cusumKWh: 230000, teus: 20400, bulkTons: 215000 },
    { month: 'Mai', realKWh: 1010000, baselineKWh: 1070000, savingsKWh: 60000, cusumKWh: 290000, teus: 21800, bulkTons: 220000 },
    { month: 'Juin', realKWh: 1080000, baselineKWh: 1140000, savingsKWh: 60000, cusumKWh: 350000, teus: 23200, bulkTons: 228000 },
    { month: 'Juillet', realKWh: 1150000, baselineKWh: 1230000, savingsKWh: 80000, cusumKWh: 430000, teus: 24500, bulkTons: 235000 },
    { month: 'Août', realKWh: 1190000, baselineKWh: 1280000, savingsKWh: 90000, cusumKWh: 520000, teus: 25100, bulkTons: 242000 },
    { month: 'Septembre', realKWh: 1040000, baselineKWh: 1110000, savingsKWh: 70000, cusumKWh: 590000, teus: 22300, bulkTons: 224000 },
    { month: 'Octobre', realKWh: 985000, baselineKWh: 1060000, savingsKWh: 75000, cusumKWh: 665000, teus: 21000, bulkTons: 210000 },
  ],

  // Diagramme de Pareto des Usages Énergétiques Significatifs (UES / SEU)
  paretoItems: [
    { label: 'PT X - Terminal Conteneurs (Portiques STS & RTG)', powerKW: 1842.1, sharePercent: 30.7, cumulativePercent: 30.7, category: 'Force Motrice Quai' },
    { label: 'PT Y - Reefer Park (320 Prises Frigorifiques)', powerKW: 1515.6, sharePercent: 25.3, cumulativePercent: 56.0, category: 'Froid Industriel' },
    { label: 'PT 4 - Silos & Bandes Manutention Vrac', powerKW: 978.2, sharePercent: 16.3, cumulativePercent: 72.3, category: 'Convoyage & Levage' },
    { label: 'PT Z - Outillage (Grues Mobiles Gottwald)', powerKW: 745.8, sharePercent: 12.4, cumulativePercent: 84.7, category: 'Manutention' },
    { label: 'PT 1 - Central, Quais Historiques & Pompage', powerKW: 618.4, sharePercent: 10.3, cumulativePercent: 95.0, category: 'Infrastructures & Eau' },
    { label: 'PT 7 - Chantier Naval, Slipway & Ateliers', powerKW: 288.7, sharePercent: 4.8, cumulativePercent: 99.8, category: 'Traction & Soudure' },
  ],

  // Flux d'énergie simplifié (Arrivée ONEE 22kV -> 6 Postes -> Usages finaux)
  energyFlow: {
    source: 'Arrivée Réseau ONEE 22 kV (Sous-station Agadir Port)',
    totalInflowKW: 6000.0,
    substations: [
      { name: 'PT X Conteneurs', powerKW: 1842.1, color: '#38bdf8' },
      { name: 'PT Y Reefer Park', powerKW: 1515.6, color: '#06b6d4' },
      { name: 'PT 4 Silos & Vrac', powerKW: 978.2, color: '#10b981' },
      { name: 'PT Z Outillage', powerKW: 745.8, color: '#f59e0b' },
      { name: 'PT 1 Central & DEPA', powerKW: 618.4, color: '#6366f1' },
      { name: 'PT 7 Chantier Naval', powerKW: 288.7, color: '#ec4899' },
    ],
    endUses: [
      { name: 'Reefer Park (Froid)', powerKW: 1500.0, share: '25.0%' },
      { name: 'Portiques Quai STS & RTG', powerKW: 1570.0, share: '26.2%' },
      { name: 'Élévateurs Silos & Convoyeurs', powerKW: 850.0, share: '14.2%' },
      { name: 'Grues Mobiles Quai Gottwald', powerKW: 650.0, share: '10.8%' },
      { name: 'Éclairage Mâts & Terre-pleins', powerKW: 460.0, share: '7.7%' },
      { name: 'Pompage Incendie & Eau Portuaire', powerKW: 230.0, share: '3.8%' },
      { name: 'Ateliers, Cale Halage & Slipway', powerKW: 210.0, share: '3.5%' },
      { name: 'Bâtiments Administratifs & TOS', powerKW: 220.0, share: '3.7%' },
      { name: 'Pertes Transfos & Lignes (2.6%)', powerKW: 155.0, share: '2.6%' },
    ]
  },

  // Plan d'actions d'amélioration énergétique (ISO 50001 §6.2)
  actionPlans: [
    {
      id: 'PAE-01',
      title: 'Optimisation de la régulation thermique du Reefer Park PT Y',
      targetSite: 'PT Y (Reefer Park)',
      expectedGain: '180 MWh / an (Gain: 195 000 MAD)',
      deadline: 'T1 2027',
      status: 'IN_PROGRESS',
      progress: 65,
      responsible: 'DEPA / Service Électromécanique',
      action: 'Déploiement de régulateurs à fréquence variable et délestage dynamique des cycles compresseurs.'
    },
    {
      id: 'PAE-02',
      title: 'Relamping LED & Télégestion Mâts Grande Hauteur',
      targetSite: 'PT 1, PT X, PT Z',
      expectedGain: '95 MWh / an (Gain: 105 000 MAD)',
      deadline: 'T2 2027',
      status: 'VALIDATED',
      progress: 30,
      responsible: 'DEPA / Service Outillage',
      action: 'Remplacement de 140 projecteurs sodium haute pression 1000W par luminaires LED 400W dimmables pilotés DALI.'
    },
    {
      id: 'PAE-03',
      title: 'Système de récupération d’énergie au freinage portiques STS',
      targetSite: 'PT X (Portiques Quai)',
      expectedGain: '240 MWh / an (Gain: 260 000 MAD)',
      deadline: 'T3 2027',
      status: 'PLANNED',
      progress: 10,
      responsible: 'Marsa Maroc / Direction Technique Centrale',
      action: 'Installation de bancs capacitifs super-condensateurs et réinjection sur le réseau interne 400V.'
    },
    {
      id: 'PAE-04',
      title: 'Compensation automatique puissance réactive PT 7',
      targetSite: 'PT 7 (Chantier Naval)',
      expectedGain: 'Suppression pénalité ONEE cos φ (Gain: 35 000 MAD)',
      deadline: 'T4 2026',
      status: 'IN_PROGRESS',
      progress: 80,
      responsible: 'DEPA / Bureau Méthodes',
      action: 'Installation batterie de condensateurs accordée avec filtres anti-harmoniques 150 kVAR.'
    }
  ]
};
