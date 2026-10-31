// Configuration des Tarifs ONEE Moyenne Tension & Bilan Carbone
// Port d'Agadir - Direction d'Exploitation Marsa Maroc (DEPA)

export const TARIFF_CONFIG = {
  currency: 'MAD',
  currencySymbol: 'DH',
  gridOperator: 'ONEE - Branche Électricité (Direction Régionale Souss-Massa)',
  contractType: 'Moyenne Tension Tarif Vert (Option Général)',
  contractNumber: 'ONEE-DEP-AGD-2021-049',
  
  // Tarifs horaires en Dirham Marocain (MAD / DH)
  rates: {
    peakHours: 1.482,    // Heures de Pointe (18h00 - 22h00)
    normalHours: 1.145,  // Heures Pleines (06h00 - 18h00)
    offPeakHours: 0.768, // Heures Creuses (22h00 - 06h00)
    averageBlendedRate: 1.095, // Tarif moyen pondéré estimé
  },

  // Redevance de puissance & pénalités
  powerChargePerKWMad: 365.0, // Redevance annuelle par kW souscrit
  cosPhiThreshold: 0.92,      // Seuil réglementaire tan φ = 0.426
  penaltyPerKVARhExceeded: 0.125, // Majoration pour dépassement réactif

  // Facteur d'émission réseau national
  co2FactorKgPerKWh: 0.650, // 650 g CO2 / kWh (Mix électrique marocain ONEE)

  // Utilisateurs types pour le panneau d'administration et l'audit
  defaultUsers: [
    { id: 'usr-1', name: 'Driss El Mansouri', email: 'd.elmansouri@marsamaroc.co.ma', role: 'ADMIN_TECH', label: 'Administrateur Système SME' },
    { id: 'usr-2', name: 'Fatima-Zahra Alami', email: 'fz.alami@marsamaroc.co.ma', role: 'ENERGY_MGR', label: 'Responsable Énergie & ISO 50001' },
    { id: 'usr-3', name: 'Karim Benali', email: 'k.benali@marsamaroc.co.ma', role: 'OPERATOR', label: 'Opérateur Salle de Contrôle SCADA' },
    { id: 'usr-4', name: 'Cabinet Audit Veritas', email: 'auditeur.externe@bureauveritas.ma', role: 'AUDITOR', label: 'Auditeur Externe ISO 50001 / SMI' },
  ],

  // Scénarios de simulation opérationnelle
  scenarios: [
    {
      id: 'NORMAL',
      label: 'Activité Portuaire Nominale',
      description: 'Opérations courantes de déchargement conteneurs et stockage reefers.',
      powerMultiplier: 1.0,
      reeferMultiplier: 1.0,
      stsMultiplier: 1.0,
      silosMultiplier: 1.0,
    },
    {
      id: 'PEAK_CONTAINERS',
      label: 'Pic Quai Conteneurs (2 Navires 8000 EVP)',
      description: 'Double escale navires porte-conteneurs: 2 Portiques STS à pleine cadence et rotation intensive des RTG.',
      powerMultiplier: 1.25,
      reeferMultiplier: 1.1,
      stsMultiplier: 1.6,
      silosMultiplier: 0.8,
    },
    {
      id: 'REEFER_PEAK',
      label: 'Campagne Primeurs & Canicule (Reefer Surchargé)',
      description: 'Pic d’export agrumes et primeurs du Souss: 310 conteneurs reefers branchés à pleine puissance frigorifique.',
      powerMultiplier: 1.22,
      reeferMultiplier: 1.55,
      stsMultiplier: 1.0,
      silosMultiplier: 0.9,
    },
    {
      id: 'BULK_DISCHARGE',
      label: 'Déchargement Intensif Silos Céréaliers',
      description: 'Navire céréalier 60 000 T à quai: tours d’élévation et convoyeurs fonctionnant en continu.',
      powerMultiplier: 1.18,
      reeferMultiplier: 0.95,
      stsMultiplier: 0.9,
      silosMultiplier: 1.7,
    },
    {
      id: 'NIGHT_MAINTENANCE',
      label: 'Creux Nocturne & Maintenance',
      description: 'Période d’heures creuses: quais au ralenti, seuls les reefers et l’éclairage de sécurité restent actifs.',
      powerMultiplier: 0.65,
      reeferMultiplier: 0.85,
      stsMultiplier: 0.2,
      silosMultiplier: 0.1,
    }
  ]
};
