# Système de Monitoring Énergétique (SME) — Marsa Maroc Port d'Agadir
## Marché n° 12/DEPA/2026 • Conformité ISO 50001:2018

Application web interactive complète de simulation pour la supervision et le management énergétique des postes électriques de **Marsa Maroc** à la **Direction d'Exploitation au Port d'Agadir (DEPA)**.

---

## ⚡ Périmètre et Architecture Technique

- **6 Postes Transformateurs supervisés** :
  1. **PT 1** : Poste Central, Administration DEPA, Quais Historiques & Station Pompage (12 compteurs existants intégrés sans duplication d'investissement).
  2. **PT X** : Terminal Conteneurs (2 Portiques de quai ZPMC 65T, RTG, éclairage mât haut — 11 compteurs).
  3. **PT Z** : Outillage Quai Ouest (Grues mobiles Gottwald HMK 260E, hangars transit — 9 compteurs).
  4. **PT 4** : Silos & Vracs Agroalimentaires (Élévateurs à godets, convoyeurs, aspiration ATEX — 10 compteurs).
  5. **PT Y** : Parc Frigorifique Reefer Park (320 prises conteneurs frigorifiques export — 9 compteurs).
  6. **PT 7** : Chantier Naval, Cale de Halage, Slipway & Cold Ironing navires (7 compteurs).
- **Total exact instrumenté** : **58 points de comptage** Modbus TCP/IP (Port 502).

---

## 🚀 Les 6 Modules Fonctionnels

1. **Tableau de Bord Global (Multi-sites / 6 Postes)** :
   - KPIs temps réel : Puissance totale (kW), Facteur de puissance moyen (cos φ), État com Modbus (58 pts), Coût horaire (DH/h) et CO2.
   - Synoptique portuaire interactif SCADA avec tracé de la boucle MT 22 kV et géolocalisation des postes.
   - Courbe de charge globale 24h avec découpage tarifaire ONEE (Heures Pleines, Creuses, Pointe).

2. **Module de Visualisation des Postes et Mesures (Modbus TCP/IP)** :
   - Mesures triphasées : Tensions simples (V) et composées (U), Courants de phase (I), Puissances (P, Q, S), Cos φ, Fréquence, Harmoniques (THD-U, THD-I).
   - Indicateur certifié de fraîcheur des données et d'horodatage (CPS Art. 2.3).
   - Console d'inspection de la cartographie des registres Modbus (40001-40032) et décodage hexadécimal des trames requêtes/réponses.
   - Courbes d'évolution temporelle (24h, 7j, 30j).

3. **Suivi de la Performance Énergétique (ISO 50001:2018)** :
   - Indicateurs de Performance Énergétique (IPE/EnPI) : kWh/EVP, kWh/Tonne vrac, kWh/Mvt STS, kWh/Reefer/Jour.
   - Comparaison avec la Situation Énergétique de Référence (SER Baseline 2024 normalisée).
   - Graphique de gains cumulés CUSUM (MWh et DH économisés).
   - Diagramme de Pareto des Usages Énergétiques Significatifs (loi 80/20).
   - Cartographie des flux d'énergie (Sankey simplifié) et Plan d'Actions Énergétiques (PAE).

4. **Gestion des Alertes et Incidents** :
   - Console SCADA en temps réel avec filtrage (Gravité, Statut, Poste).
   - Prise en charge (acquittement avec nom d'opérateur) et clôture avec note d'intervention.
   - Simulateur d'incidents (coupure com Modbus, pic de charge, déséquilibre).

5. **Module de Reporting et Export** :
   - Revue Énergétique Mensuelle ISO 50001, Bilan Journalier d'Exploitation, Synthèse Hebdomadaire.
   - Moteur d'export réel : Fichier CSV des 58 points, données JSON d'audit, impression/PDF haute fidélité mise en page A4.

6. **Panneau d'Administration** :
   - Inventaire et édition des seuils d'alerte (Pmax, cos φ min, THD-I max) des 58 compteurs.
   - Paramétrage réseau Modbus TCP/IP et passerelles (Schneider EGX300, Moxa MGate).
   - Barèmes tarifaires ONEE Moyenne Tension & facteur CO2.
   - Journal d'audit (Audit Trail) inaltérable avec horodatage et traçabilité.

---

## 🛠️ Lancement & Gestion du Service

L'application est configurée pour écouter sur **`0.0.0.0:8000`** et peut être gérée directement en tant que service système :

### Gestion via la commande `service` :
```bash
# Vérifier l'état du service
service marsa-maroc-sme status

# Démarrer / Redémarrer / Arrêter le service
service marsa-maroc-sme start
service marsa-maroc-sme restart
service marsa-maroc-sme stop
```

### Gestion via PM2 :
```bash
# Voir le statut et les métriques
pm2 status
pm2 logs marsa-maroc-sme
```

### Lancement manuel :
```bash
cd /root/marsa-maroc-sme
npm run start # ou npm run preview
```
L'application est accessible sur `http://localhost:8000` (ou `http://0.0.0.0:8000`).
