# KOSMAI — Missione scientifica e architettura di ricerca

**Stato:** proposta architetturale da validare  
**Ambito:** evoluzione del progetto KosmAI oltre la visualizzazione dei micro-universi  
**Documento collegato:** `README.md` (contratto `kosmai-log/1`)  
**Esperienza visuale collegata:** PR #237 — *KosmAI fase 3: universi che si evolvono*

---

## 1. Tesi e missione

KosmAI non deve limitarsi a costruire un multiverso artificiale da osservare. Deve diventare una **piattaforma sperimentale per esplorare sistemi governati da leggi fisiche, chimiche e matematiche, cercare fenomeni emergenti e verificare se le conoscenze ottenute possano contribuire alla comprensione del nostro universo**.

La missione è:

> Generare mondi artificiali coerenti, farli evolvere, permettere ad agenti di formulare ed eseguire esperimenti, individuare regolarità e ipotesi nuove, sottoporle a verifiche indipendenti e confrontare i risultati con modelli ed evidenze del mondo reale.

La visualizzazione immersiva — spazio profondo, galassie, universi, pianeti e agenti — è una finestra osservativa sul sistema. Non è il motore scientifico e non deve determinarne il comportamento.

### 1.1 Tre capacità fondamentali

1. **Replicare:** ricostruire fenomeni conosciuti in ambienti controllati e verificare che il sistema sappia riscoprire relazioni già note.
2. **Esplorare:** variare leggi, parametri e condizioni iniziali in modo controllato per cercare fenomeni e relazioni non ancora note agli agenti.
3. **Trasferire:** confrontare le conoscenze tra universi e con il nostro universo, conservando provenienza, limiti, incertezza e condizioni di validità.

Il trasferimento non equivale a dichiarare vera una scoperta. Un risultato ottenuto in un universo artificiale è, inizialmente, valido soltanto all'interno del modello che lo ha prodotto.

---

## 2. Principi non negoziabili

- **Rigore prima della spettacolarità:** la priorità è dimostrare un ciclo scientifico completo, non generare centinaia di universi scenografici.
- **Separazione tra simulazione e rendering:** la simulazione deve poter continuare, essere ripresa e analizzata senza la UI aperta.
- **Leggi coerenti:** non modificare costanti o parametri in modo arbitrario. Ogni universo deve dichiarare il proprio modello, le equazioni, le unità, i vincoli e il dominio di validità.
- **Riproducibilità:** esperimenti, semi casuali, configurazioni, versioni dei modelli e risultati devono essere tracciabili.
- **Indipendenza della verifica:** chi formula un'ipotesi non deve essere l'unico soggetto che la convalida.
- **Nessuna scoperta per dichiarazione:** una teoria formulata da un agente non è una scoperta verificata.
- **Confronto leale:** i benchmark devono avere controlli, budget comparabili e criteri definiti prima dell'esecuzione.
- **Incertezza esplicita:** ogni risultato deve distinguere evidenza, inferenza, limite e ciò che non è determinabile.
- **Nessun trasferimento silenzioso:** una conoscenza importata in un altro universo deve essere rivalutata nel contesto ricevente.

---

## 3. Architettura logica

L'architettura deve separare responsabilità e contratti. I nomi seguenti descrivono componenti logiche: non implicano che esistano già come servizi o moduli implementati.

### 3.1 Universe Definition — definizione dell'universo

Descrive in modo versionato:

- leggi e relazioni matematiche attive;
- costanti e parametri, con unità e intervalli ammessi;
- modello della materia o degli elementi simulati;
- condizioni iniziali e al contorno;
- regole di interazione;
- risoluzione, approssimazioni e limiti numerici;
- seed, versione del motore e hash della configurazione.

Un universo deve essere ricostruibile a partire dalla sua definizione e dagli input dichiarati.

### 3.2 Simulation Engine — motore di simulazione

Esegue le dinamiche del mondo e produce osservazioni strutturate. Deve essere indipendente dal renderer e offrire:

- avanzamento deterministico quando il modello lo consente;
- checkpoint, ripresa e replay;
- controllo del tempo simulato;
- esecuzioni parallele e confrontabili;
- log degli eventi e delle condizioni;
- gestione esplicita degli errori numerici e delle simulazioni non valide.

