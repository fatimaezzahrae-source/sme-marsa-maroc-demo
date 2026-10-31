import React from 'react';
import { useEnergy } from '../context/EnergyContext';
import { 
  LayoutDashboard, 
  Activity, 
  TrendingUp, 
  BellRing, 
  FileText, 
  Settings,
  Cpu
} from 'lucide-react';

export const Navigation = () => {
  const { activeTab, setActiveTab, alerts, meters } = useEnergy();

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const timeoutMetersCount = meters.filter(m => m.status === 'TIMEOUT' || m.status === 'ERROR').length;

  const navItems = [
    {
      id: 'overview',
      label: 'Tableau de Bord Global',
      sublabel: '6 Postes & Synoptique Port',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'measures',
      label: 'Mesures & Modbus TCP/IP',
      sublabel: 'U, I, P, Q, S, Harmoniques',
      icon: Activity,
      badge: timeoutMetersCount > 0 ? `${timeoutMetersCount} err` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-600/40',
    },
    {
      id: 'iso50001',
      label: 'Performance ISO 50001',
      sublabel: 'IPE, SER Baseline & CUSUM',
      icon: TrendingUp,
      badge: '-8.2%',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-600/40',
    },
    {
      id: 'alerts',
      label: 'Alertes & Incidents',
      sublabel: 'Supervision en Temps Réel',
      icon: BellRing,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-600/40 animate-pulse',
    },
    {
      id: 'reports',
      label: 'Rapports & Revue Énergétique',
      sublabel: 'Synthèses & Exports CSV/PDF',
      icon: FileText,
      badge: null,
    },
    {
      id: 'admin',
      label: 'Administration & Configuration',
      sublabel: '58 Points & Audit Trail',
      icon: Settings,
      badge: '58 pts',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-600/40',
    },
  ];

  return (
    <nav className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 transition-colors no-print">
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-left transition-all duration-150 whitespace-nowrap border ${
                isActive
                  ? 'bg-gradient-to-r from-blue-900/60 to-slate-800 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium border ${item.badgeColor || 'bg-slate-700 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-normal">
                  {item.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
