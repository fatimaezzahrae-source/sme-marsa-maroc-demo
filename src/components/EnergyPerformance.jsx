import React, { useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  BarChart2, 
  PieChart, 
  ArrowDownRight, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Layers, 
  Leaf, 
  DollarSign, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { formatNumber, formatCurrency } from '../utils/mathUtils';
import { Line, Bar } from 'react-chartjs-2';

export const EnergyPerformance = () => {
  const { isoData, tariffConfig, theme } = useEnergy();
  const [activeSubTab, setActiveSubTab] = useState('indicators'); // 'indicators', 'baseline', 'pareto', 'flow', 'actions'

  // Monthly Baseline vs Real Chart
  const months = isoData.monthlyData.map(d => d.month);
  const realKWh = isoData.monthlyData.map(d => d.realKWh / 1000); // in MWh
  const baselineKWh = isoData.monthlyData.map(d => d.baselineKWh / 1000);
  const cusumKWh = isoData.monthlyData.map(d => d.cusumKWh / 1000);

  const baselineChartData = {
    labels: months,
    datasets: [
      {
        type: 'bar',
        label: 'Consommation Réelle Observée (MWh)',
        data: realKWh,
        backgroundColor: 'rgba(6, 182, 212, 0.7)',
        borderRadius: 6,
        order: 2,
      },
      {
        type: 'bar',
        label: 'Référence SER Normalisée (MWh)',
        data: baselineKWh,
        backgroundColor: 'rgba(100, 116, 139, 0.4)',
        borderRadius: 6,
        order: 3,
      },
      {
        type: 'line',
        label: 'Économie Cumulée CUSUM (MWh)',
        data: cusumKWh,
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
        yAxisID: 'y1',
        order: 1,
      }
    ],
  };

  const baselineChartOptions = {
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
        padding: 10,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-FR')} MWh`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b' },
      },
      y: {
        grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          color: theme === 'dark' ? '#94a3b8' : '#64748b',
          callback: (v) => `${v} MWh`,
        },
        title: { display: true, text: 'Consommation Mensuelle (MWh)', color: '#94a3b8' },
      },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#10b981',
          callback: (v) => `+${v} MWh`,
        },
        title: { display: true, text: 'CUSUM Gains (MWh)', color: '#10b981' },
      },
    },
  };

  // Pareto Chart (Bar + Cumulative Line)
  const paretoLabels = isoData.paretoItems.map(p => p.label.split(' - ')[0]);
  const paretoPower = isoData.paretoItems.map(p => p.powerKW);
  const paretoCumulative = isoData.paretoItems.map(p => p.cumulativePercent);

  const paretoChartData = {
    labels: paretoLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Puissance Absorbée (kW)',
        data: paretoPower,
        backgroundColor: '#0284c7',
        borderRadius: 6,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line',
        label: 'Pourcentage Cumulé (%)',
        data: paretoCumulative,
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        pointBackgroundColor: '#f59e0b',
        pointRadius: 4,
        yAxisID: 'y1',
        order: 1,
      }
    ],
  };

  const paretoChartOptions = {
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
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b', font: { size: 10 } },
      },
      y: {
        grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b' },
        title: { display: true, text: 'Puissance (kW)', color: '#94a3b8' },
      },
      y1: {
        position: 'right',
        max: 100,
        min: 0,
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#f59e0b',
          callback: (v) => `${v}%`,
        },
        title: { display: true, text: 'Cumul 80/20 (%)', color: '#f59e0b' },
      },
    },
  };

  // Cumulative Totals
  const totalSavingsKWh = isoData.monthlyData.reduce((acc, m) => acc + m.savingsKWh, 0);
  const totalFinancialGainsMAD = totalSavingsKWh * tariffConfig.rates.averageBlendedRate;
  const totalAvoidedCO2Tons = (totalSavingsKWh * tariffConfig.co2FactorKgPerKWh) / 1000;

  return (
    <div className="space-y-6">
      {/* Top Banner: ISO 50001 Framework */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">
                Système de Management de l'Énergie (ISO 50001:2018)
              </h2>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[11px] font-mono">
                DEPA Agadir Certifiée
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Suivi officiel des IPE, Situation Énergétique de Référence (SER) et Revue Énergétique Continue
            </p>
          </div>
        </div>

        {/* Global Performance Gains Badges */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-900/90 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
            <div className="text-[10px] text-slate-400">Économies 2026 vs SER</div>
            <div className="font-mono font-bold text-emerald-400 text-sm">
              +{formatNumber(totalSavingsKWh / 1000, 1)} MWh
            </div>
          </div>

          <div className="bg-slate-900/90 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
            <div className="text-[10px] text-slate-400">Gain Financier Net</div>
            <div className="font-mono font-bold text-emerald-400 text-sm">
              +{formatNumber(totalFinancialGainsMAD, 0)} DH
            </div>
          </div>

          <div className="bg-slate-900/90 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
            <div className="text-[10px] text-slate-400">CO2 Évité</div>
            <div className="font-mono font-bold text-emerald-400 text-sm">
              {formatNumber(totalAvoidedCO2Tons, 1)} tonnes
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('indicators')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
            activeSubTab === 'indicators'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Indicateurs IPE (EnPIs)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('baseline')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
            activeSubTab === 'baseline'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Situation de Référence (SER) & CUSUM</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pareto')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
            activeSubTab === 'pareto'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Diagramme de Pareto (80/20)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('flow')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
            activeSubTab === 'flow'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Flux d'Énergie & Usages</span>
        </button>

        <button
          onClick={() => setActiveSubTab('actions')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
            activeSubTab === 'actions'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Plan d'Actions Énergétiques (PAE)</span>
        </button>
      </div>

      {/* Sub-Tab 1: IPE Cards Grid */}
      {activeSubTab === 'indicators' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Indicateurs de Performance Énergétique documentés et validés par le Responsable Énergie DEPA (CPS Art. 2.4).
            </span>
            <span className="font-mono text-cyan-400">Période de revue : {isoData.energyReviewPeriod}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isoData.indicators.map(ipe => {
              const isImproved = ipe.deltaVsBaseline < 0 || ipe.id === 'IPE-06';
              return (
                <div
                  key={ipe.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-xs bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
                        {ipe.code}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                        ipe.status === 'GOOD'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950/80 text-amber-300 border-amber-800'
                      }`}>
                        {ipe.status === 'GOOD' ? 'CONFORME CIBLE' : 'ATTENTION'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white">{ipe.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">{ipe.description}</p>

                    <div className="mt-2 text-[10px] font-mono bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 text-slate-400">
                      Formule : <span className="text-slate-300">{ipe.formula}</span>
                    </div>

                    {/* Metric comparison */}
                    <div className="grid grid-cols-3 gap-2 my-3 text-xs bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80 text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase">Actuel</span>
                        <div className="font-mono font-bold text-white text-sm mt-0.5">
                          {ipe.currentValue}
                        </div>
                        <span className="text-[9px] text-slate-500">{ipe.unit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase">Cible</span>
                        <div className="font-mono font-bold text-cyan-400 text-sm mt-0.5">
                          {ipe.targetValue}
                        </div>
                        <span className="text-[9px] text-slate-500">{ipe.unit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase">SER 2024</span>
                        <div className="font-mono font-bold text-slate-400 text-sm mt-0.5">
                          {ipe.baselineValue}
                        </div>
                        <span className="text-[9px] text-slate-500">{ipe.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deviation vs Baseline */}
                  <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
                    <span className="text-slate-400">Écart vs Réf 2024 :</span>
                    <span className={`font-mono font-bold flex items-center gap-1 ${
                      isImproved ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {isImproved ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      {ipe.deltaVsBaseline > 0 ? `+${ipe.deltaVsBaseline}%` : `${ipe.deltaVsBaseline}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Baseline SER & CUSUM */}
      {activeSubTab === 'baseline' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Comparaison Mensuelle : Consommation Réelle vs SER Normalisée & CUSUM
                </h3>
                <p className="text-xs text-slate-400">
                  Modélisation statistique de la référence (CPS Art. 2.5) normalisée selon le volume de conteneurs et les tonnes de vrac
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg font-mono">
                  Économie Totale CUSUM : +665 MWh (+728 000 DH)
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <Bar data={baselineChartData} options={baselineChartOptions} />
            </div>
          </div>

          {/* Historical Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-3">
              Tableau d'Évaluation de la Situation Énergétique de Référence (SER 2026)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Mois</th>
                    <th className="py-2.5 px-3">Trafic EVP</th>
                    <th className="py-2.5 px-3">Tonnage Vrac</th>
                    <th className="py-2.5 px-3">Réel (kWh)</th>
                    <th className="py-2.5 px-3">SER Réf (kWh)</th>
                    <th className="py-2.5 px-3">Écart Mensuel</th>
                    <th className="py-2.5 px-3">Gain Estimé (DH)</th>
                    <th className="py-2.5 px-3">CUSUM Cumulé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {isoData.monthlyData.map(m => (
                    <tr key={m.month} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-sans font-semibold text-slate-200">{m.month}</td>
                      <td className="py-2 px-3 text-slate-300">{m.teus.toLocaleString('fr-FR')} EVP</td>
                      <td className="py-2 px-3 text-slate-300">{m.bulkTons.toLocaleString('fr-FR')} T</td>
                      <td className="py-2 px-3 text-white font-bold">{m.realKWh.toLocaleString('fr-FR')}</td>
                      <td className="py-2 px-3 text-slate-400">{m.baselineKWh.toLocaleString('fr-FR')}</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">-{m.savingsKWh.toLocaleString('fr-FR')} kWh</td>
                      <td className="py-2 px-3 text-emerald-300 font-semibold">{formatCurrency(m.savingsKWh * 1.095)}</td>
                      <td className="py-2 px-3 text-cyan-300 font-bold">+{m.cusumKWh.toLocaleString('fr-FR')} kWh</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Pareto Diagram (80/20) */}
      {activeSubTab === 'pareto' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  Diagramme de Pareto des Usages Énergétiques Significatifs (UES / SEU)
                </h3>
                <p className="text-xs text-slate-400">
                  Identification des gisements d'économies d'énergie prioritaires (Loi des 80/20 ISO 50001 §6.3)
                </p>
              </div>

              <div className="p-2 bg-blue-950/80 border border-blue-800/80 rounded-xl text-xs text-blue-200">
                💡 <strong>Constat Clé :</strong> Le <strong>PT X</strong> (Conteneurs) et le <strong>PT Y</strong> (Reefers) représentent à eux deux <strong>56.0%</strong> de la consommation globale du port.
              </div>
            </div>

            <div className="h-72 w-full">
              <Bar data={paretoChartData} options={paretoChartOptions} />
            </div>
          </div>

          {/* Pareto Breakdown List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isoData.paretoItems.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    Rang #{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.category}
                  </span>
                </div>
                <div className="font-bold text-xs text-white line-clamp-1">{item.label}</div>
                <div className="mt-2 flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Puissance :</span>
                  <strong className="text-white">{formatNumber(item.powerKW, 1)} kW</strong>
                </div>
                <div className="mt-1 flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Part énergétique :</span>
                  <strong className="text-cyan-300">{item.sharePercent}%</strong>
                </div>
                <div className="mt-1 flex justify-between text-xs font-mono border-t border-slate-800 pt-1 text-slate-400">
                  <span>Cumul Pareto :</span>
                  <span className="font-semibold text-amber-400">{item.cumulativePercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Energy Flow Diagram (Sankey-like) */}
      {activeSubTab === 'flow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Cartographie des Flux d'Énergie — Boucle 22 kV vers Usages Terminaux
            </h3>
            <p className="text-xs text-slate-400">
              Traçabilité de la distribution depuis l'injection réseau ONEE jusqu'aux équipements de manutention
            </p>
          </div>

          {/* Graphical Flow Representation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Step 1: Inflow */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                1. Injection Réseau ONEE
              </div>
              <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-600/60 rounded-2xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">{isoData.energyFlow.source}</h4>
                <div className="mt-2 font-mono font-extrabold text-2xl text-amber-400">
                  6 000 <span className="text-xs font-normal text-slate-400">kW (100%)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Tension : 22 000 V MT</div>
              </div>
            </div>

            {/* Step 2: Substations Distribution */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                2. Répartition par Poste MT/BT
              </div>
              <div className="space-y-2">
                {isoData.energyFlow.substations.map(sub => (
                  <div key={sub.name} className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }}></span>
                      <span className="font-semibold text-slate-200">{sub.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{sub.powerKW} kW</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: End Uses */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                3. Usages Énergétiques Finaux
              </div>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {isoData.energyFlow.endUses.map(use => (
                  <div key={use.name} className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-300">{use.name}</span>
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="font-bold text-white">{use.powerKW} kW</span>
                      <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1 rounded">{use.share}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Action Plans (PAE) */}
      {activeSubTab === 'actions' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Plan d'actions d'efficacité énergétique (PAE) validé dans le cadre de la certification ISO 50001:2018 de la DEPA Agadir.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isoData.actionPlans.map(plan => (
              <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {plan.id}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                    plan.status === 'IN_PROGRESS'
                      ? 'bg-blue-950 text-blue-300 border-blue-800'
                      : plan.status === 'VALIDATED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {plan.status === 'IN_PROGRESS' ? 'EN COURS' : plan.status === 'VALIDATED' ? 'VALIDÉ' : 'PLANIFIÉ'}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{plan.title}</h4>
                <p className="text-xs text-slate-300">{plan.action}</p>

                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Gain Annuel Attendu :</span>
                    <strong className="text-emerald-400 font-mono">{plan.expectedGain}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Périmètre :</span>
                    <span className="text-slate-200">{plan.targetSite}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Échéance & Responsable :</span>
                    <span className="text-slate-200">{plan.deadline} • {plan.responsible}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Avancement</span>
                    <span className="font-mono font-bold text-cyan-400">{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${plan.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