Non è necessario che ogni universo usi lo stesso motore fisico: serve un'interfaccia comune che dichiari capacità e limiti di ciascun motore.

### 3.3 Agent Layer — agenti sperimentatori

Gli agenti possono:

- osservare dati e fenomeni disponibili;
- proporre domande e ipotesi;
- progettare esperimenti;
- scegliere variabili da modificare entro i limiti autorizzati;
- raccogliere risultati;
- aggiornare o abbandonare le proprie teorie;
- documentare il ragionamento e i dati usati.

Gli agenti non possono certificare da soli le proprie scoperte. Le loro affermazioni devono diventare oggetti verificabili.

### 3.4 Experiment Orchestrator — regia degli esperimenti

Gestisce esperimenti preregistrati, controlli, repliche, budget, assegnazione degli agenti e raccolta dei risultati. Deve distinguere:

- esplorazione libera;
- esperimento confermativo;
- replica indipendente;
- test di generalizzazione;
- confronto tra universi.

### 3.5 Discovery & Knowledge Ledger — registro della conoscenza

Ogni ipotesi, risultato o scoperta deve avere un'identità persistente e una provenienza completa. Il registro deve conservare anche risultati negativi, falsificazioni e tentativi falliti: non soltanto le scoperte positive.

### 3.6 Independent Verification — verifica indipendente

Un componente distinto valuta le affermazioni senza assumere come veri i risultati dell'agente proponente. Quando possibile deve usare:

- dati non utilizzati per formulare l'ipotesi;
- condizioni iniziali o parametri tenuti da parte;
- implementazioni o metodi numerici indipendenti;
- agenti o modelli differenti;
- controlli e baseline preregistrati.

### 3.7 Reality Bridge — collegamento con il nostro universo

Confronta una conoscenza candidata con modelli, dataset e risultati sperimentali reali. Deve dichiarare quale livello di confronto è stato effettivamente raggiunto:

1. compatibilità matematica;
2. compatibilità con un modello fisico o chimico noto;
3. compatibilità con dati osservativi o sperimentali;
4. replica indipendente;
5. validazione da parte della comunità scientifica o di un esperimento esterno.

KosmAI non deve presentare il livello 1 o 2 come prova sperimentale.

### 3.8 Observer Experience — esperienza immersiva

L'interfaccia mostra lo stato reale della simulazione e permette di esplorare galassie, universi, sistemi, agenti, fenomeni, esperimenti e scoperte. Deve poter visualizzare:

- tempo e generazioni;
- condizioni e leggi dell'universo;
- eventi significativi;
- esperimenti in corso e completati;
- ipotesi, prove e incertezze;
- relazioni e trasferimenti tra universi;
- storia, checkpoint e rami controfattuali.

La UI non deve inventare animazioni o eventi per rendere il mondo più interessante. Ogni rappresentazione scientifica deve derivare da dati o essere chiaramente indicata come visualizzazione illustrativa.

---

## 4. Ciclo scientifico end-to-end

Il ciclo centrale di KosmAI è:

1. **Domanda:** definire una domanda scientifica circoscritta e misurabile.
2. **Modello:** selezionare o costruire un universo con leggi, parametri e limiti dichiarati.
3. **Preregistrazione:** definire ipotesi iniziali, variabili, controlli, metriche, budget e criteri di successo.
4. **Esplorazione:** eseguire simulazioni e permettere agli agenti di progettare esperimenti.
5. **Ipotesi:** trasformare una regolarità osservata in una relazione esplicita e falsificabile.
6. **Previsione:** produrre una previsione quantitativa su condizioni non ancora esaminate.
7. **Replica:** ripetere il test con nuovi seed, dati held-out o un'implementazione indipendente.
8. **Verifica:** controllare accuratezza, generalizzazione, robustezza e spiegazioni alternative.
9. **Confronto esterno:** verificare se la relazione è pertinente e compatibile con modelli o dati del nostro universo.
10. **Valutazione:** assegnare uno stato epistemico e conservare tutte le evidenze.
11. **Trasferimento:** rendere la conoscenza disponibile ad altri universi solo come ipotesi da rivalutare nel nuovo contesto.

