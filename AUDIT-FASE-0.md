# KosmAI, fase 0: audit della base esistente

Fase 0 di `MISSIONE-SCIENTIFICA.md` (PR #238): matrice **capacità → implementazione → test → evidenza → lacuna**.
Fatta il 2026-11-23, solo CPU, nessuna chiamata AI. Base: `main` dopo il merge di #237 e #238.

## Verifiche rifatte oggi

| Verifica | Comando | Esito |
|---|---|---|
| Tutti i test di cultural-ratchet | `python3 -m unittest discover -s tests -t .` | 322 test verdi (44 s) |
| World Simulation Lab (PR #129) | `python3 -m unittest test_nexus_world_lab` in `02_PROJECTS/sovereignty/scripts` | 4 test verdi |
| Verdetto della conferma ricalcolato dai registri (PR #229) | `python3 -m cultural_ratchet.conferma preregistrazione-conferma.json --stadio analisi --dati <copia di results/conferma>` | `analisi.json` **identico** a quello committato (R2e 0,6, R3e 0,75) |
| Dati del sito ricavati dai registri (PR #230, #231, #237) | CI `kosmai-verifica` | verde: export e evoluzione identici ai file pubblicati |
| Replay di MVP-4, scambio fra universi (`aud/rete.py`, istanze 4000-4059, ~15 min) | `python3 -m cultural_ratchet.aud.rete <dir> 4000 60 80` | `mvp4.json` **identico**: falsi accettati 11 con contratto contro 687 senza, 189/189 manomessi rilevati, provenienza 61/61 |

## Audit già fatti prima

- `audit/` (PR #221) e la roadmap di audit nel repo Cognitive-multi-world-architecture (PR #2, bozza): A0 provenienza
  trovò 0 risultati prima del gate ma **6 gate committati insieme ai risultati** (fase 6, `f7_p1`): quelle evidenze
  valgono meno di una pre-registrazione vera. A1 (mondo minimo): una sola legge in tutti i semi, identificabile fino a
  taglia 7; la legge D2 resta la più difficile.

## Le PR citate nella missione

| PR | Cosa è | Stato | Lettura |
|---|---|---|---|
| #129 | World Simulation Lab: Game Master unico autore dello stato, digest degli episodi | unita | utile come **schema** per separare agenti e mondo; non usata da cultural-ratchet |
| #173 | prototipo cultural-ratchet, mondo minimo, programma AUD MVP-1 → MVP-10 | unita | base di tutto il motore attuale |
| #185 | prova B: Qwen 7B locale, legge corta e sbagliata | chiusa, contenuto unito con #208 | esito negativo registrato |
| #186 | gemello con Sonnet: R1 e R4 verdi, R2 e R3 rossi | chiusa, contenuto unito con #208 | esito misto registrato; ha portato al mondo calibrato |
| #230, #231 | contratto `kosmai-log/1` e sito costellazione | unite | dati ricavati dai registri, verificati in CI |
| #237 | universi che si evolvono | unita | osservatorio, ogni elemento visivo da un campo |

## Matrice

Legenda evidenza: **forte** = gate pre-registrato superato e replicato; **media** = gate superato una volta o con
cautele dichiarate; **debole** = solo strutturale o per costruzione; **nessuna**.

| Componente della missione | Implementazione oggi | Test | Evidenza | Lacuna |
|---|---|---|---|---|
| 3.1 Definizione dell'universo | `aud/blueprint.py` (`aud.blueprint/1`, leggi come espressioni, validazione); `calibrato.py` (`MondoCalibrato`, livelli D1-D4); `aud/sequenze.py` (`aud.blueprint/2`, dominio non chimico) | `test_aud_core`, `test_calibrato`, `test_aud_sequenze` | media | niente unità di misura né costanti fisiche: mondi giocattolo a interi; il mondo calibrato non è ancora un blueprint |
| 3.2 Motore di simulazione | `minimal_world`, `open_world`, `llm_world`; deterministico per seme; registri JSONL con ripresa (`gemello.py`) | `test_minimal_world`, `test_open_world`, `test_llm_world`, `test_gemello` | forte per determinismo e ripresa (verdetto ricalcolato identico) | un solo tipo di dinamica (reazioni a soglia); nessun tempo continuo, nessun checkpoint generico |
| 3.3 Agenti sperimentatori | agenti casuali (`open_world`), LLM locale e Sonnet via `claude -p` (`llm_world`, `gemello`), strategie evolute (`aud/strategia.py`) | `test_llm_world`, `test_aud_strategia` | forte: la catena di Sonnet scopre ciò che il lettore solo non trova (conferma 331-336) | gli agenti scelgono esperimenti in un formato fisso; non progettano domande nuove |
| 3.4 Regia degli esperimenti | pre-registrazioni JSON con sha256 committate prima delle chiamate; tetti di token; guardie (`calibrato.guardie`) | `test_conferma`, `test_estensione`, `test_replica` | forte | regia per esperimento, non un orchestratore comune; distinzione esplorazione/conferma fatta a mano |
| 3.5 Registro della conoscenza | Discovery Record con stati epistemici (`aud/motore.py`); contratti sigillati con hash (`aud/contratti.py`); registri delle chiamate; esiti negativi nel README | `test_aud_motore`, `test_aud_trasferimento` | media: stati e sigilli esistono e sono testati | nessun registro unico fra esperimenti; gli stati di AUD non coincidono con gli 8 stati della missione |
| 3.6 Verifica indipendente | `law_ok` calcolato dal codice del mondo, mai dall'agente; falsificazione indipendente (MVP-3 G3a, p 0,005); controllore di regole (fase 7) | `test_aud_motore`, `test_aud_controllore` | forte per le leggi | per le tabelle il pianificatore non batte il casuale (MVP-3, F5-a non superato) |
| 3.7 Reality Bridge | primo dominio reale: convenzioni di codice fra repository (fase 6-7, `aud/codice.py`, `aud/controllore.py`, gate su BRAIN 13/0, p 0,00012) | `test_aud_codice`, `test_aud_controllore` | media, ma in un dominio software, non fisico o chimico | **nessun confronto con dati fisici o chimici reali** |
| 3.8 Osservatorio | sito KosmAI: costellazione e universi che si evolvono | `test_kosmai` + CI `kosmai-verifica` | forte per "ogni elemento = un campo" | una sola galassia esportata; nessuno stato epistemico mostrato |
| §4 Ciclo end-to-end | MVP-10 ecosistema: un comando, replay, audit (`aud/ecosistema.py`), superato alla fase 3 (14/15, p 0,0005) e generalizzato in F4-1a | `test_aud_ecosistema` | media: gira end-to-end su mondi che differiscono per un parametro | il ciclo non arriva al confronto esterno; nessuna previsione quantitativa su un dominio reale |
| §4.1 Stati epistemici | catena sigillata `observation → hypothesis → validated` o `rejected` con transizioni ammesse (`aud/motore.py`, `aud.discovery/1`); visivo → stato in `DESIGN-UNIVERSI.md` | `test_aud_motore` | media: 4 stati con transizioni controllate, contro 8 nella missione | mancano `internally_reproduced`, `generalized`, `externally_compatible`, `experimentally_validated` `inconclusive` |
| §5 Contratto della conoscenza | `aud.transfer/1` e KTC sigillati; `kosmai-log/1` | `test_aud_trasferimento`, `test_kosmai` | media | campi della missione mancanti: unità, incertezza, dominio di validità, `transfer_requirements` |
| Fase 4 Universi alternativi | MVP-2 evoluzione dei blueprint (superato in fase 3, valenza inclusa); famiglie A-G; livelli D1-D4 | `test_aud_evoluzione`, `test_aud_fase4` | media | variazioni su interi e moduli, non costanti con unità |
| Fase 5 Scambio e trasferimento | MVP-1 trasferimento ri-validato nel destinatario; **MVP-4 scambio fra universi solo via contratto** (falsi accettati con contratto < senza, p < 0,0001); MVP-5 meta-scoperta fra universi (p 0,000003) | `test_aud_trasferimento`, `test_aud_rete`, `test_aud_meta` | forte per agenti casuali | **mai con agenti LLM**: le civiltà di Sonnet non si sono mai scambiate conoscenza |
| Fase 6 Il nostro universo | nessuna | - | nessuna | tutto da fare |

## Correzione a quanto detto oggi

Nella PR #237 i bagliori tra galassie sono segnati come "fase futura, non nei dati". È vero per le **civiltà di
Sonnet** mostrate sul sito, ma il motore AUD ha già lo scambio fra universi via contratto (MVP-4, 720 messaggi fra
mondi diversi, con manomissioni rilevate e ri-validazione) e la meta-scoperta fra universi (MVP-5), con agenti
casuali. Quei dati si possono esportare e disegnare come bagliori veri a costo zero.

## Cosa conviene fare dopo (in ordine di costo)

1. **Costo zero:** esportare MVP-4 e MVP-5 come galassie e bagliori veri sul sito (scambio fra universi con agenti
   casuali, dichiarato così).
2. **Costo zero:** contratto della conoscenza della missione (fase 1): unire `kosmai-log/1`, Discovery Record e
   `aud.transfer/1`, aggiungere gli 8 stati con regole di transizione, unità, incertezza e dominio di validità;
   validatore e test.
3. **Costo zero:** Universo B della missione sul mondo calibrato con agenti casuali: cambiare il periodo della
   valenza (5 → 7) e misurare quali relazioni reggono.
4. **Con token, da approvare:** lo stesso scambio fra universi con le civiltà di Sonnet (prima volta che agenti LLM
   si passano conoscenza fra mondi con regole diverse). Stima da fare con una pre-registrazione, ordine di grandezza
   della conferma (circa 19M token).
5. **Più avanti:** un primo dominio fisico o chimico reale con unità e benchmark noti, per il Reality Bridge.

## Aggiornamento 23/11 pomeriggio

- Passo 2 fatto: contratto della conoscenza `kosmai-conoscenza/1` (`cultural_ratchet/kosmai_conoscenza.py`), 8 stati,
  transizioni un passo alla volta con evidenza del tipo richiesto, verificatore diverso dal proponente, sigillo sha256.
  Le 4 scoperte della conferma arrivano a `generalized`, nessuna oltre.
- Passo 3 fatto: Universo B (`UNIVERSO-B.md`), tutte e tre le previsioni confermate.

## Aggiornamento 23/11 sera

- Passo 4 fatto: scambio fra universi con civiltà di Sonnet (`SCAMBIO-LLM.md`), verde: legge di B trovata 12/12 con
  il dono contro 2/12 con il placebo, adozione cieca 0/12, circa 2M token. La riga "Fase 5" della matrice non è più
  "mai con agenti LLM".
