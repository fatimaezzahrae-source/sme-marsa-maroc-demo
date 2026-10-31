import React, { useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { 
  BellRing, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Check, 
  X, 
  Sliders, 
  Filter, 
  ArrowRight,
  ShieldAlert,
  Search
} from 'lucide-react';
import { formatDateTime } from '../utils/mathUtils';

export const AlertConsole = () => {
  const { 
    alerts, 
    substations, 
    acknowledgeAlert, 
    resolveAlert, 
    simulateFault, 
    setSelectedSubstationId, 
    setSelectedMeterId, 
    setActiveTab 
  } = useEnergy();

  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'
  const [severityFilter, setSeverityFilter] = useState('ALL'); // 'ALL', 'CRITICAL', 'WARNING', 'INFO'
  const [substationFilter, setSubstationFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals for actions
  const [activeModalAlert, setActiveModalAlert] = useState(null);
  const [modalType, setModalType] = useState(null); // 'ACK' or 'RESOLVE'
  const [operatorName, setOperatorName] = useState('Ing. M. Tazi (DEPA/Exploitation)');
  const [resolutionNote, setResolutionNote] = useState('Action corrective exécutée avec succès sur l’équipement.');

  // Filtering
  const filteredAlerts = alerts.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (substationFilter !== 'ALL' && a.substationId !== substationFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchText = (a.title + a.description + a.meterLabel + a.meterId + a.substationCode).toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const ackCount = alerts.filter(a => a.status === 'ACKNOWLEDGED').length;
  const resolvedCount = alerts.filter(a => a.status === 'RESOLVED').length;

  const handleOpenAck = (alert) => {
    setActiveModalAlert(alert);
    setModalType('ACK');
  };

  const handleOpenResolve = (alert) => {
    setActiveModalAlert(alert);
    setModalType('RESOLVE');
  };

  const confirmAction = () => {
    if (modalType === 'ACK' && activeModalAlert) {
      acknowledgeAlert(activeModalAlert.id, operatorName);
    } else if (modalType === 'RESOLVE' && activeModalAlert) {
      resolveAlert(activeModalAlert.id, resolutionNote);
    }
    setActiveModalAlert(null);
    setModalType(null);
  };

  const inspectMeter = (subId, meterId) => {
    setSelectedSubstationId(subId);
    setSelectedMeterId(meterId);
    setActiveTab('measures');
  };

  return (
    <div className="space-y-6">
      {/* Top SCADA Alarm Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs uppercase text-slate-400 font-semibold">Total Alertes</span>
            <div className="font-mono text-2xl font-extrabold text-white mt-0.5">{alerts.length}</div>
          </div>
          <div className="p-3 bg-slate-800 text-slate-300 rounded-xl">
            <BellRing className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs uppercase text-red-400 font-semibold">Actives / Non Traitées</span>
            <div className="font-mono text-2xl font-extrabold text-red-400 mt-0.5">{activeCount}</div>
          </div>
          <div className="p-3 bg-red-950 text-red-400 rounded-xl border border-red-800">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs uppercase text-amber-400 font-semibold">Prises en Charge</span>
            <div className="font-mono text-2xl font-extrabold text-amber-400 mt-0.5">{ackCount}</div>
          </div>
          <div className="p-3 bg-amber-950 text-amber-400 rounded-xl border border-amber-800">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs uppercase text-emerald-400 font-semibold">Clôturées / Résolues</span>
            <div className="font-mono text-2xl font-extrabold text-emerald-400 mt-0.5">{resolvedCount}</div>
          </div>
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Console d'Alertes et Détection d'Anomalies (CPS Art. 2.6)</h3>
          </div>

          {/* Fault Simulation Shortcuts */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => simulateFault('COMM_LOSS')}
              className="px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg text-xs font-semibold transition"
            >
              + Coupure Modbus
            </button>
            <button
              onClick={() => simulateFault('POWER_SURGE')}
              className="px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded-lg text-xs font-semibold transition"
            >
              + Pic Puissance
            </button>
            <button
              onClick={() => simulateFault('RESET_ALL')}
              className="px-2.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold transition"
            >
              ↺ Réinitialiser
            </button>
          </div>
        </div>

        {/* Filter selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher compteur, alerte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
          >
            <option value="ALL">Tous les Statuts</option>
            <option value="ACTIVE">Actives Uniquement</option>
            <option value="ACKNOWLEDGED">Prises en Charge</option>
            <option value="RESOLVED">Clôturées</option>
          </select>

          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
          >
            <option value="ALL">Toutes les Gravités</option>
            <option value="CRITICAL">Critique (Modbus/Déconnexion)</option>
            <option value="WARNING">Avertissement (Seuil/cos φ)</option>
            <option value="INFO">Information</option>
          </select>

          {/* Substation filter */}
          <select
            value={substationFilter}
            onChange={(e) => setSubstationFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
          >
            <option value="ALL">Tous les Postes</option>
            {substations.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-3 px-4">Horodatage</th>
                <th className="py-3 px-4">Gravité</th>
                <th className="py-3 px-4">Poste & Compteur</th>
                <th className="py-3 px-4">Détails de l'Incidence</th>
                <th className="py-3 px-4">Valeur / Seuil</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions Opérateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    Aucune alerte correspondant aux critères de filtrage.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => {
                  const isCritical = alert.severity === 'CRITICAL';
                  const isWarning = alert.severity === 'WARNING';
                  const isActive = alert.status === 'ACTIVE';
                  const isAck = alert.status === 'ACKNOWLEDGED';
                  const isResolved = alert.status === 'RESOLVED';

                  return (
                    <tr key={alert.id} className="hover:bg-slate-800/40 transition">
                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                        {formatDateTime(alert.timestamp)}
                      </td>

                      {/* Severity Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          isCritical
                            ? 'bg-red-950/80 text-red-300 border-red-800 animate-pulse'
                            : isWarning
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                              : 'bg-blue-950/80 text-blue-300 border-blue-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-red-400' : isWarning ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
                          <span>{alert.severity}</span>
                        </span>
                      </td>

                      {/* Substation & Meter */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-white flex items-center gap-1.5">
                          <span className="bg-slate-800 px-1.5 py-0.2 rounded text-cyan-400 border border-slate-700">
                            {alert.substationCode}
                          </span>
                          <span>{alert.meterId}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[180px]">
                          {alert.meterLabel}
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-100">{alert.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 max-w-sm">
                          {alert.description}
                        </div>
                        {alert.acknowledgedBy && (
                          <div className="mt-1 text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            Pris en charge par : {alert.acknowledgedBy} ({formatDateTime(alert.acknowledgedAt)})
                          </div>
                        )}
                        {alert.resolutionNote && (
                          <div className="mt-1 text-[10px] text-emerald-400 font-mono">
                            Résolution : {alert.resolutionNote}
                          </div>
                        )}
                      </td>

                      {/* Measured vs Threshold */}
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <div className="text-white font-bold">{alert.measuredValue}</div>
                        <div className="text-[10px] text-slate-500">Seuil: {alert.threshold}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                          isActive
                            ? 'bg-red-950 text-red-300 border-red-800'
                            : isAck
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}>
                          {isActive ? 'NOUVELLE' : isAck ? 'EN COURS' : 'CLÔTURÉE'}
                        </span>
                      </td>

                      {/* Operator Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          {isActive && (
                            <button
                              onClick={() => handleOpenAck(alert)}
                              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-600/50 rounded-lg text-xs font-semibold transition"
                              title="Prendre en charge l'alerte"
                            >
                              Acquitter
                            </button>
                          )}

                          {!isResolved && (
                            <button
                              onClick={() => handleOpenResolve(alert)}
                              className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-600/50 rounded-lg text-xs font-semibold transition"
                              title="Clôturer avec rapport d'intervention"
                            >
                              Clôturer
                            </button>
                          )}

                          <button
                            onClick={() => inspectMeter(alert.substationId, alert.meterId)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg transition"
                            title="Inspecter les mesures du compteur"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Acknowledge / Resolve */}
      {activeModalAlert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">
                  {modalType === 'ACK' ? 'Prendre en Charge l\'Alerte' : 'Clôturer l\'Incident Énergétique'}
                </h3>
                <span className="font-mono text-xs text-cyan-400">
                  {activeModalAlert.id} • {activeModalAlert.meterId} ({activeModalAlert.substationCode})
                </span>
              </div>
              <button
                onClick={() => setActiveModalAlert(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <p><strong>Alerte :</strong> {activeModalAlert.title}</p>
              <p className="text-slate-400">{activeModalAlert.description}</p>
            </div>

            {modalType === 'ACK' ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Nom de l'Opérateur / Superviseur :</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Rapport d'Intervention / Action Menée :</label>
                <textarea
                  rows="3"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                ></textarea>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveModalAlert(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                  modalType === 'ACK'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{modalType === 'ACK' ? 'Confirmer Prise en Charge' : 'Valider Clôture'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
