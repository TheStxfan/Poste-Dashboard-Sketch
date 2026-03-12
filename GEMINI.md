# GEMINI.md - Dashboard Servizio Poste IT

Questo file fornisce il contesto e le istruzioni operative per lo sviluppo e la manutenzione della Dashboard IT per il monitoraggio dei servizi postali.

## Panoramica del Progetto
La dashboard è un'applicazione web (HTML/CSS/JS) progettata per un **IT Manager**. Visualizza KPI in tempo reale, stato delle code e costi dell'infrastruttura, ispirandosi al modello di Poste Italiane.

### Tecnologie Principali
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Librerie**: 
  - [Chart.js](https://www.chart.js.org/) per la visualizzazione dei grafici.
  - [PapaParse](https://www.papaparse.com/) per il caricamento dinamico dei dati da CSV.
- **Dati**: Il file sorgente principale è `poste_data.csv` (derivato da `Poste.xlsx`).

## Architettura e Flusso Dati
1.  **Sorgente**: `Poste.xlsx` contiene l'analisi dei requisiti e l'architettura.
2.  **Interattività**: Il file `poste_data.csv` funge da database flat per il frontend.
3.  **Visualizzazione**: `script.js` carica il CSV a ogni refresh, popola i KPI e genera grafici comparativi tra afflusso utenti e capacità operativa.

## Istruzioni per lo Sviluppo

### Aggiornamento Dati
Per riflettere modifiche nei dati sulla dashboard:
- Modificare direttamente `poste_data.csv`.
- Oppure, se si modifica `Poste.xlsx`, esportare il foglio "Analisi Richiesta" in CSV usando il comando:
  ```powershell
  python -c "import pandas as pd; df = pd.read_excel('Poste.xlsx', sheet_name='Analisi Richiesta'); df.to_csv('poste_data.csv', index=False)"
  ```

### Convenzioni di Stile
- **Colori**: Giallo Poste (`#FFCB00`), Blu Poste (`#004B8E`).
- **Layout**: Grid/Flexbox responsive, design pulito con card per i KPI.

### Logica di Alert
Gli alert sono generati dinamicamente in `script.js`. Attualmente, una "Capacità oraria" inferiore a 150 unità/ora scatena un alert di criticità (rosso).

## File Chiave
- `index.html`: Struttura e importazione librerie.
- `style.css`: Stili istituzionali e layout.
- `script.js`: Logica di parsing CSV, gestione grafici e alert.
- `poste_data.csv`: Database dei parametri di servizio.
- `obiettivo-progetto.md`: Documento dei requisiti originali.

## Utilizzo
Per visualizzare la dashboard, è necessario un server web locale (es. `npx serve .` o l'estensione "Live Server" di VS Code) a causa delle restrizioni CORS sulla lettura dei file locali via JavaScript.