### 4.1 Stati epistemici obbligatori

Ogni risultato deve avere uno stato esplicito, senza salti automatici:

- `proposed`: ipotesi proposta;
- `simulated`: effetto osservato nel modello;
- `internally_reproduced`: replica interna riuscita;
- `generalized`: previsione superata su condizioni non viste;
- `externally_compatible`: compatibile con un modello o dato esterno dichiarato;
- `experimentally_validated`: verificato da evidenza sperimentale indipendente;
- `rejected`: confutato o non riprodotto;
- `inconclusive`: evidenza insufficiente o ambigua.

Gli stati non sono un punteggio di marketing: devono essere sostenuti da evidenze archiviate e da regole di transizione verificabili.

---

## 5. Contratto minimo della conoscenza

Il contratto deve estendere o affiancare `kosmai-log/1` senza rompere la compatibilità con i dati già pubblicati.

Ogni oggetto conoscenza dovrebbe contenere almeno:

| Campo | Significato |
|---|---|
| `knowledge_id` | Identificatore stabile |
| `claim` | Affermazione precisa e falsificabile |
| `formal_relation` | Formula, algoritmo o relazione proposta |
| `universe_id` | Universo in cui è stata ottenuta |
| `model_version` | Motore e versione del modello |
| `conditions` | Condizioni e dominio di validità |
| `variables` | Variabili indipendenti e dipendenti, unità |
| `evidence_refs` | Riferimenti a dati, log e risultati |
| `method` | Procedura di scoperta e analisi |
| `prediction` | Previsione quantitativa e condizioni di test |
| `verification` | Repliche, controlli, held-out e verificatore |
| `uncertainty` | Incertezza, sensibilità e limiti |
| `epistemic_status` | Stato epistemico corrente |
| `provenance` | Agenti, prompt, tool, seed, timestamp e hash |
| `transfer_requirements` | Requisiti per valutare la compatibilità in un altro universo |

Il contratto deve consentire di risalire dalla conclusione ai dati grezzi, dalla formula all'esperimento e dall'esperimento alla configurazione esatta dell'universo.

---

## 6. Primo esperimento proposto: emergenza e scoperta di regolarità chimiche

### 6.1 Perché partire dalla chimica

La chimica offre fenomeni misurabili — reazioni, stabilità, reti di trasformazione, cinetiche e strutture — e permette di iniziare con modelli controllati prima di affrontare simulazioni quantistiche o fisiche più costose.

Questo esperimento non deve fingere di simulare tutta la chimica reale. Deve partire da un dominio circoscritto, con un modello validato e benchmark noti.

### 6.2 Disegno sperimentale

**Universo A — riferimento calibrato**

- modello di reazione o chimica computazionale con risultati di riferimento;
- parametri e unità documentati;
- fenomeni e relazioni note utilizzati come benchmark;
- agenti inizialmente ignari delle regole target, nei limiti consentiti dal disegno sperimentale.

**Universo B — variazione controllata**

- stessa famiglia di modello;
- variazione preregistrata di uno o pochi parametri;
- analisi di sensibilità;
- confronto con il riferimento per identificare quali relazioni persistono e quali cambiano.

**Universo C — esplorazione estesa**

- combinazioni di parametri ammesse dal modello;
- ricerca di regimi, transizioni e comportamenti emergenti;
- esplorazione guidata da ipotesi e metriche definite;
- nessuna interpretazione come universo fisicamente possibile senza una giustificazione teorica.

In una fase successiva si potranno studiare variazioni delle costanti fondamentali. Queste richiedono modelli coerenti: cambiare una costante senza ricalibrare equazioni, unità, scale e interazioni può produrre artefatti numerici, non nuova fisica.

### 6.3 Compiti degli agenti

1. Individuare regolarità nelle reazioni e nelle traiettorie.
2. Proporre relazioni quantitative tra condizioni e risultati.
3. Distinguere correlazioni da meccanismi causali.
4. Formulare previsioni su condizioni non osservate.
5. Progettare esperimenti che possano confutare le proprie ipotesi.
6. Confrontare i risultati con agenti indipendenti e baseline.

