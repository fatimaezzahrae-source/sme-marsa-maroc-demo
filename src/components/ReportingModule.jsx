import React, { useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  Leaf, 
  Award, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { formatNumber, formatCurrency, formatDateTime } from '../utils/mathUtils';
import { exportToCSV, exportToJSON, printDocument } from '../utils/exportUtils';

export const ReportingModule = () => {
  const { 
    substations, 
    meters, 
    isoData, 
    tariffConfig, 
    totalPowerKW, 
    globalPowerFactor,
    alerts 
  } = useEnergy();

  const [reportType, setReportType] = useState('MONTHLY'); // 'DAILY', 'WEEKLY', 'MONTHLY'

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const resolvedAlerts = alerts.filter(a => a.status === 'RESOLVED');

  // Total energy estimated for current period
  const totalSiteEnergyKWh = meters.reduce((acc, m) => acc + m.energyTotalKWh, 0);
  const estimatedCostPeriodMAD = (totalSiteEnergyKWh * 0.08) * tariffConfig.rates.averageBlendedRate; // mock period fraction
  const estimatedCO2Tons = (totalSiteEnergyKWh * 0.08 * tariffConfig.co2FactorKgPerKWh) / 1000;

  const handleExportCSV = () => {
    exportToCSV(meters, `SME_MarsaMaroc_Agadir_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportJSON = () => {
    const reportData = {
      title: `Rapport Énergétique Marsa Maroc - Port d'Agadir (${reportType})`,
      marketRef: '12/DEPA/2026',
      generatedAt: new Date().toISOString(),
      standard: 'ISO 50001:2018',
      kpis: {
        totalPowerKW,
        globalPowerFactor,
        totalSiteEnergyKWh,
        estimatedCostMAD: estimatedCostPeriodMAD,
        estimatedCO2Tons,
      },
      substations: substations.map(s => ({
        code: s.code,
        name: s.name,
        powerKW: s.powerKW,
        powerFactor: s.powerFactor,
        commQuality: s.commQuality,
      })),
      metersCount: meters.length,
      alertsSummary: {
        active: activeAlerts.length,
        resolved: resolvedAlerts.length,
      }
    };
    exportToJSON(reportData, `SME_MarsaMaroc_AuditData_${reportType}.json`);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-950/80 text-cyan-400 rounded-xl border border-cyan-800/60">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Module de Reporting & Revue Énergétique (CPS Art. 2.7)
            </h2>
            <p className="text-xs text-slate-400">
              Génération de rapports certifiés ISO 50001:2018 pour la direction DEPA et les audits SMI
            </p>
          </div>
        </div>

        {/* Report Type Selector & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex text-xs font-medium">
            <button
              onClick={() => setReportType('DAILY')}
              className={`px-3 py-1.5 rounded-lg transition ${
                reportType === 'DAILY' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Journalier
            </button>
            <button
              onClick={() => setReportType('WEEKLY')}
              className={`px-3 py-1.5 rounded-lg transition ${
                reportType === 'WEEKLY' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hebdomadaire
            </button>
            <button
              onClick={() => setReportType('MONTHLY')}
              className={`px-3 py-1.5 rounded-lg transition ${
                reportType === 'MONTHLY' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Revue Mensuelle ISO 50001
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Exporter les 58 points de mesure en CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Exporter les données d'audit en JSON"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          {/* Print / PDF button */}
          <button
            onClick={printDocument}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-cyan-900/30 transition"
            title="Imprimer ou enregistrer en PDF via le navigateur"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / PDF</span>
          </button>
        </div>
      </div>

      {/* Official Report Document Preview Layout (A4 styled) */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 max-w-5xl mx-auto print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Document Official Header */}
        <div className="border-b-2 border-slate-700 print:border-black pb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="font-extrabold text-xl tracking-tight text-white print:text-black font-mono">
                MARSA MAROC
              </div>
              <span className="text-slate-500">|</span>
              <div className="text-xs font-bold text-cyan-400 print:text-blue-800">
                DIRECTION D'EXPLOITATION AU PORT D'AGADIR (DEPA)
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white print:text-black mt-2">
              {reportType === 'DAILY' && 'Rapport Journalier d\'Exploitation Énergétique'}
              {reportType === 'WEEKLY' && 'Synthèse Hebdomadaire des Performances Énergétiques'}
              {reportType === 'MONTHLY' && 'Revue Énergétique Mensuelle — ISO 50001:2018'}
            </h1>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
              Marché n° 12/DEPA/2026 • Système de Monitoring Énergétique (SME) des 6 Postes Électriques
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-300 print:text-gray-800 space-y-1">
            <div>Réf Document : <strong>SME-RAP-2026-10</strong></div>
            <div>Date d'émission : <strong>{formatDateTime(new Date().toISOString())}</strong></div>
            <div>Périmètre : <strong>Port d'Agadir (6 Postes MT/BT)</strong></div>
            <div className="text-emerald-400 print:text-green-700 font-bold">Standard : ISO 50001:2018 / SMI DEPA</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 print:border-gray-300 pb-1">
            1. Synthèse Exécutive de la Période
          </h3>
          <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
            Le présent rapport formalise la revue énergétique du Port d'Agadir conformément aux exigences de la norme <strong>ISO 50001:2018</strong> et aux prescriptions du marché <strong>12/DEPA/2026</strong>. 
            L'ensemble des 58 points de comptage répartis sur les six postes transformateurs (PT 1, PT X, PT Z, PT 4, PT Y, PT 7) a fait l'objet d'un suivi en continu via communication <strong>Modbus TCP/IP</strong>. 
            Le poste historique <strong>PT 1</strong> a été intégré avec succès sans duplication d'investissement via sa passerelle Modbus existante.
          </p>

          {/* Key Figures Cards in Report */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950 print:bg-gray-100 p-3 rounded-xl border border-slate-800 print:border-gray-300 text-center">
              <span className="text-[10px] text-slate-400 print:text-gray-600 uppercase">Énergie Totale Période</span>
              <div className="font-mono font-bold text-base text-white print:text-black mt-1">
                {formatNumber(totalSiteEnergyKWh * 0.08, 0)} <span className="text-xs font-normal">kWh</span>
              </div>
            </div>

            <div className="bg-slate-950 print:bg-gray-100 p-3 rounded-xl border border-slate-800 print:border-gray-300 text-center">
              <span className="text-[10px] text-slate-400 print:text-gray-600 uppercase">Facteur Cos φ Moyen</span>
              <div className="font-mono font-bold text-base text-emerald-400 print:text-green-700 mt-1">
                {globalPowerFactor.toFixed(3)}
              </div>
              <span className="text-[9px] text-slate-500 print:text-gray-600">Sans pénalité ONEE</span>
            </div>

            <div className="bg-slate-950 print:bg-gray-100 p-3 rounded-xl border border-slate-800 print:border-gray-300 text-center">
              <span className="text-[10px] text-slate-400 print:text-gray-600 uppercase">Montant Facture Estimé</span>
              <div className="font-mono font-bold text-base text-white print:text-black mt-1">
                {formatCurrency(estimatedCostPeriodMAD)}
              </div>
            </div>

            <div className="bg-slate-950 print:bg-gray-100 p-3 rounded-xl border border-slate-800 print:border-gray-300 text-center">
              <span className="text-[10px] text-slate-400 print:text-gray-600 uppercase">Émissions Évitées vs SER</span>
              <div className="font-mono font-bold text-base text-emerald-400 print:text-green-700 mt-1">
                -{formatNumber(totalAvoidedCO2Tons, 1)} <span className="text-xs font-normal">t CO2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Substation Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 print:border-gray-300 pb-1">
            2. Bilan Électrique par Poste Transformateur (Boucle 22 kV)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 print:bg-gray-200 text-slate-300 print:text-black border-b border-slate-800 font-mono">
                <tr>
                  <th className="py-2.5 px-3">Poste</th>
                  <th className="py-2.5 px-3">Affectation Principale</th>
                  <th className="py-2.5 px-3">Compteurs</th>
                  <th className="py-2.5 px-3">P. Instantanée</th>
                  <th className="py-2.5 px-3">Cos φ</th>
                  <th className="py-2.5 px-3">THD-I</th>
                  <th className="py-2.5 px-3">Disponibilité Modbus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300 font-mono">
                {substations.map(sub => (
                  <tr key={sub.id}>
                    <td className="py-2 px-3 font-bold text-white print:text-black">{sub.code}</td>
                    <td className="py-2 px-3 font-sans text-slate-300 print:text-gray-800">{sub.name}</td>
                    <td className="py-2 px-3">{sub.meterCount} {sub.existingMeters > 0 ? '(12 existants)' : ''}</td>
                    <td className="py-2 px-3 text-cyan-300 print:text-black font-semibold">{formatNumber(sub.powerKW, 1)} kW</td>
                    <td className="py-2 px-3 text-slate-300 print:text-gray-800">{sub.powerFactor.toFixed(3)}</td>
                    <td className="py-2 px-3 text-slate-300 print:text-gray-800">{sub.thdI.toFixed(1)}%</td>
                    <td className="py-2 px-3 text-emerald-400 print:text-green-700">{sub.commQuality}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EnPIs and Baseline Tracking */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 print:border-gray-300 pb-1">
            3. Suivi des Indicateurs de Performance Énergétique (IPE / EnPI)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 print:bg-gray-200 text-slate-300 print:text-black border-b border-slate-800 font-mono">
                <tr>
                  <th className="py-2 px-3">Code IPE</th>
                  <th className="py-2 px-3">Désignation</th>
                  <th className="py-2 px-3">Unité</th>
                  <th className="py-2 px-3">Valeur Observée</th>
                  <th className="py-2 px-3">Cible DEPA</th>
                  <th className="py-2 px-3">Réf. SER 2024</th>
                  <th className="py-2 px-3">Écart Relatif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300 font-mono">
                {isoData.indicators.map(ipe => (
                  <tr key={ipe.id}>
                    <td className="py-1.5 px-3 font-bold text-cyan-300 print:text-black">{ipe.code}</td>
                    <td className="py-1.5 px-3 font-sans text-slate-200 print:text-gray-800">{ipe.name}</td>
                    <td className="py-1.5 px-3 text-slate-400 print:text-gray-600">{ipe.unit}</td>
                    <td className="py-1.5 px-3 font-bold text-white print:text-black">{ipe.currentValue}</td>
                    <td className="py-1.5 px-3 text-cyan-400 print:text-blue-700">{ipe.targetValue}</td>
                    <td className="py-1.5 px-3 text-slate-400 print:text-gray-600">{ipe.baselineValue}</td>
                    <td className="py-1.5 px-3 text-emerald-400 print:text-green-700 font-bold">{ipe.deltaVsBaseline}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alarms and Incidents Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 print:border-gray-300 pb-1">
            4. Synthèse des Incidents et Qualité de Mesure Modbus (CPS Art. 2.6)
          </h3>
          <p className="text-xs text-slate-300 print:text-gray-800">
            Durant la période sous revue, <strong>{alerts.length} événements</strong> ont été enregistrés par la console de supervision. 
            {resolvedAlerts.length} alarmes ont été clôturées après intervention des équipes de maintenance, et {activeAlerts.length} alarme reste sous observation technique.
          </p>
        </div>

        {/* Validation and Signatures Section */}
        <div className="border-t-2 border-slate-700 print:border-black pt-6 grid grid-cols-3 gap-6 text-xs text-center">
          <div className="space-y-8">
            <div className="font-bold text-slate-300 print:text-gray-800">L'Ingénieur Électrique SCADA</div>
            <div className="font-mono text-slate-400 print:text-gray-600 border-t border-slate-800 print:border-gray-400 pt-1">
              Driss El Mansouri<br />Visa technique
            </div>
          </div>

          <div className="space-y-8">
            <div className="font-bold text-slate-300 print:text-gray-800">Le Responsable Énergie (ISO 50001)</div>
            <div className="font-mono text-slate-400 print:text-gray-600 border-t border-slate-800 print:border-gray-400 pt-1">
              Fatima-Zahra Alami<br />Approbation revue énergétique
            </div>
          </div>

          <div className="space-y-8">
            <div className="font-bold text-slate-300 print:text-gray-800">La Direction d'Exploitation (DEPA)</div>
            <div className="font-mono text-slate-400 print:text-gray-600 border-t border-slate-800 print:border-gray-400 pt-1">
              Direction Marsa Maroc Agadir<br />Pour validation de diffusion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
