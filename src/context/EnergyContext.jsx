import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SUBSTATIONS } from '../data/initialSubstations';
import { INITIAL_METERS } from '../data/initialMeters';
import { INITIAL_ALERTS } from '../data/initialAlerts';
import { ISO_50001_DATA } from '../data/iso50001Data';
import { TARIFF_CONFIG } from '../data/tariffConfig';

const EnergyContext = createContext();

export const EnergyProvider = ({ children }) => {
  const VALID_TABS = ['overview', 'measures', 'iso50001', 'alerts', 'reports', 'admin'];

  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (VALID_TABS.includes(hash)) return hash;
      try {
        const saved = localStorage.getItem('marsa_sme_active_tab');
        if (saved && VALID_TABS.includes(saved)) return saved;
      } catch (e) {}
    }
    return 'overview';
  };

  const [substations, setSubstations] = useState(INITIAL_SUBSTATIONS);
  const [meters, setMeters] = useState(INITIAL_METERS);
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('marsa_sme_alerts');
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });
  const [isoData, setIsoData] = useState(ISO_50001_DATA);
  const [tariffConfig, setTariffConfig] = useState(TARIFF_CONFIG);
  
  const [activeTab, setActiveTabState] = useState(getInitialTab);

  const setActiveTab = (tab) => {
    if (VALID_TABS.includes(tab)) {
      setActiveTabState(tab);
      try {
        localStorage.setItem('marsa_sme_active_tab', tab);
        if (window.location.hash.replace('#', '') !== tab) {
          window.location.hash = tab;
        }
      } catch (e) {}
    }
  };

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
        try {
          localStorage.setItem('marsa_sme_active_tab', hash);
        } catch (e) {}
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial hash if missing
    const currentHash = window.location.hash.replace('#', '');
    if (!currentHash || !VALID_TABS.includes(currentHash)) {
      window.location.hash = activeTab;
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [selectedSubstationId, setSelectedSubstationId] = useState(() => {
    try {
      return localStorage.getItem('marsa_sme_substation') || 'PT-1';
    } catch {
      return 'PT-1';
    }
  });

  const [selectedMeterId, setSelectedMeterId] = useState('C-101');

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('marsa_sme_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [activeScenario, setActiveScenario] = useState(() => {
    try {
      return localStorage.getItem('marsa_sme_scenario') || 'NORMAL';
    } catch {
      return 'NORMAL';
    }
  });

  const [isSimulating, setIsSimulating] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(2000); // 2s
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('marsa_sme_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'Driss El Mansouri (Admin)', action: 'Connexion superviseur SCADA', details: 'Session ouverte depuis 192.168.10.5' },
      { id: 2, timestamp: new Date(Date.now() - 2400000).toISOString(), user: 'Fatima-Zahra Alami (Resp. Énergie)', action: 'Revue IPE Octobre 2026', details: 'Validation du seuil de référence SER 2024' },
      { id: 3, timestamp: new Date(Date.now() - 1200000).toISOString(), user: 'Karim Benali (Opérateur)', action: 'Acquittement alerte ALT-2026-002', details: 'Observation harmonique STS-01' },
    ];
  });

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('marsa_sme_alerts', JSON.stringify(alerts));
    } catch {}
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem('marsa_sme_audit_logs', JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('marsa_sme_scenario', activeScenario);
    } catch {}
  }, [activeScenario]);

  useEffect(() => {
    try {
      localStorage.setItem('marsa_sme_substation', selectedSubstationId);
    } catch {}
  }, [selectedSubstationId]);

  // Synchronize document theme class and persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('marsa_sme_theme', theme);
    } catch {}
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time Simulation Engine
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const nowStr = new Date().toISOString();
      const scenario = tariffConfig.scenarios.find(s => s.id === activeScenario) || tariffConfig.scenarios[0];

      // Update meters with small realistic fluctuations + scenario multipliers
      setMeters(prevMeters => {
        return prevMeters.map(meter => {
          // If status is TIMEOUT or ERROR, keep previous reading (demonstrating CPS Art 2.3: do not invent new live values)
          if (meter.status === 'TIMEOUT' || meter.status === 'ERROR') {
            return meter;
          }

          let multiplier = scenario.powerMultiplier;
          if (meter.substationId === 'PT-X' && meter.category === 'Portique') {
            multiplier *= scenario.stsMultiplier;
          } else if (meter.substationId === 'PT-Y' && meter.category === 'Reefer') {
            multiplier *= scenario.reeferMultiplier;
          } else if (meter.substationId === 'PT-4' && meter.category === 'Silos') {
            multiplier *= scenario.silosMultiplier;
          }

          // Random jitter between -2.5% and +2.5%
          const jitter = 1 + (Math.random() * 0.05 - 0.025);
          const nominalBase = meter.ratedCurrentA > 0 ? (meter.voltageNominalV * meter.ratedCurrentA * Math.sqrt(3) * 0.0006) : 50;
          
          let newPowerKW = Math.max(0, Number((meter.powerKW * jitter).toFixed(1)));
          // Keep power within bounds of rated capacity
          const maxAllowed = meter.thresholdPmaxKW * 1.05;
          if (newPowerKW > maxAllowed) newPowerKW = maxAllowed * 0.95;

          // Power factor fluctuates slightly
          const pfJitter = (Math.random() * 0.006 - 0.003);
          const newPF = Math.min(0.99, Math.max(0.85, Number((meter.cosPhi + pfJitter).toFixed(3))));

          // Derived electrical quantities
          const newS = newPF > 0 ? Number((newPowerKW / newPF).toFixed(1)) : 0;
          const newQ = Number((Math.sqrt(Math.max(0, newS * newS - newPowerKW * newPowerKW))).toFixed(1));

          // Voltage fluctuation (around nominal +- 1%)
          const vJitter = 1 + (Math.random() * 0.01 - 0.005);
          const newVoltage = meter.voltageV.map(v => Number((v * vJitter).toFixed(1)));
          const newPhaseVoltage = meter.phaseVoltageV.map(v => Number((v * vJitter).toFixed(1)));

          // Current fluctuation proportional to power
          const iJitter = newPowerKW > 0 ? (newPowerKW / (meter.powerKW || 1)) : 1;
          const newCurrent = meter.currentA.map(i => Number((i * iJitter).toFixed(1)));

          // THD fluctuation
          const thdJitter = (Math.random() * 0.4 - 0.2);
          const newThdI = Math.max(1.0, Number((meter.thdI + thdJitter).toFixed(1)));
          const newThdU = Math.max(0.8, Number((meter.thdU + (thdJitter * 0.2)).toFixed(1)));

          // Energy increment (kWh) = power * time step
          const energyIncrement = (newPowerKW * (refreshInterval / 3600000));
          const newEnergy = Number((meter.energyTotalKWh + energyIncrement).toFixed(1));

          // Network latency jitter (10-35ms)
          const newLatency = Math.floor(10 + Math.random() * 25);

          return {
            ...meter,
            powerKW: newPowerKW,
            powerKVAR: newQ,
            powerKVA: newS,
            cosPhi: newPF,
            voltageV: newVoltage,
            phaseVoltageV: newPhaseVoltage,
            currentA: newCurrent,
            thdI: newThdI,
            thdU: newThdU,
            energyTotalKWh: newEnergy,
            latencyMs: newLatency,
            lastUpdate: nowStr
          };
        });
      });

      // Update substation aggregates
      setSubstations(prevSubs => {
        return prevSubs.map(sub => {
          // Calculate sum from meters belonging to this substation
          // We can estimate based on incoming line meter or sum of transformers
          return {
            ...sub,
            lastSync: 'À l’instant'
          };
        });
      });

    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isSimulating, refreshInterval, activeScenario, tariffConfig]);

  // Sync substations aggregates whenever meters change
  useEffect(() => {
    setSubstations(prevSubs => {
      return prevSubs.map(sub => {
        const subMeters = meters.filter(m => m.substationId === sub.id);
        const incomingMeters = subMeters.filter(m => m.category === 'Arrivée MT');
        
        let totalP = 0;
        let totalQ = 0;
        if (incomingMeters.length > 0) {
          totalP = incomingMeters.reduce((acc, m) => acc + m.powerKW, 0);
          totalQ = incomingMeters.reduce((acc, m) => acc + m.powerKVAR, 0);
        } else {
          totalP = subMeters.reduce((acc, m) => acc + m.powerKW, 0);
          totalQ = subMeters.reduce((acc, m) => acc + m.powerKVAR, 0);
        }

        const totalS = Math.sqrt(totalP * totalP + totalQ * totalQ);
        const avgPF = totalS > 0 ? Math.min(0.99, totalP / totalS) : 0.95;
        const avgThdU = subMeters.length > 0 ? (subMeters.reduce((acc, m) => acc + m.thdU, 0) / subMeters.length) : 2.0;
        const avgThdI = subMeters.length > 0 ? (subMeters.reduce((acc, m) => acc + m.thdI, 0) / subMeters.length) : 5.0;
        const onlineCount = subMeters.filter(m => m.status === 'CONNECTED').length;
        const commQual = Number(((onlineCount / (subMeters.length || 1)) * 100).toFixed(1));

        return {
          ...sub,
          powerKW: Number(totalP.toFixed(1)),
          powerKVAR: Number(totalQ.toFixed(1)),
          powerKVA: Number(totalS.toFixed(1)),
          powerFactor: Number(avgPF.toFixed(3)),
          thdU: Number(avgThdU.toFixed(1)),
          thdI: Number(avgThdI.toFixed(1)),
          commQuality: commQual,
          status: commQual < 95 ? 'WARNING' : 'ONLINE'
        };
      });
    });
  }, [meters]);

  // Overall KPIs calculation
  const totalPowerKW = substations.reduce((acc, s) => acc + s.powerKW, 0);
  const totalPowerKVAR = substations.reduce((acc, s) => acc + s.powerKVAR, 0);
  const totalPowerKVA = Math.sqrt(totalPowerKW * totalPowerKW + totalPowerKVAR * totalPowerKVAR);
  const globalPowerFactor = totalPowerKVA > 0 ? Number((totalPowerKW / totalPowerKVA).toFixed(3)) : 0.95;
  const totalMetersCount = meters.length;
  const connectedMetersCount = meters.filter(m => m.status === 'CONNECTED').length;
  const errorMetersCount = totalMetersCount - connectedMetersCount;
  
  // Instantaneous Cost & CO2
  const currentHourlyCostMAD = totalPowerKW * tariffConfig.rates.normalHours;
  const currentHourlyCO2Kg = totalPowerKW * tariffConfig.co2FactorKgPerKWh;

  // Actions
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const acknowledgeAlert = (alertId, operatorName = 'Opérateur DEPA') => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'ACKNOWLEDGED',
          acknowledgedBy: operatorName,
          acknowledgedAt: new Date().toISOString()
        };
      }
      return a;
    }));

    addAuditLogEntry('Acquittement alerte', `Alerte ${alertId} prise en charge par ${operatorName}`, operatorName);
  };

  const resolveAlert = (alertId, note = 'Problème résolu par l’équipe technique') => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'RESOLVED',
          resolutionNote: note,
          resolvedAt: new Date().toISOString()
        };
      }
      return a;
    }));

    // If it was C-704 timeout, restore its communication status
    const targetAlert = alerts.find(a => a.id === alertId);
    if (targetAlert && targetAlert.meterId === 'C-704') {
      setMeters(prev => prev.map(m => m.id === 'C-704' ? { ...m, status: 'CONNECTED', latencyMs: 24, lastUpdate: new Date().toISOString() } : m));
    }

    addAuditLogEntry('Clôture alerte', `Alerte ${alertId} clôturée: ${note}`, 'Superviseur DEPA');
  };

  const simulateFault = (type = 'COMM_LOSS') => {
    const nowStr = new Date().toISOString();
    if (type === 'COMM_LOSS') {
      // Pick a random meter that is currently connected
      const eligible = meters.filter(m => m.status === 'CONNECTED' && m.id !== 'C-704');
      if (eligible.length === 0) return;
      const target = eligible[Math.floor(Math.random() * eligible.length)];
      
      setMeters(prev => prev.map(m => m.id === target.id ? { ...m, status: 'TIMEOUT', latencyMs: 5200 } : m));

      const newAlert = {
        id: `ALT-2026-${String(alerts.length + 1).padStart(3, '0')}`,
        timestamp: nowStr,
        substationId: target.substationId,
        substationCode: target.substationCode,
        meterId: target.id,
        meterLabel: target.label,
        type: 'COMMUNICATION_LOST',
        severity: 'CRITICAL',
        title: `Interruption Modbus TCP/IP sur ${target.code}`,
        description: `Absence de réponse esclave Modbus sur IP ${target.ipAddress}:${target.port} (ID: ${target.slaveId}). Timeout réseau > 5000 ms.`,
        measuredValue: 'Défaut réponse',
        threshold: 'Timeout > 3000 ms',
        status: 'ACTIVE',
        acknowledgedBy: null,
        acknowledgedAt: null,
        resolutionNote: null,
        resolvedAt: null,
      };

      setAlerts(prev => [newAlert, ...prev]);
      addAuditLogEntry('Défaut simulé', `Interruption Modbus injectée sur compteur ${target.code}`, 'Simulateur SCADA');
    } else if (type === 'POWER_SURGE') {
      // Spike power on PT X STS-01
      setMeters(prev => prev.map(m => m.id === 'C-X05' ? { ...m, powerKW: 1350.0, thdI: 14.8 } : m));
      
      const newAlert = {
        id: `ALT-2026-${String(alerts.length + 1).padStart(3, '0')}`,
        timestamp: nowStr,
        substationId: 'PT-X',
        substationCode: 'PT X',
        meterId: 'C-X05',
        meterLabel: 'Départ Enrouleur Portique Quai STS-01',
        type: 'HIGH_POWER',
        severity: 'WARNING',
        title: 'Dépassement du seuil de puissance STS-01',
        description: 'Appel de puissance inhabituel de 1350 kW lors du levage simultané de conteneurs jumeaux 2x20 pieds.',
        measuredValue: '1350 kW',
        threshold: '1200 kW',
        status: 'ACTIVE',
        acknowledgedBy: null,
        acknowledgedAt: null,
        resolutionNote: null,
        resolvedAt: null,
      };

      setAlerts(prev => [newAlert, ...prev]);
      addAuditLogEntry('Défaut simulé', 'Pic de charge simulé sur Portique STS-01', 'Simulateur SCADA');
    } else if (type === 'RESET_ALL') {
      // Restore all meters to connected and clear test alerts
      setMeters(INITIAL_METERS);
      setAlerts(INITIAL_ALERTS);
      addAuditLogEntry('Réinitialisation', 'État nominal restauré sur l’ensemble du SME', 'Admin Système');
    }
  };

  const updateMeterThresholds = (meterId, pmax, pfmin, thdmax) => {
    setMeters(prev => prev.map(m => {
      if (m.id === meterId) {
        return {
          ...m,
          thresholdPmaxKW: Number(pmax),
          thresholdPFmin: Number(pfmin),
          thresholdTHDmax: Number(thdmax),
        };
      }
      return m;
    }));

    addAuditLogEntry('Modification seuil', `Ajustement seuils alarme pour compteur ${meterId} (Pmax: ${pmax}kW, PFmin: ${pfmin}, THD: ${thdmax}%)`, 'Resp. Énergie DEPA');
  };

  const addAuditLogEntry = (action, details, user = 'Opérateur DEPA') => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user,
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]); // keep last 50 entries
  };

  return (
    <EnergyContext.Provider
      value={{
        substations,
        meters,
        alerts,
        isoData,
        tariffConfig,
        activeTab,
        setActiveTab,
        selectedSubstationId,
        setSelectedSubstationId,
        selectedMeterId,
        setSelectedMeterId,
        theme,
        toggleTheme,
        activeScenario,
        setActiveScenario,
        isSimulating,
        setIsSimulating,
        refreshInterval,
        setRefreshInterval,
        currentTime,
        auditLogs,
        // Global calculated KPIs
        totalPowerKW,
        totalPowerKVAR,
        totalPowerKVA,
        globalPowerFactor,
        totalMetersCount,
        connectedMetersCount,
        errorMetersCount,
        currentHourlyCostMAD,
        currentHourlyCO2Kg,
        // Action Handlers
        acknowledgeAlert,
        resolveAlert,
        simulateFault,
        updateMeterThresholds,
        addAuditLogEntry,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};