### 6.4 Criteri di successo

Il primo esperimento è riuscito solo se:

- gli agenti recuperano almeno un benchmark noto nel mondo di riferimento;
- una loro ipotesi è formalizzata in modo non ambiguo;
- produce una previsione quantitativa su dati held-out;
- un verificatore indipendente riproduce il risultato;
- la relazione supera controlli contro overfitting e coincidenze;
- il risultato, inclusi limiti e incertezza, è riproducibile da una terza esecuzione.

Una relazione nuova rispetto alla conoscenza degli agenti non è automaticamente nuova per la scienza. La novità scientifica richiede una ricerca bibliografica e una valutazione esperta separate.

### 6.5 Esiti possibili

- **Riscoperta:** il sistema ritrova una relazione nota.
- **Generalizzazione:** il sistema estende una relazione nota a un dominio supportato.
- **Nuova regolarità interna:** emerge una relazione valida nel modello artificiale, senza evidenza di trasferibilità reale.
- **Candidata al confronto reale:** la relazione ha una formulazione e una previsione che possono essere confrontate con dati o modelli esterni.
- **Confutazione:** i controlli mostrano che la relazione non regge.

Tutti gli esiti sono utili e vanno registrati. Un risultato negativo ben documentato evita di ripetere esperimenti falliti.

---

## 7. Roadmap incrementale

### Fase 0 — Audit della base esistente

- verificare lo stato effettivo di PR #129, #173, #185, #186, #230, #231 e #237;
- distinguere codice, risultati, prototipi visuali e affermazioni non ancora riprodotte;
- identificare componenti riutilizzabili e lacune;
- non assumere che i risultati storici siano ancora validi senza ripetere i test pertinenti.

**Deliverable:** matrice capacità → implementazione → test → evidenza → lacuna.

### Fase 1 — Contratto scientifico

- definizione versionata di universo, esperimento, osservazione, ipotesi, prova e conoscenza;
- provenienza, hash, unità, incertezza e stato epistemico;
- compatibilità con `kosmai-log/1`;
- validatore e test di schema.

**Gate:** nessuna conoscenza senza provenienza e dominio di validità.

### Fase 2 — Universo di riferimento

- un dominio fisico/chimico limitato;
- benchmark noti e dati di controllo;
- motore riproducibile, checkpoint e replay;
- agenti che tentano di riscoprire relazioni note.

**Gate:** benchmark superati con controlli e budget comparabili.

### Fase 3 — Esperimenti autonomi

- progettazione esperimenti da parte degli agenti;
- ipotesi formalizzate e previsioni;
- dati held-out e replica indipendente;
- misurazione di falsi positivi, falsi negativi e costo.

**Gate:** almeno una previsione non banale verificata indipendentemente.

### Fase 4 — Universi alternativi

- variazioni controllate e coerenti dei parametri;
- confronto tra universi;
- mappa dei fenomeni invarianti e delle transizioni;
- registrazione dei limiti di ciascun modello.

**Gate:** risultati riproducibili e attribuibili alle variazioni dichiarate.

### Fase 5 — Scambio e trasferimento

- esportazione delle conoscenze con contratto comune;
- importazione come ipotesi, mai come verità;
- test di compatibilità nel mondo ricevente;
- ledger dei trasferimenti accettati, rifiutati e inconcludenti.

**Gate:** nessun trasferimento accettato senza nuova verifica nel contesto ricevente.

### Fase 6 — Reality Bridge

- adapter verso modelli e dataset fisici/chimici reali;
- confronto delle previsioni;
- test su dati indipendenti;
- documentazione dei limiti e revisione esperta.

**Gate:** una candidata deve produrre una previsione falsificabile e confrontabile con evidenze esterne.

### Fase 7 — Multiverso e osservatorio immersivo completo

- esecuzioni parallele su più universi;
- reti di conoscenze e dipendenze tra universi;
- esplorazione visuale sincronizzata con lo stato reale;
- timeline, checkpoint, rami controfattuali e storia delle scoperte.

