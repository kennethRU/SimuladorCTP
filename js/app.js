/* ═══════════════════════════════════════════════════
   APP.JS — Estado global, routing y vistas
═══════════════════════════════════════════════════ */

const App = {
  state: { view: "grid", moduleId: null, progress: {}, xp: 0 },

  // ── Actualizar header ─────────────────────────────────────────
  updateHeader() {
    const done = Object.values(this.state.progress).filter(p => p.completed).length;
    document.getElementById("hdr-progress").textContent = `${done}/9 módulos`;
    document.getElementById("hdr-xp").textContent = `⚡ ${this.state.xp} XP`;
  },

  // ── Navegación ────────────────────────────────────────────────
  go(view, moduleId = null) {
    this.state.view = view;
    this.state.moduleId = moduleId;
    this.render();
  },

  // ── Render principal ──────────────────────────────────────────
  render() {
    this.updateHeader();
    const app = document.getElementById("app");
    app.innerHTML = "";

    if (this.state.view === "grid") this.renderGrid(app);
    else if (this.state.view === "module") this.renderModule(app);
  },

  // ── VISTA: GRID ───────────────────────────────────────────────
  renderGrid(app) {
    const pg = document.createElement("div");
    pg.className = "pg ani";

    // Title
    pg.innerHTML = `
      <div class="h1 mb2">Plan de Capacitación en Habilidades Blandas</div>
      `;

    // Global progress card
    const done = Object.values(this.state.progress).filter(p => p.completed).length;
    const pct = Math.round((done / MODULES.length) * 100);
    const progCard = document.createElement("div");
    progCard.className = "card mb4";
    progCard.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="sm bold">Progreso global del plan</div>
        <span style="font-weight:700;color:#ff8c32">${pct}%</span>
      </div>
      <div class="bar"><div class="fill fill-or" style="width:${pct}%"></div></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px">
        ${[1,2,3].map(ph => {
      const info = PHASE_INFO[ph];
      const phMods = MODULES.filter(m => m.ph === ph);
      const phDone = phMods.filter(m => this.state.progress[m.id]?.completed).length;
      return `<div style="padding:10px 12px;border-radius:9px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)">
            <div class="xs bold" style="color:rgba(229,223,213,.4);text-transform:uppercase;letter-spacing:.7px">Fase ${ph} · ${info.label}</div>
            <div class="sm bold" style="margin-top:4px">${phDone}/${phMods.length} completados</div>
            
          </div>`;
    }).join("")}
      </div>`;
    pg.appendChild(progCard);

    // Phases and modules
    [1,2,3].forEach(ph => {
      const info = PHASE_INFO[ph];
      const phSection = document.createElement("div");
      phSection.style.marginBottom = "28px";

      const phHdr = document.createElement("div");
      phHdr.className = "phase-hdr";
      phHdr.innerHTML = `
        <div class="phase-num">${ph}</div>
        <div>
          <span class="phase-label">Fase ${ph} · ${info.label}</span>
          
        </div>`;
      phSection.appendChild(phHdr);

      const grid = document.createElement("div");
      grid.className = "grid3";

      MODULES.filter(m => m.ph === ph).forEach(mod => {
        const isDone = this.state.progress[mod.id]?.completed;
        const card = document.createElement("div");
        card.className = `mcard ${isDone ? "done" : ""}`;
        card.style.setProperty("--ac", mod.ac);
        card.innerHTML = `
          <div class="mcard-icon">${mod.icon}</div>
          <div class="mcard-title">${mod.title}</div>
          <div class="mcard-sub">${mod.sub}</div>
          <div class="mcard-footer">
            <span class="tag ${mod.tag}">${mod.prio}</span>
          </div>
          ${isDone ? `<div class="mcard-done">✓ Completado · +${mod.xp} XP</div>` : ""}`;
        card.addEventListener("click", () => this.go("module", mod.id));
        grid.appendChild(card);
      });

      phSection.appendChild(grid);
      pg.appendChild(phSection);
    });

    app.appendChild(pg);
  },

  // ── VISTA: MÓDULO ─────────────────────────────────────────────
  renderModule(app) {
    const mod = MODULES.find(m => m.id === this.state.moduleId);
    if (!mod) { this.go("grid"); return; }

    const pg = document.createElement("div");
    pg.className = "pg";

    // Back button
    const backBtn = document.createElement("button");
    backBtn.className = "btn btn-s btn-sm mb4";
    backBtn.textContent = "← Todos los módulos";
    backBtn.addEventListener("click", () => this.go("grid"));
    pg.appendChild(backBtn);

    // Module header
    const hdr = document.createElement("div");
    hdr.className = "mb4";
    hdr.style.display = "flex"; hdr.style.alignItems = "center"; hdr.style.gap = "14px";
    hdr.innerHTML = `
      <span style="font-size:42px">${mod.icon}</span>
      <div>
        <div class="h1" style="font-size:22px">${mod.title}</div>
        <div class="mu">${mod.sub}</div>
      </div>`;
    pg.appendChild(hdr);

    // Info + status
    const infoGrid = document.createElement("div");
    infoGrid.className = "grid2 mb4";

    const infoCard = document.createElement("div");
    infoCard.className = "card card-or";
    infoCard.innerHTML = `
      <div class="xs bold mb3" style="color:rgba(229,223,213,.4);text-transform:uppercase;letter-spacing:.8px">Detalles del módulo</div>
      ${[["🎯 Prioridad",mod.prio],["⚡ Recompensa",`+${mod.xp} XP`],["📊 Puntaje máx.",mod.max]].map(([l,v])=>`
        <div class="info-row"><span class="mu sm">${l}</span><span class="sm bold">${v}</span></div>`).join("")}`;
    infoGrid.appendChild(infoCard);

    const prog = this.state.progress[mod.id];
    const statusCard = document.createElement("div");
    statusCard.className = `card ${prog?.completed ? "card-gr" : ""}`;
    statusCard.style.display = "flex";
    statusCard.style.flexDirection = "column";
    statusCard.style.alignItems = "center";
    statusCard.style.justifyContent = "center";
    statusCard.style.gap = "10px";
    if (prog?.completed) {
      statusCard.innerHTML = `<span style="font-size:36px">✅</span>
        <div class="h3" style="color:#2dd4a0">Completado</div>
        <div class="mu sm">Puntaje: ${prog.score}/${mod.max}</div>`;
    } else {
      statusCard.innerHTML = `<span style="font-size:36px;opacity:.4">${mod.icon}</span>
        <div class="mu sm" style="text-align:center;opacity:.5">Aún no completado</div>`;
    }
    infoGrid.appendChild(statusCard);
    pg.appendChild(infoGrid);

    // Simulator container
    const simTitle = document.createElement("div");
    simTitle.innerHTML = `<div class="h2 mb3">🎮 Simulación interactiva</div>`;
    pg.appendChild(simTitle);

    const simContainer = document.createElement("div");
    simContainer.id = "sim-area";
    pg.appendChild(simContainer);

    app.appendChild(pg);

    // Result screen
    const onDone = (score, max) => {
      const pct = Math.min(Math.round((score / max) * 100), 100);
      const alreadyDone = this.state.progress[mod.id]?.completed;
      if (!alreadyDone) {
        this.state.progress[mod.id] = { completed: true, score };
        this.state.xp += mod.xp;
        this.updateHeader();
      } else {
        this.state.progress[mod.id].score = Math.max(this.state.progress[mod.id].score, score);
      }

      const simArea = document.getElementById("sim-area");
      if (!simArea) return;
      simArea.innerHTML = "";

      const col = pct >= 70 ? "#2dd4a0" : pct >= 40 ? "#ff8c32" : "#f87272";
      const emoji = pct >= 70 ? "🏆" : pct >= 40 ? "📈" : "💪";
      const msg = pct >= 70 ? "¡Excelente desempeño!" : pct >= 40 ? "Buen intento — sigue practicando" : "Necesita más práctica";

      const res = document.createElement("div");
      res.className = "ani";
      res.style.maxWidth = "520px";

      const hero = document.createElement("div");
      hero.className = "result-screen";
      hero.innerHTML = `
        <div class="result-icon">${emoji}</div>
        <div class="result-score" style="color:${col}">${pct}%</div>
        <div class="h2 mt3">${msg}</div>
        <div class="mu mt2">${score} de ${max} puntos</div>`;
      res.appendChild(hero);

      const scoreCard = document.createElement("div");
      scoreCard.className = "card mb4";
      scoreCard.innerHTML = `
        <div class="info-row"><span class="sm">Puntaje obtenido</span><span class="bold">${score}/${max}</span></div>
        <div class="bar mt3"><div class="fill fill-or" style="width:${pct}%"></div></div>
        ${pct >= 50 ? `<div class="mt3" style="color:#ff8c32;font-weight:700;font-size:14px">⚡ +${mod.xp} XP obtenidos</div>` : ""}`;
      res.appendChild(scoreCard);

      const btnsRow = document.createElement("div");
      btnsRow.style.display = "flex"; btnsRow.style.gap = "12px";

      const retryBtn = document.createElement("button");
      retryBtn.className = "btn btn-s";
      retryBtn.textContent = "🔄 Reintentar";
      retryBtn.addEventListener("click", () => {
        simArea.innerHTML = "";
        SIM_MAP[mod.id].render(simArea, onDone);
      });

      const backBtn2 = document.createElement("button");
      backBtn2.className = "btn btn-p";
      backBtn2.textContent = "← Todos los módulos";
      backBtn2.addEventListener("click", () => this.go("grid"));

      btnsRow.appendChild(retryBtn);
      btnsRow.appendChild(backBtn2);
      res.appendChild(btnsRow);
      simArea.appendChild(res);
    };

    // Launch simulator
    SIM_MAP[mod.id].render(simContainer, onDone);
  }
};

// ── INIT ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  App.render();
});