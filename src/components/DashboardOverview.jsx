import React from 'react';
import { useEnergy } from '../context/EnergyContext';
import { PortSynopticMap } from './PortSynopticMap';
import { 
  Zap, 
  Activity, 
  Wifi, 
  WifiOff, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldCheck, 
  ChevronRight,
  BarChart3,
  Flame,
  Leaf
} from 'lucide-react';
import { formatNumber, formatCurrency } from '../utils/mathUtils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardOverview = () => {
  const {
    substations,
    meters,
    totalPowerKW,
    totalPowerKVAR,
    totalPowerKVA,
    globalPowerFactor,
    connectedMetersCount,
    totalMetersCount,
    currentHourlyCostMAD,
    currentHourlyCO2Kg,
    setSelectedSubstationId,
    setActiveTab,
    theme
  } = useEnergy();

  // Total Contractual Subscribed Power across 6 substations
  const totalContractPowerKW = substations.reduce((acc, s) => acc + s.contractPowerKW, 0); // 11 300 kW
  const loadPercentage = Number(((totalPowerKW / totalContractPowerKW) * 100).toFixed(1));

  // 24-Hour Load Profile Data (Simulated typical port daily curve with ONEE tariff zones)
  const hourlyLabels = [
    '00h', '01h', '02h', '03h', '04h', '05h',
    '06h', '07h', '08h', '09h', '10h', '11h',
    '12h', '13h', '14h', '15h', '16h', '17h',
    '18h', '19h', '20h', '21h', '22h', '23h'
  ];

  // Base profile shaped by port activity (lower at night, high during day and peak container loading)
  const baseProfile = [
    3400, 3250, 3100, 3150, 3300, 3600,
    4800, 5600, 6100, 6400, 6200, 6350,
    5900, 6100, 6450, 6600, 6300, 6100,
    5800, 6200, 6400, 5900, 4500, 3800
  ];

  // Scale according to current power
  const scale = totalPowerKW / 6000;
  const currentHourlyData = baseProfile.map(v => Math.round(v * scale));

  const chartData = {
    labels: hourlyLabels,
    datasets: [
      {
        label: 'Appel de Puissance Réelle (kW)',
        data: currentHourlyData,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: '#06b6d4',
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: 'Seuil Contractuel Souscrit ONEE (kW)',
        data: Array(24).fill(totalContractPowerKW),
        borderColor: '#ef4444',
        borderDash: [6, 6],
        fill: false,
        borderWidth: 1.5,
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
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#38bdf8',
        bodyColor: '#e2e8f0',
        borderColor: '#1e293b',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-FR')} kW`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: theme === 'dark' ? '#94a3b8' : '#64748b',
          font: { size: 10, family: 'JetBrains Mono' },
        },
      },
      y: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: theme === 'dark' ? '#94a3b8' : '#64748b',
          font: { size: 10, family: 'JetBrains Mono' },
          callback: (value) => `${value} kW`,
        },
        suggestedMin: 2000,
        suggestedMax: 12000,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* 4 High-Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Power Total */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/10 transition"></div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Puissance Instantanée
            </span>
            <div className="p-2 bg-cyan-950/80 text-cyan-400 rounded-xl border border-cyan-800/60">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {formatNumber(totalPowerKW, 1)}
            </span>
            <span className="text-cyan-400 font-semibold text-sm">kW</span>
          </div>

          {/* Load gauge progress */}
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Charge totale : <strong className="text-slate-200">{loadPercentage}%</strong></span>
              <span>Souscrit : {formatNumber(totalContractPowerKW, 0)} kW</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  loadPercentage > 85 ? 'bg-red-500' : loadPercentage > 70 ? 'bg-amber-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(100, loadPercentage)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 2: Global Power Factor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition"></div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Facteur de Puissance
            </span>
            <div className={`p-2 rounded-xl border ${
              globalPowerFactor >= 0.92 
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60' 
                : 'bg-amber-950/80 text-amber-400 border-amber-800/60'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${
              globalPowerFactor >= 0.92 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {globalPowerFactor.toFixed(3)}
            </span>
            <span className="text-xs text-slate-400 font-mono">cos φ</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Seuil ONEE : ≥ 0.920</span>
            <span className={`font-semibold flex items-center gap-1 ${
              globalPowerFactor >= 0.92 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {globalPowerFactor >= 0.92 ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Conforme (Sans pénalité)
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Risque Pénalité tan φ
                </>
              )}
            </span>
          </div>
        </div>

        {/* KPI 3: Modbus TCP/IP Metering Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition"></div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Réseau Modbus TCP/IP
            </span>
            <div className="p-2 bg-blue-950/80 text-blue-400 rounded-xl border border-blue-800/60">
              <Wifi className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {connectedMetersCount}
              <span className="text-slate-500 text-xl font-normal">/{totalMetersCount}</span>
            </span>
            <span className="text-emerald-400 font-semibold text-xs">
              {((connectedMetersCount / totalMetersCount) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Latence moyenne : <strong className="text-slate-200 font-mono">18 ms</strong></span>
            <span className="text-blue-400 font-mono">Port 502 • 6 Postes</span>
          </div>
        </div>

        {/* KPI 4: Instant Cost & CO2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition"></div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Coût & Bilan Carbone
            </span>
            <div className="p-2 bg-emerald-950/80 text-emerald-400 rounded-xl border border-emerald-800/60">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
              {formatNumber(currentHourlyCostMAD, 0)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">DH / heure</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              CO2 : {formatNumber(currentHourlyCO2Kg / 1000, 2)} t/h
            </span>
            <span className="text-slate-400">Tarif MT ONEE</span>
          </div>
        </div>
      </div>

      {/* Interactive Synoptic Map */}
      <PortSynopticMap />

      {/* Grid of the 6 Substations (PT 1, PT X, PT Z, PT 4, PT Y, PT 7) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Supervision des 6 Postes Électriques
            </h2>
            <p className="text-xs text-slate-400">
              Distribution de puissance, facteur de charge et état de communication Modbus TCP/IP
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            Total : 58 Points Instrumentés
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {substations.map((sub) => {
            const loadRatio = Number(((sub.powerKW / sub.contractPowerKW) * 100).toFixed(1));
            const isWarning = sub.status === 'WARNING';

            return (
              <div
                key={sub.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Code, Name & Status */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-extrabold text-base text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {sub.code}
                        </span>
                        <h3 className="font-bold text-slate-200 text-sm">{sub.name}</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{sub.role}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                      isWarning
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    }`}>
                      {sub.status}
                    </span>
                  </div>

                  {/* Existing Meters Badge (CPS Art 2.8) */}
                  {sub.existingMeters > 0 && (
                    <div className="my-2 bg-blue-950/60 border border-blue-800/60 rounded-lg px-2.5 py-1 text-[11px] text-blue-300 flex items-center justify-between">
                      <span>12 Compteurs existants intégrés</span>
                      <span className="text-[10px] font-medium bg-blue-900 px-1.5 py-0.2 rounded">Sans duplication</span>
                    </div>
                  )}

                  {/* Electrical metrics */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Puissance Active P</span>
                      <div className="font-mono font-bold text-slate-100 text-sm">
                        {formatNumber(sub.powerKW, 1)} <span className="text-cyan-400 text-xs">kW</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Puissance Apparente S</span>
                      <div className="font-mono font-bold text-slate-200 text-sm">
                        {formatNumber(sub.powerKVA, 1)} <span className="text-slate-400 text-xs">kVA</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Cos φ</span>
                      <div className={`font-mono font-bold text-sm ${sub.powerFactor >= 0.92 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {sub.powerFactor.toFixed(3)}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">THD-I Courant</span>
                      <div className="font-mono font-bold text-slate-200 text-sm">
                        {sub.thdI.toFixed(1)} <span className="text-slate-400 text-xs">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Load Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Taux de charge</span>
                      <span className="font-mono font-semibold text-slate-200">{loadRatio}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          loadRatio > 85 ? 'bg-red-500' : loadRatio > 70 ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.min(100, loadRatio)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Modbus & Substation Metadata */}
                  <div className="text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800 pt-2">
                    <div className="flex justify-between">
                      <span>Points comptage :</span>
                      <span className="font-mono font-medium text-slate-300">{sub.meterCount} compteurs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passerelle IP :</span>
                      <span className="font-mono text-slate-400">{sub.ipAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={() => {
                    setSelectedSubstationId(sub.id);
                    setActiveTab('measures');
                  }}
                  className="mt-3 w-full py-2 px-3 bg-slate-800 hover:bg-slate-700/80 text-cyan-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition border border-slate-700"
                >
                  <span>Détail Mesures & Registres</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 24h Global Load Curve Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Courbe de Charge Globale Journalière (24h)
            </h3>
            <p className="text-xs text-slate-400">
              Évolution horaire de la puissance active du site Marsa Maroc Agadir par rapport au seuil ONEE
            </p>
          </div>

          {/* Legend of Tariff Zones */}
          <div className="flex items-center space-x-3 text-xs">
            <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded text-[11px]">
              Heures Pleines (06h-18h)
            </span>
            <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[11px]">
              Pointe (18h-22h)
            </span>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[11px]">
              Creuses (22h-06h)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};
