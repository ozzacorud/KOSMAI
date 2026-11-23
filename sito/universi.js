// KosmAI — "Universi che si evolvono": spazio profondo -> galassia -> pianeta.
// Legge solo dati/galassie.json, dati/evoluzione/<universo>.json e dati/<universo>/pianeta-<seme>.json.
// Ogni elemento disegnato corrisponde a un campo di quei file (vedi DESIGN-UNIVERSI.md).
(() => {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const $ = (id) => document.getElementById(id);
  const stato = { galassie: null, evo: {}, pianeti: {}, galassia: null, seme: null, gen: 1, timer: null };

  const prendi = (url) => fetch(url).then((r) => {
    if (!r.ok) throw new Error(url + ": " + r.status);
    return r.json();
  });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Generatore deterministico: lo stesso pianeta ha sempre le stesse città.
  function rng(seme) {
    let x = seme * 2654435761 >>> 0;
    return () => ((x = (x ^ (x << 13)) >>> 0, x = (x ^ (x >>> 17)) >>> 0, x = (x ^ (x << 5)) >>> 0) / 4294967296);
  }

  // ---------------------------------------------------------------- cielo
  function cielo() {
    const r = rng(7);
    let s = `<defs>
      <radialGradient id="sfondo" cx="30%" cy="30%" r="90%"><stop offset="0" stop-color="#141a3a"/><stop offset="1" stop-color="#03040b"/></radialGradient>
      <radialGradient id="atm"><stop offset=".62" stop-color="#5aa0ff" stop-opacity=".55"/><stop offset="1" stop-color="#5aa0ff" stop-opacity="0"/></radialGradient>
      <radialGradient id="bagliore"><stop offset=".3" stop-color="#f2c14e" stop-opacity=".5"/><stop offset="1" stop-color="#f2c14e" stop-opacity="0"/></radialGradient>
      <radialGradient id="corpo" cx="35%" cy="35%"><stop offset="0" stop-color="#3b4a8a"/><stop offset="1" stop-color="#151b3d"/></radialGradient>
      <radialGradient id="corpo-fermo" cx="35%" cy="35%"><stop offset="0" stop-color="#3a3a48"/><stop offset="1" stop-color="#121218"/></radialGradient>
      <radialGradient id="ombra" cx="30%" cy="30%"><stop offset=".4" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>
    </defs><rect width="1200" height="700" fill="url(#sfondo)"/>`;
    for (let i = 0; i < 380; i++) {
      s += `<circle cx="${(r() * 1200).toFixed(0)}" cy="${(r() * 700).toFixed(0)}" r="${[0.5, 0.7, 1, 1.3][Math.floor(r() * 4)]}" fill="#fff" opacity="${(0.2 + r() * 0.7).toFixed(2)}"/>`;
    }
    $("cielo").innerHTML = s;
  }

  // ---------------------------------------------------------------- pianeta
  // g = una voce di evoluzione.pianeti[].generazioni[]
  function pianeta(g, R, seme, uid) {
    const r = rng(seme);
    const glow = Math.min(1, g.reazioni / 130);
    let s = `<circle r="${R * 1.38}" fill="url(#atm)" opacity="${(0.2 + 0.65 * glow).toFixed(2)}"/>`;
    if (g.anelli.legge) s += `<circle class="pulsa" r="${R * 2}" fill="url(#bagliore)"/>`;
    s += `<circle class="bordo-fuoco" r="${R}" fill="url(#${g.fermo ? "corpo-fermo" : "corpo"})"/>`;
    s += `<clipPath id="cp${uid}"><circle r="${R}"/></clipPath><g clip-path="url(#cp${uid})">`;
    const n = g.regioni.length;
    g.regioni.forEach((ok, k) => {
      const a = k * 2 * Math.PI / n - 1.2;
      const x = Math.cos(a) * R * 0.55, y = Math.sin(a) * R * 0.44;
      s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(R * 0.32).toFixed(1)}" ry="${(R * 0.2).toFixed(1)}" fill="${ok ? "#3ecf8e" : "#2a2140"}" opacity="${g.fermo && ok ? 0.55 : 0.9}"/>`;
      for (let j = 0; j < 5; j++) {
        const cx = x + (r() - 0.5) * R * 0.44, cy = y + (r() - 0.5) * R * 0.24;
        if (ok) s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${Math.max(0.8, R * 0.025).toFixed(1)}" fill="#fff6c8"/>`;
      }
    });
    s += `<circle r="${R}" fill="url(#ombra)"/></g>`;
    // anelli: regola delle reazioni, tabella esatta, legge (oro)
    const anelli = [["reazioni", "#9fb0ff"], ["tabella", "#9fb0ff"], ["legge", "#f2c14e"]];
    anelli.forEach(([k, col], i) => {
      if (!g.anelli[k]) return;
      const rr = R * (1.45 + i * 0.17);
      s += `<ellipse rx="${rr.toFixed(1)}" ry="${(rr * 0.28).toFixed(1)}" fill="none" stroke="${col}" stroke-width="${k === "legge" ? 2.4 : 1.3}" opacity=".9" transform="rotate(-14)"/>`;
    });
    // luna: la teoria prevede anche l'elemento mai osservato
    s += `<circle cx="${(R * 1.25).toFixed(1)}" cy="${(-R * 0.95).toFixed(1)}" r="${(R * 0.13).toFixed(1)}" fill="${g.nascosto ? "#fff6c8" : "#2a2140"}" stroke="#ffffff30"/>`;
    return s;
  }

  const genDi = (p, gen) => p.generazioni[Math.min(gen, p.generazioni.length) - 1];
  function statoTesto(p, g) {
    if (g.anelli.legge) return "★ legge scoperta (gen " + p.scoperta_gen + ")";
    if (g.fermo) return "fermo";
    if (g.gen === p.generazioni.length && g.gen === p.generazioni_max) return "40 generazioni, nessuna legge";
    return "in evoluzione";
  }

  // ---------------------------------------------------------------- livello 1: spazio profondo
  function livello1() {
    fermaPlay();
    $("comandi").hidden = true; $("pannelli").hidden = true;
    const G = stato.galassie;
    const pos = (id) => { const g = G.galassie.find((x) => x.id === id); return [g.x * 1200, g.y * 620]; };
    let s = "";
    G.scambi.forEach((c) => {
      const [x1, y1] = pos(c.da), [x2, y2] = pos(c.a);
      s += `<path class="filo" d="M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - 80} ${x2},${y2}"><title>Scambio di conoscenza tra universi: fase futura, non ancora nei dati</title></path>`;
    });
    G.galassie.forEach((g, i) => {
      const [x, y] = pos(g.id), r = g.stato === "esplorabile" ? 110 : g.stato === "futura" ? 70 : 70;
      const rr = rng(100 + i);
      s += `<g class="galassia${g.stato === "esplorabile" ? "" : " spenta"}" data-id="${g.id}" tabindex="0" role="button" aria-label="${esc(g.nome)}: ${esc(g.descrizione)}">`;
      if (g.stato === "futura") {
        s += `<ellipse class="alone" cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.45}" fill="none" stroke="#9aa0b8" stroke-dasharray="5 6" transform="rotate(10 ${x} ${y})"/><circle cx="${x}" cy="${y}" r="6" fill="#9aa0b8"/>`;
      } else {
        s += `<defs><radialGradient id="gal${i}"><stop offset="0" stop-color="#fff2c8"/><stop offset=".18" stop-color="${g.colore}" stop-opacity=".85"/><stop offset=".55" stop-color="${g.colore}" stop-opacity=".2"/><stop offset="1" stop-color="${g.colore}" stop-opacity="0"/></radialGradient></defs>`;
        s += `<ellipse class="alone" cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.45}" fill="url(#gal${i})" opacity="${g.stato === "esplorabile" ? 1 : 0.55}" transform="rotate(${-20 + i * 15} ${x} ${y})"/>`;
        for (let k = 0; k < r * 1.1; k++) {
          const a = rr() * 6.283, d = rr() * r * 0.9;
          s += `<circle cx="${(x + Math.cos(a) * d).toFixed(0)}" cy="${(y + Math.sin(a) * d * 0.45).toFixed(0)}" r="${(0.5 + rr()).toFixed(1)}" fill="#fff" opacity="${(0.3 + rr() * 0.6).toFixed(2)}"/>`;
        }
      }
      const sotto = g.stato === "esplorabile" ? `${g.pianeti} pianeti · entra` : g.stato === "futura" ? "fase futura" : `${g.pianeti} pianeti · dati da esportare`;
      s += `<text x="${x}" y="${y + r * 0.45 + 24}" text-anchor="middle" class="etichetta">${esc(g.nome)}</text>`;
      s += `<text x="${x}" y="${y + r * 0.45 + 40}" text-anchor="middle" class="etichetta-sotto">${esc(sotto)}</text></g>`;
    });
    $("livello").innerHTML = `<h1>Spazio profondo</h1>
      <p class="sotto">Ogni galassia è un universo con le sue regole. Dentro, ogni pianeta è una civiltà di agenti AI che si passa la conoscenza di generazione in generazione. Entra nella galassia accesa.</p>
      <svg viewBox="0 0 1200 620" role="group" aria-label="Galassie">${s}</svg>
      <div id="scheda" class="scheda-galassia" hidden></div>`;
    document.querySelectorAll(".galassia").forEach((el) => {
      const apri = () => {
        const g = G.galassie.find((x) => x.id === el.dataset.id);
        if (g.stato === "esplorabile") return vai(g.id);
        const sc = $("scheda");
        sc.hidden = false;
        sc.innerHTML = `<strong>${esc(g.nome)}</strong> · ${esc(g.descrizione)}<br><span class="tenue" style="color:var(--tenue)">${g.stato === "futura" ? "Non esiste ancora: serve un esperimento nuovo." : "I dati grezzi ci sono (" + esc(g.fonte) + "), l'esportazione per il sito è il prossimo passo."}</span>`;
      };
      el.addEventListener("click", apri);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apri(); } });
    });
    briciole();
  }

  // ---------------------------------------------------------------- livello 2: dentro la galassia
  function livello2() {
    const evo = stato.evo[stato.galassia];
    const g = stato.galassie.galassie.find((x) => x.id === stato.galassia);
    $("livello").innerHTML = `<h1>Galassia ${esc(g.nome)}</h1>
      <p class="sotto">${esc(g.descrizione)} Premi ▶ per vederle evolvere insieme, poi clicca un pianeta per entrarci.</p>
      <svg id="sistema" viewBox="0 0 1200 560" role="group" aria-label="Pianeti"></svg>`;
    $("comandi").hidden = false; $("pannelli").hidden = true;
    $("barra").max = Math.max(...evo.pianeti.map((p) => p.generazioni_max));
    disegna2();
    briciole();
  }

  function disegna2() {
    const evo = stato.evo[stato.galassia];
    const n = evo.pianeti.length, col = Math.min(3, n);
    let s = "";
    evo.pianeti.forEach((p, i) => {
      const x = 200 + (i % col) * 400, y = 140 + Math.floor(i / col) * 270;
      const g = genDi(p, stato.gen);
      s += `<g class="pianeta" data-seme="${p.seme}" tabindex="0" role="button" aria-label="Pianeta ${p.seme}: ${statoTesto(p, g)}" transform="translate(${x},${y})">${pianeta(g, 62, p.seme, "s" + p.seme)}</g>`;
      s += `<text x="${x}" y="${y + 112}" text-anchor="middle" class="etichetta">Pianeta ${p.seme}</text>`;
      s += `<text x="${x}" y="${y + 129}" text-anchor="middle" class="etichetta-sotto">${statoTesto(p, g)}</text>`;
    });
    $("sistema").innerHTML = s;
    document.querySelectorAll(".pianeta").forEach((el) => {
      const apri = () => vai(stato.galassia, +el.dataset.seme);
      el.addEventListener("click", apri);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apri(); } });
    });
    aggiornaBarra();
  }

  // ---------------------------------------------------------------- livello 3: un pianeta
  async function livello3() {
    const evo = stato.evo[stato.galassia];
    const p = evo.pianeti.find((x) => x.seme === stato.seme);
    const key = stato.galassia + "/" + stato.seme;
    if (!stato.pianeti[key]) stato.pianeti[key] = await prendi(`dati/${stato.galassia}/pianeta-${stato.seme}.json`);
    $("livello").innerHTML = `<h1>Pianeta ${p.seme}</h1>
      <p class="sotto">Una civiltà di 4 agenti per generazione. Ogni generazione riceve gli appunti della precedente, fa esperimenti e propone una teoria del mondo.</p>
      <svg id="grande" viewBox="-300 -170 600 340" role="img" aria-label="Pianeta ${p.seme}"></svg>
      <p id="stato-pianeta" class="stato-pianeta"></p>`;
    $("comandi").hidden = false; $("pannelli").hidden = false;
    $("barra").max = p.generazioni.length;
    if (stato.gen > p.generazioni.length) stato.gen = p.generazioni.length;
    disegna3();
    briciole();
  }

  function disegna3() {
    const evo = stato.evo[stato.galassia];
    const p = evo.pianeti.find((x) => x.seme === stato.seme);
    const dati = stato.pianeti[stato.galassia + "/" + stato.seme];
    const g = genDi(p, stato.gen), gl = dati.linea.generazioni[g.gen - 1];
    $("grande").innerHTML = `<g>${pianeta(g, 110, p.seme, "g")}</g>`;
    $("stato-pianeta").textContent = `${statoTesto(p, g)} · ${g.regioni.reduce((a, b) => a + b, 0)} elementi su ${g.regioni.length} capiti`;
    const e = gl.eredita;
    const ind = dati.indovino;
    const diario = eventi(p, dati).map((ev) =>
      `<li class="${ev.gen > g.gen ? "futuro" : ev.tipo === "scoperta" ? "oro" : ""}"><b>Gen ${ev.gen}</b> ${esc(ev.testo)}</li>`).join("");
    const curva = p.generazioni.map((x, i) => `${(i / Math.max(1, p.generazioni.length - 1) * 280 + 10).toFixed(1)},${(95 - (x.accuratezza - 0.4) / 0.6 * 85).toFixed(1)}`).join(" ");
    const cx = ((g.gen - 1) / Math.max(1, p.generazioni.length - 1) * 280 + 10).toFixed(1);
    $("pannelli").innerHTML = `
      <div class="pannello"><h2>Cosa crede la generazione ${g.gen}</h2><pre>${esc(gl.teoria.testo.replace(/^TEORIA\n/, ""))}</pre>
        <div class="riga"><span>Previsioni giuste</span><span>${Math.round(g.accuratezza * 100)}%</span></div>
        <div class="riga"><span>Tipo di teoria</span><span>${g.tipo === "law" ? "formula" : "elenco (tabella)"}</span></div></div>
      <div class="pannello"><h2>Cosa riceve in eredità</h2>
        <div class="riga"><span>Reazioni osservate</span><span>${e.reazioni}</span></div>
        <div class="riga"><span>Calori misurati</span><span>${e.calori}</span></div>
        <div class="riga"><span>Combustibili trovati</span><span>${e.combustibili}</span></div>
        <div class="riga"><span>Forno</span><span>${e.forno}</span></div>
        <svg viewBox="0 0 300 105" aria-label="Previsioni giuste per generazione"><line x1="10" x2="290" y1="10" y2="10" stroke="#2b3360" stroke-dasharray="3"></line><polyline points="${curva}" fill="none" stroke="#7c8cff" stroke-width="2.5"></polyline><circle cx="${cx}" cy="${(95 - (g.accuratezza - 0.4) / 0.6 * 85).toFixed(1)}" r="5" fill="#f2c14e"></circle></svg>
        <div class="riga"><span>Lettore solo (160 chiamate, nessuna eredità)</span><span>${ind.finale.legge_verificata ? "legge trovata" : "nessuna legge"}</span></div></div>
      <div class="pannello"><h2>Diario</h2><ul class="diario">${diario}</ul></div>`;
    aggiornaBarra();
  }

  // Diario: eventi del registro + passaggi letti da evoluzione (prima regola giusta, inizio e fine di uno stallo).
  function eventi(p, dati) {
    const ev = dati.eventi.filter((e) => e.tipo !== "nascita" || e.gen === 1).map((e) => ({ gen: e.gen, tipo: e.tipo, testo: e.testo }));
    let regola = false, fermo = false;
    p.generazioni.forEach((g) => {
      if (g.anelli.reazioni && !regola) { regola = true; ev.push({ gen: g.gen, tipo: "regola", testo: "Capiscono la regola delle reazioni: primo anello." }); }
      if (g.fermo && !fermo) ev.push({ gen: g.gen, tipo: "fermo", testo: "Le previsioni non migliorano da 5 generazioni: il pianeta si spegne, ma l'eredità continua a crescere (" + g.reazioni + " reazioni)." });
      if (!g.fermo && fermo) ev.push({ gen: g.gen, tipo: "ripresa", testo: "Si riaccende: la teoria cambia di nuovo." });
      fermo = g.fermo;
    });
    const ord = { nascita: 0, ripresa: 1, regola: 2, fermo: 3, tabella_esatta: 4, scoperta: 5 };
    return ev.sort((a, b) => a.gen - b.gen || (ord[a.tipo] ?? 9) - (ord[b.tipo] ?? 9));
  }

  // ---------------------------------------------------------------- comandi
  function aggiornaBarra() {
    $("barra").value = stato.gen;
    $("gen").textContent = "generazione " + stato.gen + " di " + $("barra").max;
    $("play").textContent = stato.timer ? "❚❚" : "▶";
    $("play").setAttribute("aria-label", stato.timer ? "Pausa" : "Riproduci");
  }
  const ridisegna = () => (stato.seme ? disegna3() : disegna2());
  function fermaPlay() { clearInterval(stato.timer); stato.timer = null; }
  $("play").addEventListener("click", () => {
    if (stato.timer) { fermaPlay(); aggiornaBarra(); return; }
    if (stato.gen >= +$("barra").max) stato.gen = 1;
    stato.timer = setInterval(() => {
      if (stato.gen >= +$("barra").max) { fermaPlay(); aggiornaBarra(); scriviHash(); return; }
      stato.gen++; ridisegna(); scriviHash();
    }, 650);
    ridisegna();
  });
  $("barra").addEventListener("input", () => { fermaPlay(); stato.gen = +$("barra").value; ridisegna(); scriviHash(); });

  // ---------------------------------------------------------------- navigazione (#galassia/seme/gen)
  function briciole() {
    const g = stato.galassia && stato.galassie.galassie.find((x) => x.id === stato.galassia);
    let h = stato.galassia ? `<button data-v="">Spazio profondo</button>` : `<span class="qui">Spazio profondo</span>`;
    if (g) h += " › " + (stato.seme ? `<button data-v="${g.id}">Galassia ${esc(g.nome)}</button>` : `<span class="qui">Galassia ${esc(g.nome)}</span>`);
    if (stato.seme) h += ` › <span class="qui">Pianeta ${stato.seme}</span>`;
    $("briciole").innerHTML = h;
    $("briciole").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => vai(b.dataset.v || null)));
  }
  function scriviHash() {
    const h = stato.galassia ? "#" + [stato.galassia, stato.seme || "", stato.gen].join("/") : "";
    history.replaceState(null, "", h || location.pathname);
  }
  async function vai(galassia, seme) {
    fermaPlay();
    stato.galassia = galassia || null; stato.seme = seme || null;
    if (!galassia) { scriviHash(); return livello1(); }
    const g = stato.galassie.galassie.find((x) => x.id === galassia);
    if (!g || g.stato !== "esplorabile") { stato.galassia = null; return livello1(); }
    if (!stato.evo[galassia]) stato.evo[galassia] = await prendi(g.dati);
    if (seme && !stato.evo[galassia].pianeti.some((p) => p.seme === seme)) stato.seme = null;
    scriviHash();
    window.scrollTo({ top: 0 });
    return stato.seme ? livello3() : livello2();
  }

  async function avvia() {
    cielo();
    try {
      stato.galassie = await prendi("dati/galassie.json");
      const [gal, seme, gen] = location.hash.slice(1).split("/");
      stato.gen = Math.max(1, +gen || 1);
      await vai(gal || null, +seme || null);
    } catch (err) {
      $("livello").innerHTML = `<h1>Dati non disponibili</h1><p class="sotto">${esc(err.message)}</p>`;
    }
  }
  avvia();
})();