Questa fase amplia l'esperienza e la scala, ma non sostituisce i gate scientifici precedenti.

---

## 8. Piano di test e audit

| Area | Test richiesto |
|---|---|
| Definizione universo | Validazione schema, unità, vincoli e parametri |
| Determinismo | Replay con stessi input e seed |
| Simulazione | Confronto con benchmark e soluzioni di riferimento |
| Agenti | Ipotesi formalizzabili, tracciabilità e budget |
| Scoperta | Precisione, falsi positivi, falsi negativi |
| Generalizzazione | Test su condizioni e dati held-out |
| Verifica indipendente | Secondo metodo, agente o implementazione |
| Trasferimento | Compatibilità e nuova verifica nel ricevente |
| Reality Bridge | Confronto con dati esterni e incertezza |
| UI | Corrispondenza uno-a-uno tra dati scientifici e rappresentazione |
| Robustezza | Errori numerici, timeout, checkpoint e ripresa |
| Governance | Nessuna promozione automatica dello stato epistemico |

Ogni esperimento deve produrre un report con configurazione, ipotesi, budget, dati, metriche, risultati, controlli, limiti e decisione finale.

---

## 9. Metriche di progetto

Le metriche principali non sono il numero di universi o di agenti, ma:

- percentuale di benchmark noti recuperati;
- precisione delle scoperte dichiarate;
- tasso di falsi positivi;
- percentuale di ipotesi che producono previsioni verificabili;
- tasso di successo su dati held-out;
- replicabilità indipendente;
- robustezza a variazioni dei parametri;
- trasferimenti correttamente accettati e rifiutati;
- costo computazionale per risultato verificato;
- numero di candidati che raggiungono un confronto esterno significativo.

Il numero di scoperte non deve essere ottimizzato isolatamente: incentivarlo senza controlli aumenterebbe il rischio di falsi positivi.

---

## 10. Cosa non fare in questa fase

- Non costruire subito un grande motore universale che pretende di simulare ogni legge fisica.
- Non confondere un mondo visivamente convincente con un modello scientificamente valido.
- Non introdurre centinaia di agenti prima di misurare il contributo di pochi agenti ben controllati.
- Non cambiare costanti fondamentali in modelli che non restano matematicamente coerenti.
- Non trasferire teorie tra universi senza test di compatibilità.
- Non dichiarare una nuova legge della natura sulla base di una simulazione artificiale.
- Non sostituire i test indipendenti con il consenso tra agenti che condividono gli stessi dati o bias.
- Non usare la UI come fonte di verità: la fonte è il ledger scientifico e la provenienza dei dati.

---

## 11. Risultato atteso del primo ciclo di sviluppo

Il primo traguardo concreto di KosmAI non è un multiverso enorme. È un prototipo scientifico limitato che dimostri:

1. un universo definito da un modello e da parametri riproducibili;
2. un fenomeno misurabile;
3. agenti che formulano un'ipotesi falsificabile;
4. una previsione su condizioni non viste;
5. una verifica indipendente;
6. un risultato registrato con provenienza, incertezza e limiti;
7. un confronto documentato con un modello o dato esterno, se pertinente.

**Criterio di uscita:** almeno un ciclo completo e riproducibile, con un risultato il cui stato epistemico sia assegnato correttamente. Se il risultato non è nuovo o non è trasferibile al mondo reale, il prototipo può comunque essere considerato riuscito sul piano metodologico, purché lo dichiari senza ambiguità.

## 12. Decisione architetturale proposta

Adottare questa direzione come missione scientifica di KosmAI:

**KosmAI = motore di universi artificiali + laboratorio di esperimenti autonomi + sistema di scoperta e verifica + ponte controllato verso la scienza del nostro universo + osservatorio immersivo.**

La UI rende esplorabile il multiverso. Il motore genera i fenomeni. Gli agenti li investigano. Il sistema indipendente verifica le affermazioni. Il Reality Bridge stabilisce se esiste un collegamento credibile con il mondo reale.

La priorità assoluta è chiudere il primo ciclo scientifico end-to-end prima di ampliare la scala del multiverso.
