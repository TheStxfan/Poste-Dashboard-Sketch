# Scenari di Test e Algoritmi Dashboard Poste IT

Questo file contiene una serie di configurazioni per testare le funzionalità interattive e gli algoritmi della dashboard.

## 1. Test Algoritmo Capacità (λ vs μ)
L'algoritmo calcola la capacità oraria come: `Sportelli * (60 / Tempo Medio)`.

### Scenario: Riduzione Personale (Sottodimensionamento)
*   **Obiettivo**: Verificare se l'alert di criticità si attiva correttamente.
*   **Valori Edit**:
    *   Sportelli Attivi: `5`
    *   Tempo Medio: `8`
*   **Risultato atteso**: La capacità scende a ~38 utenti/ora. Nella Home apparirà un alert rosso "CRITICO" poiché il picco di traffico (210) è molto superiore alla capacità.

---

## 2. Test Simulazione Carico (Moltiplicatore)
Il moltiplicatore scala linearmente tutti i dati temporali (Code e Traffico API).

### Scenario: Black Friday / Picco Straordinario
*   **Obiettivo**: Testare la scalabilità dei grafici.
*   **Valori Edit**:
    *   Moltiplicatore Traffico: `200%`
*   **Risultato atteso**: Tutti i valori nel grafico a barre (λ) raddoppiano (il picco delle 13:00 passa da 210 a 420). Il grafico "Utenti Concorrenti" mostrerà un picco di 168.

---

## 3. Test Algoritmo Costi Infrastruttura
Calcola il totale mensile basandosi sulle quantità hardcoded e i costi unitari variabili.

### Scenario: Migrazione Cloud Premium
*   **Obiettivo**: Verificare il calcolo del Grand Total.
*   **Valori Edit**:
    *   Server Web: `200`
    *   Server Database: `450`
    *   API Gateway: `150`
*   **Risultato atteso**: Il "Totale Mensile" nella tabella costi deve aggiornarsi a: `(200*3) + (450*2) + 150 + 80 (LB) + 150 (Storage) = 1880€`.

---

## 4. Test Efficienza Operativa
### Scenario: Digitalizzazione Processi (Ottimizzazione)
*   **Obiettivo**: Vedere come la riduzione del tempo di servizio influisce sulla stabilità.
*   **Valori Edit**:
    *   Tempo Medio: `3` (invece di 6)
    *   Sportelli: `8` (invece di 12)
*   **Risultato atteso**: Nonostante meno sportelli, la capacità sale a 160 utenti/ora grazie alla velocità. Il sistema dovrebbe risultare "Stabile" (Alert Giallo) a meno che il moltiplicatore non superi il 130%.

---

## 5. Casi Limite (Edge Cases)
*   **Zero Sportelli**: Inserendo `0` sportelli, la capacità diventa `0`. Tutti i grafici mostreranno il traffico sopra la linea della capacità.
*   **Tempo Medio 1 min**: Massima capacità teorica del sistema.
*   **Moltiplicatore 50%**: Scenario di "Filiale Vuota", utile per verificare che gli alert di criticità scompaiano completamente.
