import React, { useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { 
  Zap, 
  Layers, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Anchor, 
  Truck, 
  Snowflake, 
  Wheat, 
  Wrench,
  Maximize2
} from 'lucide-react';
import { formatNumber } from '../utils/mathUtils';

export const PortSynopticMap = () => {
  const { substations, setSelectedSubstationId, setActiveTab } = useEnergy();
  const [hoveredSubstation, setHoveredSubstation] = useState(null);

  const handleSubstationClick = (subId) => {
    setSelectedSubstationId(subId);
    setActiveTab('measures');
  };

  const getSubstationIcon = (code) => {
    switch (code) {
      case 'PT 1': return Anchor;
      case 'PT X': return Layers; // Container STS
      case 'PT Z': return Truck;  // Mobile cranes
      case 'PT 4': return Wheat;  // Silos
      case 'PT Y': return Snowflake; // Reefer
      case 'PT 7': return Wrench; // Shipyard slipway
      default: return Zap;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden transition-colors">
      {/* Top Header of Map */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-950/70 text-cyan-400 rounded-lg border border-blue-800/60">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Synoptique Portuaire SCADA — Boucle MT 22 kV
              <span className="text-[10px] font-mono font-normal bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                Port d'Agadir
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Interconnexion des 6 Postes Transformateurs • Clic sur un poste pour inspecter ses compteurs
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Nominal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>Avertissement</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-0.5 bg-cyan-400 border-dashed border-b border-cyan-300"></span>
            <span>Boucle 22 kV</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Surface */}
      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 rounded-xl border border-slate-800/80 overflow-hidden scada-grid-bg">
        {/* Harbor Water / Basin Graphic Representation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Water background polygon representing Agadir port basin */}
          <path
            d="M 0,0 L 400,0 L 400,120 L 320,180 L 260,260 L 150,300 L 0,300 Z"
            fill="rgba(2, 132, 199, 0.06)"
            stroke="rgba(2, 132, 199, 0.15)"
            strokeWidth="1"
          />

          {/* Docks / Quays outlines */}
          <path
            d="M 120,60 L 320,60"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
          <text x="140" y="52" fill="rgba(148, 163, 184, 0.5)" fontSize="9" fontFamily="monospace">QUAI NORD (CONTENEURS)</text>

          <path
            d="M 240,110 L 360,110"
            stroke="rgba(56, 189, 248, 0.2)"
            strokeWidth="2"
          />
          <text x="250" y="103" fill="rgba(148, 163, 184, 0.5)" fontSize="9" fontFamily="monospace">QUAI VRAC & SILOS</text>

          <path
            d="M 80,180 L 220,180"
            stroke="rgba(56, 189, 248, 0.2)"
            strokeWidth="2"
          />
          <text x="90" y="173" fill="rgba(148, 163, 184, 0.5)" fontSize="9" fontFamily="monospace">QUAI OUEST (OUTILLAGE)</text>

          {/* 22 kV Loop connecting the substations */}
          {/* PT 1 (25%, 72%) -> PT Y (42%, 78%) -> PT 4 (82%, 48%) -> PT X (68%, 30%) -> PT Z (52%, 55%) -> PT 7 (18%, 38%) -> PT 1 */}
          <path
            d="M 180,240 L 280,270 L 600,180 L 520,105 L 380,190 L 130,135 Z"
            fill="none"
            stroke="rgba(6, 182, 212, 0.45)"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            className="animate-pulse"
          />

          {/* ONEE Power Injection Point */}
          <circle cx="60" cy="285" r="5" fill="#f59e0b" />
          <line x1="60" y1="285" x2="180" y2="240" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
          <text x="30" y="305" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">ARRIVÉE MT ONEE 22 kV</text>
        </svg>

        {/* Substation Nodes */}
        {substations.map((sub) => {
          const SubIcon = getSubstationIcon(sub.code);
          const isWarning = sub.status === 'WARNING';
          const isHovered = hoveredSubstation === sub.id;

          return (
            <div
              key={sub.id}
              onClick={() => handleSubstationClick(sub.id)}
              onMouseEnter={() => setHoveredSubstation(sub.id)}
              onMouseLeave={() => setHoveredSubstation(null)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10"
              style={{ left: `${sub.coordX}%`, top: `${sub.coordY}%` }}
            >
              {/* Outer Pulse Beacon if warning */}
              {isWarning && (
                <span className="absolute -inset-2 rounded-xl bg-amber-500/30 animate-scada-ping"></span>
              )}

              {/* Node Card */}
              <div className={`p-2.5 rounded-xl border transition-all duration-200 shadow-xl backdrop-blur-md flex items-center space-x-2.5 ${
                isHovered
                  ? 'bg-slate-800 text-white border-cyan-400 scale-110 shadow-cyan-500/30 ring-2 ring-cyan-500/40'
                  : isWarning
                    ? 'bg-slate-900/90 text-amber-200 border-amber-600/80 shadow-amber-900/40'
                    : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:border-slate-500'
              }`}>
                {/* Icon with status dot */}
                <div className={`relative p-2 rounded-lg ${
                  isWarning ? 'bg-amber-950/80 text-amber-300' : 'bg-blue-950/80 text-cyan-400'
                }`}>
                  <SubIcon className="w-4 h-4" />
                  <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 ${
                    isWarning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                  }`} />
                </div>

                {/* Substation Info */}
                <div className="text-left">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-xs text-white tracking-wide">
                      {sub.code}
                    </span>
                    {sub.existingMeters > 0 && (
                      <span className="text-[9px] bg-blue-950 text-blue-300 border border-blue-800 px-1 rounded" title="Poste historique instrumenté (CPS Art 2.8)">
                        Existant
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xs font-semibold text-cyan-300">
                    {formatNumber(sub.powerKW, 0)} <span className="text-[10px] text-slate-400">kW</span>
                  </div>
                </div>
              </div>

              {/* Detailed Floating Tooltip on Hover */}
              {isHovered && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 bg-slate-900 border border-cyan-500/80 rounded-xl p-3 shadow-2xl z-30 text-xs pointer-events-none">
                  <div className="font-bold text-white text-xs mb-1 border-b border-slate-800 pb-1 flex justify-between">
                    <span>{sub.name}</span>
                    <span className="font-mono text-cyan-400">{sub.code}</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Points de comptage:</span>
                      <span className="font-mono font-semibold">{sub.meterCount} compteurs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Facteur cos φ:</span>
                      <span className={`font-mono font-semibold ${sub.powerFactor >= 0.92 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {sub.powerFactor.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Qualité Modbus:</span>
                      <span className="font-mono text-emerald-400">{sub.commQuality}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Passerelle IP:</span>
                      <span className="font-mono text-slate-300">{sub.ipAddress}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-cyan-400 font-semibold flex items-center justify-center gap-1 border-t border-slate-800 pt-1">
                    <Maximize2 className="w-3 h-3" />
                    Cliquer pour ouvrir les mesures
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Floating Quick Stats in corner */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 space-y-1 hidden sm:block">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-slate-400">Tension MT Réseau:</span>
            <strong className="text-white font-mono">22.0 kV ± 1%</strong>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-400">Fréquence Réseau:</span>
            <strong className="text-white font-mono">50.01 Hz</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
