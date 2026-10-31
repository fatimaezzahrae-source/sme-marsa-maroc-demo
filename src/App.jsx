import React, { useState } from 'react';
import { EnergyProvider, useEnergy } from './context/EnergyContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardOverview } from './components/DashboardOverview';
import { SubstationDetails } from './components/SubstationDetails';
import { EnergyPerformance } from './components/EnergyPerformance';
import { AlertConsole } from './components/AlertConsole';
import { ReportingModule } from './components/ReportingModule';
import { AdminPanel } from './components/AdminPanel';
import { AboutModal } from './components/AboutModal';
import { ShieldCheck, Zap, Activity } from 'lucide-react';

const AppContent = () => {
  const { activeTab } = useEnergy();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col transition-colors">
      {/* SCADA Industrial Header */}
      <Header onOpenAbout={() => setIsAboutOpen(true)} />

      {/* Main Module Tabs Navigation */}
      <Navigation />

      {/* Dynamic Module Content View */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'measures' && <SubstationDetails />}
        {activeTab === 'iso50001' && <EnergyPerformance />}
        {activeTab === 'alerts' && <AlertConsole />}
        {activeTab === 'reports' && <ReportingModule />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Industrial Footer (hidden in print) */}
      <footer className="bg-slate-900 border-t border-slate-800/80 px-4 py-3 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-slate-300">Marsa Maroc — Direction d'Exploitation au Port d'Agadir (DEPA)</span>
            <span className="text-slate-600">|</span>
            <span>Marché n° 12/DEPA/2026</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="text-cyan-400 font-mono">Protocole : Modbus TCP/IP (Port 502)</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              SMI Certifié ISO 9001 • 14001 • 45001 • 50001
            </span>
            <span className="text-slate-500 hidden sm:inline">v2.4.0-scada</span>
          </div>
        </div>
      </footer>

      {/* Official CPS & ISO Context Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <EnergyProvider>
      <AppContent />
    </EnergyProvider>
  );
}
