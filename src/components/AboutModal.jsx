import React from 'react';
import { ShieldCheck, X, FileText, CheckCircle2, Zap, Layers, Activity } from 'lucide-react';

export const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl shadow-lg shadow-cyan-900/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-semibold text-cyan-400">
                MARSA MAROC • DIRECTION D'EXPLOITATION AU PORT D'AGADIR
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Système de Monitoring Énergétique (SME)
              </h2>
              <p className="text-xs text-slate-400">
                Marché public n° <strong>12/DEPA/2026</strong> — Conformité ISO 50001:2018
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-blue-950/50 border border-blue-800/60 rounded-xl space-y-1">
            <span className="font-bold text-cyan-300 uppercase text-[11px] tracking-wide">
              Cadre & Périmètre Contractuel
            </span>
            <p>
              Le marché porte sur la <strong>fourniture, l’installation, l’intégration et la mise en service d’un Système de Monitoring Énergétique (SME)</strong> des postes électriques de Marsa Maroc au Port d’Agadir, ainsi que sur les prestations associées (formation, revues énergétiques, reporting d'exploitation).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-200">
              Périmètre Technique Implémenté (6 Postes & 58 Compteurs)
            </h4>
            <ul className="space-y-1.5 pl-2">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>PT 1 (Central & Administration) :</strong> 12 compteurs historiques intégrés sans duplication d'investissement via passerelle Schneider Modbus TCP/IP (CPS Art. 2.8).</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>PT X (Terminal Conteneurs) :</strong> 11 compteurs supervisant les 2 Portiques STS ZPMC 65T et le parc de cavaliers RTG.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>PT Z (Outillage) :</strong> 9 compteurs dédiés aux Grues mobiles Gottwald HMK 260E et aux hangars de transit.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>PT 4 (Silos Vrac) :</strong> 10 compteurs instrumentant les élévateurs à godets, convoyeurs et aspiration ATEX.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>PT Y (Reefer Park) :</strong> 9 compteurs assurant la surveillance des 320 prises pour conteneurs frigorifiques export.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>PT 7 (Chantier Naval) :</strong> 7 compteurs gérant la cale de halage, le slipway et le branchement navire à quai (Cold Ironing).</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-200">
              Conformité ISO 50001:2018 & SMI DEPA
            </h4>
            <p>
              Le SME calcule en continu les <strong>Indicateurs de Performance Énergétique (IPE)</strong>, les compare à la <strong>Situation Énergétique de Référence (SER 2024 normalisée)</strong> et génère la courbe <strong>CUSUM</strong> des économies d'énergie cumulées, afin de soutenir le Système de Management Intégré de la DEPA certifié ISO 9001, 14001, 45001 et 50001.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>Protocole :</span>
              <strong className="text-cyan-400">Modbus TCP/IP (Port 502)</strong>
            </div>
            <div className="flex justify-between">
              <span>Temps de cycle de mesure :</span>
              <strong className="text-white">2 000 ms</strong>
            </div>
            <div className="flex justify-between">
              <span>Seuil réglementaire cos φ :</span>
              <strong className="text-emerald-400">≥ 0.920 (tan φ ≤ 0.426)</strong>
            </div>
            <div className="flex justify-between">
              <span>Norme de management :</span>
              <strong className="text-emerald-400">ISO 50001:2018</strong>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
          >
            Fermer le Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
