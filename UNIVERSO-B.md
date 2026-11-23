# Universo B: stesso mondo, un solo parametro cambiato

Esperimento della missione (§6.2), solo CPU, nessuna chiamata AI. Pre-registrazione committata prima dei dati:
`audit/preregistrazione-universo-b.json` (commit bfc345e1). Codice `audit/universo_b.py`, risultati
`audit/universo_b.json`, registro `audit/universo_b_cache.jsonl` (200 run, 27 minuti).

**Domanda.** Se cambia solo il periodo della legge delle valenze (valenza = 1 + (r mod p), p da 3 a 7, 8 elementi,
stessa regola di reazione), quali relazioni reggono?

**Bracci.** E = cricchetto: generazioni di agenti a ricerca casuale con eredità. R = menti isolate: lo stesso calcolo
totale diviso in vite indipendenti con tutti i dati. Semi nuovi 901000-901019.

| Periodo | Legge trovata, cricchetto (su 20) | Legge trovata, menti isolate (su 20) | Identificabile dai dati |
|---|---|---|---|
| 3 (riferimento) | 7 | 0 | sì |
| 4 | 4 | 0 | sì |
| 5 | 1 | 0 | sì |
| 6 | 0 | 0 | sì |
| 7 | 0 | 0 | **no**: con 7 ranghi osservabili, `1 + r` spiega gli stessi dati e prevede 8 per l'elemento escluso |

| Previsione | Esito |
|---|---|
| B1 il cricchetto vince più coppie delle menti isolate, sommando i periodi | **verde**: 12 a 0, p 0,00024 |
| B2 la quota di leggi trovate cala col periodo | sì: 7, 4, 1, 0, 0 |
| B3 legge identificabile fino a p 6, non a p 7 | sì |

**Lettura.** Il vantaggio dell'eredità è una relazione che **persiste** quando cambia la regola del mondo: dove si
trova qualcosa, lo trova solo la catena. Ciò che **cambia** è la difficoltà: oltre il periodo 5 gli agenti casuali
non arrivano alla legge, e a periodo 7 nessuno può arrivarci, perché i dati non bastano a distinguerla da una legge
più semplice. È il limite di Mendeleev: senza abbastanza elementi, la periodicità non si vede.

**Limiti.** Agenti casuali, non AI. Un solo parametro (il periodo) su una sola famiglia di leggi. Condizione e
attivazione sono identiche fra A e B per costruzione, quindi "reggono" non è una scoperta.
