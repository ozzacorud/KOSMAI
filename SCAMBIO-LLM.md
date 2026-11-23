# Scambio fra universi fatto dalle AI

23/11/2026. Prima volta che civiltà di agenti LLM si passano conoscenza fra universi con regole diverse.
Scelta di Fabio: "procedi con lo scambio fra universi fatto dalle AI", con un disegno minimo per risparmiare token.

## Domanda

Una civiltà di Sonnet 5.5 nell'**Universo B** riceve, con un contratto, la legge scoperta dalle civiltà di **A**
(la Conferma, mondo D2). In B cambia una sola regola: la valenza è `1 + (3r mod 5)` invece di `1 + (2r mod 5)`.
Condizione e attivazione delle reazioni sono le stesse. Domanda: B trova la propria legge più spesso rispetto a un
messaggio identico che contiene una legge a caso (placebo)?

## Disegno (pre-registrato prima di ogni chiamata)

- Pre-registrazione: `preregistrazione-scambio-llm.json` (sha256 `4668976a…`), insieme a codice e test, nel
  commit `8cb70f75`. Codice: `cultural_ratchet/scambio_llm.py`; la funzione `esporta` è stata aggiunta dopo il run
  e non tocca il calcolo.
- Il contratto è il testo che accompagna la teoria: viene da un altro universo, le regole possono essere diverse, là
  era vera e qui non è garantita, punteggio ricalcolato sui dati di B.
- 4 mondi B (semi 341-344). Ogni prova parte da tutti i dati di B più la teoria ricevuta, poi 3 generazioni da
  4 agenti. Il giudice è il codice del mondo B: tiene la teoria migliore e la passa alla generazione successiva.
- Gruppi: **dono** (legge della generazione di scoperta dei semi 331, 333, 334, 335 di A) e **placebo** (stesso
  testo, legge casuale). 3 ripetizioni ciascuno: 288 chiamate.
- Regola (identica a R3e della Conferma): d(s) = quota di `law_ok` finale del dono − quella del placebo. Verde con
  almeno 3 semi validi, media ≥ 0,25, nessun d < 0, d > 0 in almeno metà dei semi.

## Esito: verde

| Seme | dono | placebo | d |
|---|---|---|---|
| 341 | 3/3 | 0/3 | 1,0 |
| 342 | 3/3 | 0/3 | 1,0 |
| 343 | 3/3 | 0/3 | 1,0 |
| 344 | 3/3 | 2/3 | 0,33 |

- Media d = **0,83**, 4 semi validi, nessuna chiamata persa.
- Legge di B trovata **12/12 con il dono**, **2/12 con il placebo**.
- **Adozione cieca 0/12**: nessuna civiltà si è tenuta la valenza di A, che in B è sbagliata (75% delle reazioni
  giuste). Hanno tenuto la parte che regge, cioè condizione e attivazione, e corretto la valenza, spesso già alla
  prima generazione (7 prove su 12).
- Costo: 1.994.202 token in 288 chiamate (stima 2,5M, tetto 3,2M).

## Lettura

La conoscenza passa fra universi con regole diverse: una civiltà AI che riceve con un contratto la legge di un altro
universo la verifica sui propri dati, la adatta e trova la propria legge molto più spesso di chi riceve un messaggio
uguale ma vuoto di contenuto. Il contratto non ha fatto passare nulla di falso.

Nel contratto della conoscenza (`kosmai-conoscenza/1`) questo è un trasferimento ri-validato nel ricevente, non
ancora un `externally_compatible`: B è sempre un mondo simulato.

## Limiti

- Universo B è vicino ad A: cambia una costante. Non sappiamo quanto lontano regga lo scambio.
- Il placebo ha una legge casuale, che tipicamente sbaglia anche condizione e attivazione; il dono porta quindi due
  regole giuste su tre. Un placebo che porti solo condizione e attivazione giuste direbbe quanto pesa la valenza
  ricevuta.
- Non c'è un gruppo "dono senza contratto": non misuriamo quanto conti il testo del contratto.
- Dati completi di B fin dall'inizio: si misura l'uso della teoria ricevuta, non la raccolta dei dati.
- Dati: `results/scambio-llm/`; sul sito: `kosmai/dati/scambi/scambio-llm.json`, verificato in CI.
