import React, { useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { 
  Settings, 
  Cpu, 
  Database, 
  Users, 
  FileCheck, 
  Search, 
  Edit3, 
  Sliders, 
  ShieldCheck, 
  DollarSign, 
  Network, 
  Check, 
  X,
  Plus,
  RefreshCw,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { formatNumber, formatCurrency, formatDateTime } from '../utils/mathUtils';
import { exportToCSV } from '../utils/exportUtils';

export const AdminPanel = () => {
  const { 
    meters, 
    substations, 
    tariffConfig, 
    auditLogs, 
    updateMeterThresholds, 
    addAuditLogEntry 
  } = useEnergy();

  const [activeAdminTab, setActiveAdminTab] = useState('meters'); // 'meters', 'modbus', 'tariffs', 'users', 'audit'
  const [searchTerm, setSearchTerm] = useState('');
  const [subFilter, setSubFilter] = useState('ALL');

  // Edit Threshold Modal state
  const [editingMeter, setEditingMeter] = useState(null);
  const [editPmax, setEditPmax] = useState('');
  const [editPFmin, setEditPFmin] = useState('');
  const [editTHDmax, setEditTHDmax] = useState('');

  // Tariff config state
  const [tariffs, setTariffs] = useState(tariffConfig.rates);
  const [tariffSaved, setTariffSaved] = useState(false);

  // Meter filter
  const filteredMeters = meters.filter(m => {
    if (subFilter !== 'ALL' && m.substationId !== subFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = (m.code + m.label + m.category + m.model + m.ipAddress).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  const handleOpenEdit = (meter) => {
    setEditingMeter(meter);
    setEditPmax(meter.thresholdPmaxKW.toString());
    setEditPFmin(meter.thresholdPFmin.toString());
    setEditTHDmax(meter.thresholdTHDmax.toString());
  };

  const handleSaveThresholds = () => {
    if (editingMeter) {
      updateMeterThresholds(editingMeter.id, editPmax, editPFmin, editTHDmax);
      setEditingMeter(null);
    }
  };

  const handleSaveTariff = (e) => {
    e.preventDefault();
    tariffConfig.rates = tariffs;
    setTariffSaved(true);
    addAuditLogEntry('Mise à jour tarifaire', 'Ajustement des barèmes ONEE MT (Heures Pleines/Creuses/Pointe)', 'Admin Système');
    setTimeout(() => setTariffSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-950/80 text-blue-400 rounded-xl border border-blue-800/60">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Panneau d'Administration & Configuration Technique
            </h2>
            <p className="text-xs text-slate-400">
              Inventaire des 58 points de comptage, passerelles Modbus TCP/IP, barèmes ONEE et journal d'audit
            </p>
          </div>
        </div>

        <button
          onClick={() => exportToCSV(meters, 'Inventaire_58_Points_Comptage_SME.csv')}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2 transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Exporter Inventaire (CSV)</span>
        </button>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveAdminTab('meters')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
            activeAdminTab === 'meters'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>58 Points de Comptage</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('modbus')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
            activeAdminTab === 'modbus'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Configuration Modbus TCP/IP</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('tariffs')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
            activeAdminTab === 'tariffs'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Tarifs ONEE & CO2</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
            activeAdminTab === 'users'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Utilisateurs & Profils</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
            activeAdminTab === 'audit'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Journal d'Audit (ISO 50001)</span>
        </button>
      </div>

      {/* Tab 1: 58 Meters Inventory & Threshold Management */}
      {activeAdminTab === 'meters' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher code, désignation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Substation selector */}
              <select
                value={subFilter}
                onChange={(e) => setSubFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="ALL">Tous les 6 Postes (58 compteurs)</option>
                {substations.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name} ({s.meterCount} pts)</option>
                ))}
              </select>
            </div>

            <div className="text-slate-400 font-mono">
              Affichage : <strong className="text-white">{filteredMeters.length}</strong> sur 58 points de mesure
            </div>
          </div>

          {/* Meters Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[580px] scrollbar-thin">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Poste</th>
                    <th className="py-2.5 px-3">Désignation Point de Mesure</th>
                    <th className="py-2.5 px-3">Modèle / Marque</th>
                    <th className="py-2.5 px-3">Réseau IP : Port (ID)</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Seuils Alerte</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {filteredMeters.map(meter => (
                    <tr key={meter.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold text-cyan-300 whitespace-nowrap">{meter.code}</td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="bg-slate-800 text-white px-1.5 py-0.5 rounded border border-slate-700">
                          {meter.substationCode}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-200 min-w-[200px]">
                        {meter.label}
                      </td>
                      <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{meter.model}</td>
                      <td className="py-2 px-3 text-slate-300 whitespace-nowrap">
                        {meter.ipAddress}:{meter.port} <span className="text-slate-500">(ID:{meter.slaveId})</span>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        {meter.isExisting ? (
                          <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded">
                            Existant (PT 1)
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            Nouveau marché
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-slate-400">
                        Pmax: <strong className="text-white">{meter.thresholdPmaxKW} kW</strong> • cos φ: <strong className="text-white">{meter.thresholdPFmin}</strong>
                      </td>
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(meter)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Seuils</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Modbus TCP/IP Network & Gateways */}
      {activeAdminTab === 'modbus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              Paramètres Généraux du Réseau Modbus TCP/IP
            </h3>
            <p className="text-xs text-slate-400">
              Supervision de la boucle Ethernet industrielle reliant les 6 postes du Port d'Agadir (CPS Art. 2.2).
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-sans">Sous-réseau Industriel :</span>
                <span className="font-bold text-white">192.168.10.0 / 24</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-sans">Port Standard Modbus :</span>
                <span className="font-bold text-cyan-400">502 (TCP)</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-sans">Délai d'attente Timeout :</span>
                <span className="font-bold text-white">3 000 ms</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-sans">Tentatives de Reconnexion :</span>
                <span className="font-bold text-white">3 essais successifs</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-sans">Période d'Échantillonnage :</span>
                <span className="font-bold text-emerald-400">2 000 ms (2 secondes)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Passerelles et Équipements de Communication par Poste
            </h3>

            <div className="space-y-2 text-xs">
              {substations.map(sub => (
                <div key={sub.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold font-mono text-cyan-300">{sub.code} — {sub.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{sub.gateway}</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-slate-300">{sub.ipAddress}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold">{sub.meterCount} compteurs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tariffs & Carbon Parameters */}
      {activeAdminTab === 'tariffs' && (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Barèmes ONEE Moyenne Tension & Facteur Carbone
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Paramétrage contractuel pour le calcul des coûts énergétiques et l'évaluation des économies ISO 50001
            </p>
          </div>

          {tariffSaved && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Barèmes tarifaires enregistrés avec succès. Journal d'audit mis à jour.</span>
            </div>
          )}

          <form onSubmit={handleSaveTariff} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Heures Pleines (DH/kWh) :</label>
                <input
                  type="number"
                  step="0.001"
                  value={tariffs.normalHours}
                  onChange={(e) => setTariffs({ ...tariffs, normalHours: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Plage 06h00 - 18h00</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Heures de Pointe (DH/kWh) :</label>
                <input
                  type="number"
                  step="0.001"
                  value={tariffs.peakHours}
                  onChange={(e) => setTariffs({ ...tariffs, peakHours: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Plage 18h00 - 22h00</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Heures Creuses (DH/kWh) :</label>
                <input
                  type="number"
                  step="0.001"
                  value={tariffs.offPeakHours}
                  onChange={(e) => setTariffs({ ...tariffs, offPeakHours: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Plage 22h00 - 06h00</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition text-xs shadow-md"
              >
                Enregistrer les Modifications
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Users & Permissions */}
      {activeAdminTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Gestion des Accès et Profils Utilisateurs (CPS Art. 2.9)
              </h3>
              <p className="text-xs text-slate-400">
                Contrôle d'accès basé sur les rôles (RBAC) pour l'exploitation et la maintenance du SME
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="py-2.5 px-3">Nom & Prénom</th>
                  <th className="py-2.5 px-3">Email Professionnel</th>
                  <th className="py-2.5 px-3">Rôle Assigné</th>
                  <th className="py-2.5 px-3">Fonction Système</th>
                  <th className="py-2.5 px-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {tariffConfig.defaultUsers.map(usr => (
                  <tr key={usr.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">{usr.name}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{usr.email}</td>
                    <td className="py-2.5 px-3 font-mono">
                      <span className="bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{usr.label}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">
                        Actif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Audit Trail */}
      {activeAdminTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              Journal d'Audit Système & Traçabilité Réglementaire (Audit Trail)
            </h3>
            <p className="text-xs text-slate-400">
              Historique inaltérable des actions de configuration, modifications de seuils et acquittements (Exigé ISO 50001 §9.1)
            </p>
          </div>

          <div className="overflow-x-auto max-h-96 scrollbar-thin">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Horodatage</th>
                  <th className="py-2.5 px-3">Utilisateur</th>
                  <th className="py-2.5 px-3">Action Réalisée</th>
                  <th className="py-2.5 px-3">Détails Techniques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                    <td className="py-2 px-3 text-cyan-300 font-semibold whitespace-nowrap">{log.user}</td>
                    <td className="py-2 px-3 text-white font-bold">{log.action}</td>
                    <td className="py-2 px-3 text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Threshold Edit Modal */}
      {editingMeter && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">
                  Ajuster les Seuils d'Alerte Compteur
                </h3>
                <span className="font-mono text-xs text-cyan-400">
                  {editingMeter.code} • {editingMeter.label} ({editingMeter.substationCode})
                </span>
              </div>
              <button
                onClick={() => setEditingMeter(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Seuil de Puissance Max (kW) :</label>
                <input
                  type="number"
                  value={editPmax}
                  onChange={(e) => setEditPmax(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Seuil Facteur de Puissance Min (cos φ) :</label>
                <input
                  type="number"
                  step="0.01"
                  value={editPFmin}
                  onChange={(e) => setEditPFmin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Seuil contractuel ONEE: 0.92</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Seuil Distorsion Harmonique Max THD-I (%) :</label>
                <input
                  type="number"
                  step="0.5"
                  value={editTHDmax}
                  onChange={(e) => setEditTHDmax(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingMeter(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveThresholds}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md"
              >
                Enregistrer les Seuils
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
