import React, { useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { 
  Zap, 
  Activity, 
  Sun, 
  Moon, 
  Clock, 
  Play, 
  Pause, 
  AlertTriangle, 
  Info, 
  Gauge, 
  ShieldCheck, 
  Sliders,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { formatNumber, formatCurrency } from '../utils/mathUtils';

export const Header = ({ onOpenAbout }) => {
  const {
    currentTime,
    theme,
    toggleTheme,
    isSimulating,
    setIsSimulating,
    refreshInterval,
    setRefreshInterval,
    activeScenario,
    setActiveScenario,
    tariffConfig,
    totalPowerKW,
    globalPowerFactor,
    connectedMetersCount,
    totalMetersCount,
    currentHourlyCostMAD,
    alerts,
    simulateFault,
    setActiveTab,
  } = useEnergy();

  const [showSimMenu, setShowSimMenu] = useState(false);
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 transition-colors shadow-md">
      {/* Top Banner: Official Port Identity & Status */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
        {/* Left: Port Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-blue-950/80 text-blue-300 px-2.5 py-1 rounded border border-blue-800/60 font-mono font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>MARSA MAROC</span>
            <span className="text-slate-400">|</span>
            <span>DEPA AGADIR</span>
          </div>
          <span className="hidden md:inline text-slate-400">
            Marché n° <strong className="text-slate-200">12/DEPA/2026</strong> — Système de Monitoring Énergétique (SME)
          </span>
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ISO 50001:2018
          </span>
        </div>

        {/* Right: Live Clock & Quick Controls */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Active Alarms Beacon */}
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
              activeAlertsCount > 0
                ? 'bg-red-950/90 text-red-300 border border-red-700/80 hover:bg-red-900/80 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:bg-slate-800'
            }`}
            title="Consulter les alertes"
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${activeAlertsCount > 0 ? 'text-red-400' : 'text-slate-400'}`} />
            <span>{activeAlertsCount} {activeAlertsCount > 1 ? 'Alertes' : 'Alerte'}</span>
          </button>

          {/* Clock */}
          <div className="flex items-center space-x-1.5 text-slate-300 font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="text-slate-500 hidden sm:inline text-[11px]">UTC+1</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-400 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700/60 transition"
            title={theme === 'dark' ? 'Basculer en Mode Clair' : 'Basculer en Mode Sombre'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* About / CPS Context button */}
          <button
            onClick={onOpenAbout}
            className="flex items-center space-x-1 px-2 py-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700/60 transition"
            title="Spécifications & Référentiel CPS"
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Dossier Marché</span>
          </button>
        </div>
      </div>

      {/* Main SCADA Header Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Title & System Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center shadow-lg shadow-blue-900/30 border border-cyan-400/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                SME <span className="text-cyan-400 font-normal">Supervision Énergétique</span>
              </h1>
              <span className="bg-blue-900/60 text-blue-300 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-blue-700/50">
                SCADA v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Postes Électriques Port d'Agadir • Boucle 22 kV • 58 Points de Comptage Modbus TCP/IP
            </p>
          </div>
        </div>

        {/* Quick Instantaneous KPIs Bar */}
        <div className="hidden lg:flex items-center space-x-3 text-xs">
          {/* Active Power */}
          <div className="bg-slate-800/90 border border-slate-700/70 px-3 py-1.5 rounded-lg flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Appel Global P</div>
              <div className="font-mono font-bold text-slate-100 text-sm">
                {formatNumber(totalPowerKW, 1)} <span className="text-cyan-400 text-xs font-normal">kW</span>
              </div>
            </div>
          </div>

          {/* Cos Phi */}
          <div className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 ${
            globalPowerFactor >= 0.92 
              ? 'bg-slate-800/90 border-slate-700/70' 
              : 'bg-amber-950/60 border-amber-800 text-amber-200'
          }`}>
            <Activity className={`w-4 h-4 ${globalPowerFactor >= 0.92 ? 'text-emerald-400' : 'text-amber-400'}`} />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Cos φ Moyen</div>
              <div className="font-mono font-bold text-sm">
                {globalPowerFactor.toFixed(3)}
              </div>
            </div>
          </div>

          {/* Connected Meters */}
          <div className="bg-slate-800/90 border border-slate-700/70 px-3 py-1.5 rounded-lg flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${connectedMetersCount === totalMetersCount ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Comptage Modbus</div>
              <div className="font-mono font-bold text-slate-100 text-sm">
                {connectedMetersCount}/{totalMetersCount} <span className="text-slate-400 text-xs font-normal">pts</span>
              </div>
            </div>
          </div>

          {/* Instant Cost */}
          <div className="bg-slate-800/90 border border-slate-700/70 px-3 py-1.5 rounded-lg flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Coût Électrique</div>
              <div className="font-mono font-bold text-slate-100 text-sm">
                {formatNumber(currentHourlyCostMAD, 0)} <span className="text-emerald-400 text-xs font-normal">DH/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Scenario & Engine Controls */}
        <div className="flex items-center space-x-2">
          {/* Scenario Selector */}
          <div className="relative">
            <select
              value={activeScenario}
              onChange={(e) => setActiveScenario(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium cursor-pointer pr-7"
            >
              {tariffConfig.scenarios.map(sc => (
                <option key={sc.id} value={sc.id}>
                  ⚙️ Scénario : {sc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isSimulating
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/80'
                : 'bg-amber-950/80 text-amber-300 border-amber-800/80 hover:bg-amber-900/80'
            }`}
            title={isSimulating ? 'Mettre en pause la simulation Modbus' : 'Reprendre la simulation Modbus'}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Simulation Active</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">En Pause</span>
              </>
            )}
          </button>

          {/* Fault Simulation Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSimMenu(!showSimMenu)}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition"
              title="Injecter un incident SCADA (Test de conformité T04/T10)"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline font-medium">Injecter Incident</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown Menu for Fault Injections */}
            {showSimMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs"
                onMouseLeave={() => setShowSimMenu(false)}
              >
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Tests Fonctionnels CPS (Art. 2.6)
                </div>
                
                <button
                  onClick={() => { simulateFault('COMM_LOSS'); setShowSimMenu(false); }}
                  className="w-full text-left px-2.5 py-2 hover:bg-red-950/50 hover:text-red-200 text-slate-200 rounded-lg flex items-center space-x-2 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <div>
                    <div className="font-semibold text-red-400">Coupure Modbus TCP/IP</div>
                    <div className="text-[10px] text-slate-400">Simule timeout & perte com compteur</div>
                  </div>
                </button>

                <button
                  onClick={() => { simulateFault('POWER_SURGE'); setShowSimMenu(false); }}
                  className="w-full text-left px-2.5 py-2 hover:bg-amber-950/50 hover:text-amber-200 text-slate-200 rounded-lg flex items-center space-x-2 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <div>
                    <div className="font-semibold text-amber-400">Pic de Puissance STS-01</div>
                    <div className="text-[10px] text-slate-400">Dépassement de seuil souscrit</div>
                  </div>
                </button>

                <button
                  onClick={() => { simulateFault('RESET_ALL'); setShowSimMenu(false); }}
                  className="w-full text-left px-2.5 py-2 hover:bg-emerald-950/50 hover:text-emerald-200 text-slate-200 rounded-lg flex items-center space-x-2 transition mt-1 border-t border-slate-800"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <div>
                    <div className="font-semibold text-emerald-400">Réinitialiser l'état nominal</div>
                    <div className="text-[10px] text-slate-400">Rétablir 100% des compteurs</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
