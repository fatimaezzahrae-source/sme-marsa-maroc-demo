import React, { useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { 
  Activity, 
  Zap, 
  Wifi, 
  Clock, 
  Cpu, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  BarChart3, 
  Calendar,
  Layers,
  ArrowRight,
  Terminal,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { formatNumber, formatDateTime, formatTimeOnly, generateModbusFrameHex, generateModbusResponseHex } from '../utils/mathUtils';
import { Line } from 'react-chartjs-2';

export const SubstationDetails = () => {
  const {
    substations,
    meters,
    selectedSubstationId,
    setSelectedSubstationId,
    selectedMeterId,
    setSelectedMeterId,
    theme
  } = useEnergy();

  const [timeRange, setTimeRange] = useState('24h'); // '24h', '7d', '30d'
  const [selectedMetric, setSelectedMetric] = useState('power'); // 'power', 'current', 'pf'
  const [showModbusInspector, setShowModbusInspector] = useState(true);

  // Current Substation & Meters
  const currentSub = substations.find(s => s.id === selectedSubstationId) || substations[0];
  const subMeters = meters.filter(m => m.substationId === currentSub.id);
  const currentMeter = subMeters.find(m => m.id === selectedMeterId) || subMeters[0] || meters[0];

  // Modbus Data Freshness Check (CPS Art. 2.3)
  const isFresh = currentMeter.status === 'CONNECTED';
  const lastSyncDate = new Date(currentMeter.lastUpdate);
  const ageSeconds = Math.max(1, Math.round((Date.now() - lastSyncDate.getTime()) / 1000));

  // Time-series mock data generator based on range
  const getTimeSeriesData = () => {
    let labels = [];
    let values = [];
    const baseP = currentMeter.powerKW;

    if (timeRange === '24h') {
      labels = ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'];
      const profile = [0.55, 0.52, 0.58, 0.75, 0.95, 1.05, 0.98, 1.02, 1.08, 0.96, 0.88, 0.70];
      values = profile.map(p => Number((baseP * p).toFixed(1)));
    } else if (timeRange === '7d') {
      labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const profile = [0.95, 1.02, 1.05, 0.98, 1.10, 0.85, 0.75];
      values = profile.map(p => Number((baseP * p).toFixed(1)));
    } else {
      labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
      const profile = [0.98, 1.04, 1.01, 1.06];
      values = profile.map(p => Number((baseP * p).toFixed(1)));
    }

    return { labels, values };
  };

  const { labels, values } = getTimeSeriesData();

  const chartData = {
    labels,
    datasets: [
      {
        label: selectedMetric === 'power' ? 'Puissance Active P (kW)' : selectedMetric === 'current' ? 'Courant Moyen (A)' : 'Facteur de Puissance cos φ',
        data: values,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.3,
        borderWidth: 2.5,
        pointBackgroundColor: '#06b6d4',
        pointRadius: 4,
      },
      {
        label: 'Seuil Alerte Configuré',
        data: Array(labels.length).fill(currentMeter.thresholdPmaxKW),
        borderColor: '#f59e0b',
        borderDash: [5, 5],
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#cbd5e1' : '#334155',
          font: { size: 11, family: 'Inter' },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#38bdf8',
        bodyColor: '#e2e8f0',
        borderColor: '#1e293b',
        borderWidth: 1,
        padding: 8,
      },
    },
    scales: {
      x: {
        grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b', font: { family: 'JetBrains Mono' } },
      },
      y: {
        grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b', font: { family: 'JetBrains Mono' } },
      },
    },
  };

  // Modbus Registers table
  const modbusRegisters = [
    { reg: 40001, name: 'Tension Composée U12', type: 'Float32', value: currentMeter.phaseVoltageV ? currentMeter.phaseVoltageV[0].toFixed(1) : '-', unit: 'V' },
    { reg: 40003, name: 'Tension Composée U23', type: 'Float32', value: currentMeter.phaseVoltageV ? currentMeter.phaseVoltageV[1].toFixed(1) : '-', unit: 'V' },
    { reg: 40005, name: 'Tension Composée U31', type: 'Float32', value: currentMeter.phaseVoltageV ? currentMeter.phaseVoltageV[2].toFixed(1) : '-', unit: 'V' },
    { reg: 40007, name: 'Tension Simple V1', type: 'Float32', value: currentMeter.voltageV ? currentMeter.voltageV[0].toFixed(1) : '-', unit: 'V' },
    { reg: 40009, name: 'Tension Simple V2', type: 'Float32', value: currentMeter.voltageV ? currentMeter.voltageV[1].toFixed(1) : '-', unit: 'V' },
    { reg: 40011, name: 'Tension Simple V3', type: 'Float32', value: currentMeter.voltageV ? currentMeter.voltageV[2].toFixed(1) : '-', unit: 'V' },
    { reg: 40013, name: 'Courant Ligne I1', type: 'Float32', value: currentMeter.currentA ? currentMeter.currentA[0].toFixed(1) : '-', unit: 'A' },
    { reg: 40015, name: 'Courant Ligne I2', type: 'Float32', value: currentMeter.currentA ? currentMeter.currentA[1].toFixed(1) : '-', unit: 'A' },
    { reg: 40017, name: 'Courant Ligne I3', type: 'Float32', value: currentMeter.currentA ? currentMeter.currentA[2].toFixed(1) : '-', unit: 'A' },
    { reg: 40019, name: 'Puissance Active P', type: 'Float32', value: currentMeter.powerKW.toFixed(1), unit: 'kW' },
    { reg: 40021, name: 'Puissance Réactive Q', type: 'Float32', value: currentMeter.powerKVAR.toFixed(1), unit: 'kVAR' },
    { reg: 40023, name: 'Puissance Apparente S', type: 'Float32', value: currentMeter.powerKVA.toFixed(1), unit: 'kVA' },
    { reg: 40025, name: 'Facteur de Puissance PF', type: 'Float32', value: currentMeter.cosPhi.toFixed(3), unit: '-' },
    { reg: 40027, name: 'Fréquence Réseau f', type: 'Float32', value: currentMeter.freqHz.toFixed(2), unit: 'Hz' },
    { reg: 40029, name: 'Distorsion THD-I', type: 'Float32', value: currentMeter.thdI.toFixed(1), unit: '%' },
    { reg: 40031, name: 'Énergie Totale Active', type: 'Float32', value: currentMeter.energyTotalKWh.toFixed(0), unit: 'kWh' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Selection Ribbon: Substations Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sélectionner un Poste Électrique :
          </span>
          <span className="text-xs font-mono text-cyan-400">
            Poste actuel : {currentSub.code} ({currentSub.name})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {substations.map(sub => {
            const isSelected = sub.id === currentSub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubstationId(sub.id);
                  // pick first meter of this substation
                  const firstMeter = meters.find(m => m.substationId === sub.id);
                  if (firstMeter) setSelectedMeterId(firstMeter.id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-900/60 border-cyan-400 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs">{sub.code}</span>
                  <span className={`w-2 h-2 rounded-full ${sub.status === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                </div>
                <div className="text-[11px] font-semibold text-slate-200 mt-1 truncate">
                  {sub.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {sub.meterCount} compteurs
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Substation & Meter Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Meters in this Substation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Points de Comptage ({subMeters.length})
              </h3>
              <p className="text-[11px] text-slate-400">Poste {currentSub.code}</p>
            </div>
            {currentSub.existingMeters > 0 && (
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono">
                12 Déjà Instrumentés
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {subMeters.map(meter => {
              const isSelected = meter.id === currentMeter.id;
              const isTimeout = meter.status === 'TIMEOUT' || meter.status === 'ERROR';

              return (
                <div
                  key={meter.id}
                  onClick={() => setSelectedMeterId(meter.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-cyan-300">
                      {meter.code}
                    </span>
                    <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                      isTimeout
                        ? 'bg-red-950/80 text-red-300 border-red-800 animate-pulse'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    }`}>
                      {meter.status}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-100 line-clamp-1">
                    {meter.label}
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-slate-400">
                    <span>P: <strong className="text-white">{meter.powerKW.toFixed(1)} kW</strong></span>
                    <span>cos φ: <strong className={meter.cosPhi >= 0.92 ? 'text-emerald-400' : 'text-amber-400'}>{meter.cosPhi.toFixed(3)}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right Column (2 spans): Real-time Electrical Measurements Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header of Active Meter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-extrabold text-lg text-cyan-400 bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    {currentMeter.code}
                  </span>
                  <h2 className="text-base font-bold text-white">
                    {currentMeter.label}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Catégorie : <strong className="text-slate-200">{currentMeter.category}</strong> • Modèle : <strong className="text-slate-200">{currentMeter.model}</strong> • S/N : {currentMeter.serialNumber}
                </p>
              </div>

              {/* Data Freshness & Modbus Communication Status (CPS Art. 2.3) */}
              <div className="flex flex-col items-end">
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-mono font-semibold border ${
                  isFresh
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : 'bg-red-950/80 text-red-300 border-red-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isFresh ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`}></span>
                  <span>{isFresh ? 'DONNÉE EN DIRECT' : 'COMMUNICATION PERDUE'}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Dernier horodatage : {formatDateTime(currentMeter.lastUpdate)}</span>
                  {isFresh ? (
                    <span className="text-emerald-400">({currentMeter.latencyMs} ms)</span>
                  ) : (
                    <span className="text-red-400 font-bold">(Âge &gt; {ageSeconds}s)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Note on Data Quality (ISO 50001 & CPS Art. 2.3) */}
            {!isFresh && (
              <div className="mt-3 p-2.5 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  <strong>Avertissement Qualité de Mesure (CPS Art. 2.3) :</strong> La communication Modbus TCP/IP est interrompue avec cet esclave. La plateforme maintient l'horodatage certifié de la dernière mesure valide reçue et ne simule pas de mesure temps réel fictive.
                </span>
              </div>
            )}
          </div>

          {/* 3-Phase Electrical Measurements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Tensions Simples V */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-md">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Tensions Simples (V)</span>
              <div className="mt-2 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">V1-N :</span>
                  <span className="font-bold text-white">{currentMeter.voltageV ? currentMeter.voltageV[0].toFixed(1) : '-'} V</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">V2-N :</span>
                  <span className="font-bold text-white">{currentMeter.voltageV ? currentMeter.voltageV[1].toFixed(1) : '-'} V</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">V3-N :</span>
                  <span className="font-bold text-white">{currentMeter.voltageV ? currentMeter.voltageV[2].toFixed(1) : '-'} V</span>
                </div>
              </div>
            </div>

            {/* Tensions Composées U */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-md">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Tensions Composées (U)</span>
              <div className="mt-2 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">U12 :</span>
                  <span className="font-bold text-cyan-300">{currentMeter.phaseVoltageV ? currentMeter.phaseVoltageV[0].toFixed(1) : '-'} V</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">U23 :</span>
                  <span className="font-bold text-cyan-300">{currentMeter.phaseVoltageV ? currentMeter.phaseVoltageV[1].toFixed(1) : '-'} V</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">U31 :</span>
                  <span className="font-bold text-cyan-300">{currentMeter.phaseVoltageV ? currentMeter.phaseVoltageV[2].toFixed(1) : '-'} V</span>
                </div>
              </div>
            </div>

            {/* Courants par phase I */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-md">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Courants de Phase (A)</span>
              <div className="mt-2 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Phase 1 (I1) :</span>
                  <span className="font-bold text-amber-300">{currentMeter.currentA ? currentMeter.currentA[0].toFixed(1) : '-'} A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Phase 2 (I2) :</span>
                  <span className="font-bold text-amber-300">{currentMeter.currentA ? currentMeter.currentA[1].toFixed(1) : '-'} A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Phase 3 (I3) :</span>
                  <span className="font-bold text-amber-300">{currentMeter.currentA ? currentMeter.currentA[2].toFixed(1) : '-'} A</span>
                </div>
              </div>
            </div>

            {/* Harmoniques THD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-md">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Qualité Réseau & THD</span>
              <div className="mt-2 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">THD Tension :</span>
                  <span className="font-bold text-white">{currentMeter.thdU.toFixed(1)} %</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">THD Courant :</span>
                  <span className={`font-bold ${currentMeter.thdI > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {currentMeter.thdI.toFixed(1)} %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Fréquence :</span>
                  <span className="font-bold text-cyan-300">{currentMeter.freqHz.toFixed(2)} Hz</span>
                </div>
              </div>
            </div>
          </div>

          {/* Power Trio (P, Q, S) and Cumulative Energy */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase">Puissance Active P</span>
              <div className="font-mono font-extrabold text-xl text-white mt-1">
                {currentMeter.powerKW.toFixed(1)} <span className="text-xs text-cyan-400 font-normal">kW</span>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase">Puissance Réactive Q</span>
              <div className="font-mono font-extrabold text-xl text-white mt-1">
                {currentMeter.powerKVAR.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kVAR</span>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase">Facteur Cos φ</span>
              <div className={`font-mono font-extrabold text-xl mt-1 ${currentMeter.cosPhi >= 0.92 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {currentMeter.cosPhi.toFixed(3)}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase">Énergie Cumulée Totale</span>
              <div className="font-mono font-extrabold text-xl text-cyan-400 mt-1">
                {formatNumber(currentMeter.energyTotalKWh, 0)} <span className="text-xs text-slate-400 font-normal">kWh</span>
              </div>
            </div>
          </div>

          {/* Time Series Load Curve for this Meter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Courbe de Charge — {currentMeter.code} ({currentMeter.label})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Historique d'évolution temporelle avec seuils contractuels
                </p>
              </div>

              {/* Range Selector */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setTimeRange('24h')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    timeRange === '24h' ? 'bg-cyan-500 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  24 Heures
                </button>
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    timeRange === '7d' ? 'bg-cyan-500 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  7 Jours
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    timeRange === '30d' ? 'bg-cyan-500 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  30 Jours
                </button>
              </div>
            </div>

            <div className="h-56 w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Modbus TCP/IP Live Registers & Frame Inspector Toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Console d'Inspection Registres Modbus TCP/IP
                </h3>
                <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                  IP: {currentMeter.ipAddress}:{currentMeter.port} (Unit ID: {currentMeter.slaveId})
                </span>
              </div>

              <button
                onClick={() => setShowModbusInspector(!showModbusInspector)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                {showModbusInspector ? 'Masquer' : 'Afficher'}
              </button>
            </div>

            {showModbusInspector && (
              <div className="space-y-4">
                {/* Modbus Request/Response Frame Hex Simulation */}
                <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-1">
                    <span>Trame Modbus TCP/IP (Code Fonction 0x03 — Read Holding Registers)</span>
                    <span className="text-cyan-400">Transaction ID #0A12</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold shrink-0">[REQ] :</span>
                    <span className="text-slate-300">
                      {generateModbusFrameHex(0x0A12, currentMeter.slaveId, 0x03, 40001, 16)}
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-cyan-400 font-bold shrink-0">[RESP] :</span>
                    <span className="text-slate-300">
                      {generateModbusResponseHex(0x0A12, currentMeter.slaveId, 0x03, currentMeter.powerKW)}
                    </span>
                  </div>
                </div>

                {/* Modbus Register Mapping Table */}
                <div className="overflow-x-auto max-h-56 scrollbar-thin">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950/80 text-slate-400 sticky top-0 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Registre</th>
                        <th className="py-2 px-3">Grandeur Électrique</th>
                        <th className="py-2 px-3">Format</th>
                        <th className="py-2 px-3">Valeur Ligne</th>
                        <th className="py-2 px-3">Unité</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {modbusRegisters.map(r => (
                        <tr key={r.reg} className="hover:bg-slate-800/40">
                          <td className="py-1.5 px-3 text-cyan-400 font-semibold">{r.reg}</td>
                          <td className="py-1.5 px-3 font-sans text-slate-200">{r.name}</td>
                          <td className="py-1.5 px-3 text-slate-400">{r.type}</td>
                          <td className="py-1.5 px-3 font-bold text-white">{r.value}</td>
                          <td className="py-1.5 px-3 text-slate-400">{r.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
