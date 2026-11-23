// KosmAI, fase 2: un sistema binario, onesto. Legge solo i file kosmai-log/1 in dati/.
// Regola: ogni elemento disegnato corrisponde a un campo dei dati.
(() => {
  "use strict";
  const DATI = "dati/conferma-d2/";
  const NS = "http://www.w3.org/2000/svg";
  const R0 = 26, R1 = 310; // raggio della prima e dell'ultima generazione possibile
  const $ = (id) => document.getElementById(id);
  const stato = { u: null, p: null, t: 0, timer: null, cache: {} };

  const el = (tag, attrs = {}, testo) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (testo !== undefined) n.textContent = testo;
    return n;
  };
  const sv = (tag, attrs = {}) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };
  const num = (x) => x.toLocaleString("it-IT");

  async function json(nome) {
    if (!stato.cache[nome]) stato.cache[nome] = fetch(DATI + nome).then((r) => {
      if (!r.ok) throw new Error(nome + ": " + r.status);
      return r.json();
    });
    return stato.cache[nome];
  }

  // ---------------------------------------------------------------- intestazione e scheda
  function intestazione(u) {
    $("titolo").textContent = u.titolo;
    $("domanda").textContent = u.domanda;
    const conScoperta = u.pianeti.filter((p) => p.scoperta_gen !== null).length;
    const lettore = u.pianeti.filter((p) => p.indovino_legge).length;
    $("esito").textContent =
      `Risultato pre-registrato: la catena trova la legge in ${conScoperta} pianeti su ${u.pianeti.length}, ` +
      `il lettore solo, con lo stesso budget e tutti i dati, in ${lettore} su ${u.pianeti.length}. ` +
      `Un solo mondo e un solo modello: è un primo risultato, non una legge di natura.`;

    const dl = $("scheda");
    const riga = (k, v) => { dl.append(el("dt", {}, k)); const d = el("dd"); d.append(v); dl.append(d); };
    const r2 = u.esito.R2e, r3 = u.esito.R3e;
    riga("Modello", u.modello);
    riga("Mondo", `livello ${u.livello}: una chimica nascosta con una legge delle valenze da scoprire`);
    riga("Catena", `fino a ${u.parametri.generazioni} generazioni da ${u.parametri.popolazione} agenti; si ferma alla prima legge verificata`);
    riga("Lettore solo", `${u.parametri.chiamate_indovino} chiamate con tutti i dati e nessuna eredità`);
    riga("Regola R2e", `${r2.esito ? "verde" : "rossa"}: media d ${r2.media} su ${r2.semi_validi} semi validi (soglia ${r2.soglia})`);
    riga("Regola R3e", `${r3.esito ? "verde" : "rossa"}: media d ${r3.media} su ${r3.semi_validi} semi validi (soglia ${r3.soglia})`);
    riga("Lettura", u.esito.lettura);
    riga("Token spesi", num(u.token_totali));
    const c = el("code", {}, u.preregistrazione.sha256);
    const pre = document.createDocumentFragment();
    pre.append(u.preregistrazione.file + " · sha256 ", c);
    riga("Pre-registrazione", pre);
    for (const l of u.limiti) $("limiti").append(el("li", {}, l));
    const dw = $("download");
    for (const f of ["universo.json", ...u.pianeti.map((p) => p.file)]) {
      const li = el("li"); li.append(el("a", { href: DATI + f, download: f }, f)); dw.append(li);
    }
    const li = el("li"); li.append(el("a", { href: "schema/kosmai-log.v1.schema.json" }, "schema kosmai-log/1")); dw.append(li);
  }

  function scelte(u) {
    const box = $("scelta-pianeta");
    for (const p of u.pianeti) {
      const b = el("button", { type: "button", class: "chip", "data-seme": p.seme, "aria-pressed": "false",
        title: p.scoperta_gen ? `scoperta alla generazione ${p.scoperta_gen}` : "nessuna scoperta in 40 generazioni" });
      b.append(el("span", { class: "punto" + (p.scoperta_gen ? " si" : "") }), `Seme ${p.seme}`);
      b.addEventListener("click", () => apri(p.seme));
      box.append(b);
    }
  }

  // ---------------------------------------------------------------- costellazione
  const raggio = (g, max) => R0 + (R1 - R0) * (g - 1) / Math.max(1, max - 1);
  const angolo = (g, a) => a * Math.PI / 2 + g * 0.37 - Math.PI / 2;
  const pos = (g, a, max) => { const r = raggio(g, max), t = angolo(g, a); return [r * Math.cos(t), r * Math.sin(t)]; };

  function disegnaCatena(p) {
    const svg = $("costellazione");
    svg.textContent = "";
    const max = p.linea.generazioni_max;
    const anelli = sv("g"), linee = sv("g"), stelle = sv("g");
    // tutti gli anelli possibili, tratteggiati: il budget di 40 generazioni
    for (let g = 1; g <= max; g++) {
      anelli.append(sv("circle", { r: raggio(g, max), fill: "none", stroke: "#1a2140", "stroke-width": 1,
        "stroke-dasharray": "2 5", "data-gen": g, class: "anello" }));
    }
    for (const gen of p.linea.generazioni) {
      for (const ag of gen.agenti) {
        const [x, y] = pos(gen.gen, ag.agente, max);
        if (gen.gen > 1) {
          // eredità: dalla generazione precedente (l'anello interno) a questo agente
          const r = raggio(gen.gen - 1, max), t = angolo(gen.gen, ag.agente);
          linee.append(sv("line", { x1: r * Math.cos(t), y1: r * Math.sin(t), x2: x, y2: y,
            class: "eredita", "data-gen": gen.gen, stroke: "#33406e", "stroke-width": 1.6 }));
        }
        const s = sv("circle", { cx: x, cy: y, r: 4, class: "stella", tabindex: 0, "data-gen": gen.gen,
          "data-agente": ag.agente, role: "button",
          "aria-label": `Generazione ${gen.gen}, agente ${ag.agente + 1}` });
        s.addEventListener("click", () => dettaglioAgente(gen, ag));
        s.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dettaglioAgente(gen, ag); } });
        stelle.append(s);
      }
    }
    const nota = sv("text", { y: R1 + 16, "text-anchor": "middle", fill: "#7a82a8", "font-size": 15 });
    nota.textContent = `anello esterno: generazione ${max}, il budget massimo`;
    svg.append(anelli, linee, stelle, nota);
  }

  function disegnaLettore(p) {
    const svg = $("lettore");
    svg.textContent = "";
    const ind = p.indovino, n = ind.chiamate, trovata = ind.finale.legge_verificata;
    // una tacca per chiamata: lo stesso budget di teoria della catena a 40 generazioni
    for (let i = 0; i < n; i++) {
      const t = i / n * 2 * Math.PI - Math.PI / 2, r = 250;
      svg.append(sv("circle", { cx: r * Math.cos(t), cy: r * Math.sin(t), r: 3, fill: "#2a3358" }));
    }
    svg.append(sv("circle", { r: trovata ? 34 : 22, fill: trovata ? "#ffd36b" : "#3a4470",
      style: trovata ? "filter: drop-shadow(0 0 18px #ffd36b)" : "" }));
    const tx = sv("text", { y: 80, "text-anchor": "middle", fill: "#8b91ab", "font-size": 20 });
    tx.textContent = trovata ? "legge trovata" : "solo una tabella";
    svg.append(tx);
    $("sotto-lettore").textContent =
      `${n} chiamate, ${num(ind.proposte)} proposte, ${num(ind.leggi_valide)} leggi valide da provare: ` +
      (trovata ? "trova la legge." : "nessuna è la legge vera.");
  }

  // ---------------------------------------------------------------- tempo
  function aggiorna(t) {
    const p = stato.p, gens = p.linea.generazioni, ult = gens.length;
    stato.t = t;
    $("barra").value = t;
    const sc = p.linea.scoperta_gen;
    $("gen-attuale").textContent = t === 0 ? "prima della vita" : `generazione ${t} di ${ult}`;
    const accesa = sc !== null && t >= sc;
    for (const s of document.querySelectorAll("#costellazione .stella")) {
      const g = +s.dataset.gen, gen = gens[g - 1];
      const vis = g <= t;
      s.style.opacity = vis ? 0.35 + 0.65 * gen.teoria.accuratezza : 0;
      s.style.pointerEvents = vis ? "auto" : "none";
      const legge = gen.teoria.legge_verificata;
      s.setAttribute("fill", legge ? "#ffd36b" : accesa ? "#ffe7a8" : "#9fb4ff");
      s.setAttribute("r", legge ? 9 : g === t ? 6 : 4.5);
      s.style.filter = legge ? "drop-shadow(0 0 10px #ffd36b)" : "";
    }
    for (const l of document.querySelectorAll("#costellazione .eredita")) {
      const g = +l.dataset.gen;
      l.style.opacity = g <= t ? 1 : 0;
      // a scoperta avvenuta si accende tutta la discendenza che l'ha resa possibile
      l.setAttribute("stroke", accesa ? "#c9a24a" : "#4a5a9a");
    }
    for (const a of document.querySelectorAll("#costellazione .anello")) {
      const g = +a.dataset.gen;
      a.setAttribute("stroke", g <= t ? "#3a4785" : g <= ult ? "#2a3463" : "#232b52");
    }
    for (const li of document.querySelectorAll("#cronaca li")) {
      const g = +li.dataset.gen;
      li.classList.toggle("futuro", g > t);
      li.classList.toggle("attuale", g === t);
    }
    $("sotto-catena").textContent = sc
      ? `scoperta alla generazione ${sc} · ${4 * gens.length} chiamate di teoria`
      : `nessuna scoperta in ${ult} generazioni · ${4 * gens.length} chiamate di teoria`;
  }

  function play() {
    const ult = stato.p.linea.generazioni.length;
    if (stato.timer) return ferma();
    if (stato.t >= ult) aggiorna(0);
    $("play").textContent = "❚❚"; $("play").setAttribute("aria-label", "Pausa");
    const passo = matchMedia("(prefers-reduced-motion: reduce)").matches ? 250 : 700;
    stato.timer = setInterval(() => {
      if (stato.t >= ult) return ferma();
      aggiorna(stato.t + 1);
    }, passo);
  }
  function ferma() {
    clearInterval(stato.timer); stato.timer = null;
    $("play").textContent = "▶"; $("play").setAttribute("aria-label", "Riproduci");
  }

  // ---------------------------------------------------------------- cronaca e dettaglio
  const NOMI = { legge_inventata: "è una formula, non una tabella", verifica_codice: "il codice del mondo la conferma",
    controllo_battuto: "il lettore solo non l'ha trovata", tracciabile: "tutte le chiamate sono nel registro" };

  function cronaca(p) {
    const ol = $("cronaca");
    ol.textContent = "";
    const voci = p.eventi.filter((e) => e.tipo !== "nascita" || e.gen === 1);
    const ult = p.linea.generazioni.length;
    for (const e of voci) {
      const li = el("li", { "data-gen": e.gen, tabindex: 0 });
      if (e.lampo) li.append(el("span", { class: "lampo " + e.lampo }, "lampo " + e.lampo));
      li.append(e.testo);
      const vai = () => { ferma(); aggiorna(e.gen); if (e.criteri) dettaglioEvento(e); };
      li.addEventListener("click", vai);
      li.addEventListener("keydown", (k) => { if (k.key === "Enter") vai(); });
      ol.append(li);
    }
    if (p.linea.scoperta_gen === null) {
      ol.append(el("li", { "data-gen": ult },
        `Generazione ${ult}: il budget finisce. La catena ha una tabella, ma non la legge.`));
    }
  }

  function dettaglioEvento(e) {
    const d = $("dettaglio");
    d.textContent = "";
    d.append(el("p", {}, e.testo));
    const ul = el("ul", { class: "criteri" });
    for (const [k, v] of Object.entries(e.criteri)) ul.append(el("li", { class: v ? "si" : "" }, NOMI[k]));
    d.append(el("p", { class: "tenue" }, `Criteri di scoperta (lampo ${e.lampo}):`), ul);
  }

  function dettaglioAgente(gen, ag) {
    const d = $("dettaglio");
    d.textContent = "";
    d.append(el("p", {}, `Generazione ${gen.gen}, agente ${ag.agente + 1}. ` +
      (gen.gen > 1 ? `Ha ricevuto l'eredità della generazione ${gen.gen - 1}: ` : "Nessuna eredità: ") +
      `${gen.eredita.reazioni} reazioni, ${gen.eredita.calori} misure termiche.`));
    if (ag.esperimenti) { d.append(el("p", { class: "tenue" }, "Esperimenti chiesti:")); d.append(el("pre", {}, ag.esperimenti)); }
    if (ag.teorie) { d.append(el("p", { class: "tenue" }, "Teorie proposte:")); d.append(el("pre", {}, ag.teorie)); }
    d.append(el("p", { class: "tenue" }, `Teoria che la generazione tramanda (accuratezza ${gen.teoria.accuratezza}` +
      (gen.teoria.legge_verificata ? ", legge verificata" : "") + "):"));
    d.append(el("pre", {}, gen.teoria.testo || "nessuna"));
    if (ag.tracce.length) d.append(el("p", { class: "tenue" }, "Registro: " + ag.tracce.map((t) => t.chiave).join(" · ")));
  }

  function prova(p) {
    const box = $("prova-eredita"), g = $("prova-griglia");
    g.textContent = "";
    if (!p.binario) {
      box.hidden = false;
      $("prova-testo").textContent = "Questo pianeta non ha una scoperta, quindi non c'è un'eredità da mettere alla prova.";
      return;
    }
    const b = p.binario;
    $("prova-testo").textContent =
      `Si riparte dalla generazione ${b.partenza_gen}, prima della scoperta. Quattro eredi ricevono l'eredità vera; ` +
      `quattro placebo ricevono un'eredità della stessa forma ma rimescolata. Due generazioni a testa: chi trova la legge?`;
    for (const gruppo of ["erede", "placebo"]) {
      const pr = b.prove.filter((x) => x.gruppo === gruppo);
      const ok = pr.filter((x) => x.fine.legge_verificata).length;
      const div = el("div", { class: "gruppo" });
      div.append(el("strong", {}, gruppo === "erede" ? "Eredità vera" : "Eredità rimescolata"),
        el("span", { class: "tenue" }, ` · ${ok} su ${pr.length} trovano la legge`));
      const st = el("div", { class: "stelline" });
      for (const x of pr) st.append(el("span", { class: "stellina" + (x.fine.legge_verificata ? " si" : ""),
        title: `ripetizione ${x.rip + 1}: ${x.fine.legge_verificata ? "legge trovata" : "nessuna legge"}` }));
      div.append(st);
      g.append(div);
    }
  }

  // ---------------------------------------------------------------- avvio
  async function apri(seme) {
    ferma();
    const voce = stato.u.pianeti.find((p) => p.seme === seme);
    stato.p = await json(voce.file);
    for (const b of document.querySelectorAll(".chip")) b.setAttribute("aria-pressed", String(+b.dataset.seme === seme));
    const ult = stato.p.linea.generazioni.length;
    $("barra").max = ult;
    disegnaCatena(stato.p); disegnaLettore(stato.p); cronaca(stato.p); prova(stato.p);
    $("dettaglio").innerHTML = '<p class="tenue">Tocca una stella per leggere cosa ha fatto quell\'agente.</p>';
    aggiorna(ult);
    try { history.replaceState(null, "", "#seme-" + seme); } catch (_) { /* file:// */ }
  }

  async function avvio() {
    try {
      stato.u = await json("universo.json");
    } catch (e) {
      $("esito").textContent = "Impossibile leggere i dati: " + e.message;
      return;
    }
    intestazione(stato.u); scelte(stato.u);
    $("barra").addEventListener("input", (e) => { ferma(); aggiorna(+e.target.value); });
    $("play").addEventListener("click", play);
    const h = location.hash.match(/seme-(\d+)/);
    const preferito = stato.u.pianeti.find((p) => h && p.seme === +h[1]) ||
      stato.u.pianeti.filter((p) => p.scoperta_gen && !p.indovino_legge).sort((a, b) => a.scoperta_gen - b.scoperta_gen)[0] ||
      stato.u.pianeti[0];
    await apri(preferito.seme);
  }
  avvio();
})();
