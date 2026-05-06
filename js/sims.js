/* ═══════════════════════════════════════════════════
   SIMS.JS — Los 9 simuladores en JS puro
   Cada simulador expone: { render(container, onDone) }
═══════════════════════════════════════════════════ */

// ── Helpers ──────────────────────────────────────────────────────
function h(tag, cls, content = "", attrs = {}) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (content) el.innerHTML = content;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function steps(total, cur) {
  const div = document.createElement("div");
  div.className = "steps mb4";
  for (let i = 0; i < total; i++) {
    const d = h("div", `sdot ${i < cur ? "done" : i === cur ? "cur" : "pend"}`, i + 1);
    div.appendChild(d);
  }
  const lbl = h("span", "mu sm", `Paso ${cur + 1} de ${total}`);
  div.appendChild(lbl);
  return div;
}

function fb(ok, text, pts) {
  const div = h("div", `fb ${ok ? "ok" : "bad"} ani`);
  div.innerHTML = `${ok ? "✅ " : "❌ "}${text}`;
  if (pts !== undefined) {
    const p = h("div", "fb-pts", `+${pts} puntos`);
    div.appendChild(p);
  }
  return div;
}

function btn(label, cls, onClick) {
  const b = h("button", `btn ${cls}`, label);
  b.addEventListener("click", onClick);
  return b;
}

function optBtn(text, onClick) {
  const b = h("button", "opt", `<span style="font-weight:700;opacity:.4;margin-right:8px"></span>${text}`);
  b.addEventListener("click", onClick);
  return b;
}

// ── Shuffle (Fisher-Yates) ────────────────────────────────────────
function shuffle(arr) {
  const a = arr.map((opt, i) => ({ ...opt, _orig: i }));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}



function renderStepSim(container, stepsData, maxScore, intro, onDone) {
  let step = 0, sel = null, rev = false, score = 0;
  // Shuffle options once per step at init; regenerate when step changes
  let shuffledOpts = shuffle(stepsData[0].opts);

  function render() {
    container.innerHTML = "";
    if (intro) {
      container.appendChild(h("div", "card card-or mb4", intro));
    }
    container.appendChild(steps(stepsData.length, step));

    const ctx = h("div", "card card-or mb4 ani");
    ctx.innerHTML = `<div class="mu mb2">📍 Situación:</div><div style="font-size:14px;line-height:1.6">${stepsData[step].ctx}</div>`;
    container.appendChild(ctx);

    const q = h("div", "h3 mb3", stepsData[step].q);
    container.appendChild(q);

    shuffledOpts.forEach((o, i) => {
      const b = h("button", "opt", `<span style="font-weight:700;opacity:.4;margin-right:8px">${["A","B","C","D"][i]}.</span>${o.t}`);
      if (rev) {
        if (i === sel) b.classList.add(o.ok ? "ok" : "bad");
        else if (o.ok) b.classList.add("ok");
        b.disabled = true;
      } else {
        if (i === sel) b.classList.add("sel");
        b.addEventListener("click", () => { sel = i; render(); });
      }
      container.appendChild(b);
    });

    if (rev && sel !== null) {
      const o = shuffledOpts[sel];
      container.appendChild(fb(o.ok, o.fb, o.s));
    }

    const row = h("div", "mt4", "");
    row.style.display = "flex"; row.style.gap = "12px";

    if (!rev) {
      const c = btn("Confirmar respuesta", "btn-p", () => {
        if (sel === null) return;
        score += shuffledOpts[sel].s;
        rev = true; render();
      });
      c.disabled = sel === null;
      row.appendChild(c);
    } else {
      const isLast = step >= stepsData.length - 1;
      const nx = btn(isLast ? "Ver resultado final" : "Siguiente →", "btn-p", () => {
        if (isLast) { onDone(score, maxScore); return; }
        step++;
        sel = null; rev = false;
        shuffledOpts = shuffle(stepsData[step].opts);
        render();
      });
      row.appendChild(nx);
    }
    container.appendChild(row);
  }
  render();
}

// ═══════════════════════════════════════════════════════════
// 1. MANEJO DEL TIEMPO — Eisenhower Matrix
// ═══════════════════════════════════════════════════════════
const SimTime = {
  render(container, onDone) {
    let assigns = {}, checked = false;

    function render() {
      container.innerHTML = "";
      container.appendChild(h("div", "card card-or mb4",
          `<div class="h3 mb2">📐 Matriz de Eisenhower</div>
         <div class="mu">Clasifique cada tarea en el cuadrante correcto usando los botones. Luego verifique.</div>`));

      TIME_TASKS.forEach(t => {
        const row = h("div", "task-row");
        row.style.borderColor = assigns[t.id] ? QUADS.find(q => q.id === assigns[t.id])?.col : "";

        const taskText = h("div", "sm bold mb2", t.t);
        row.appendChild(taskText);

        const btnsRow = h("div", "task-btns");
        QUADS.forEach(q => {
          const b = h("button", "qbtn");
          b.textContent = q.label;
          const isSelected = assigns[t.id] === q.id;
          if (isSelected) {
            b.style.borderColor = q.col;
            b.style.background = q.bg;
            b.style.color = q.col;
          }
          if (!checked) {
            b.addEventListener("click", () => {
              assigns[t.id] = q.id;
              render();
            });
          } else {
            b.disabled = true;
          }
          btnsRow.appendChild(b);
        });
        row.appendChild(btnsRow);

        if (checked) {
          const correct = assigns[t.id] === t.q;
          const correctQ = QUADS.find(q => q.id === t.q);
          const fbDiv = h("div", "task-fb", correct
              ? `<span style="color:#2dd4a0">✅ Correcto</span> — ${t.why}`
              : `<span style="color:#f87272">❌ Correcto: <strong>${correctQ?.label}</strong></span> — ${t.why}`);
          row.appendChild(fbDiv);
        }
        container.appendChild(row);
      });

      // Matrix visual
      const matrix = h("div", "matrix mt4");
      QUADS.forEach(q => {
        const quad = h("div", "quad");
        quad.style.background = q.bg;
        quad.style.borderColor = q.col;
        quad.innerHTML = `<div class="quad-title" style="color:${q.col}">${q.label}</div>
          <div class="quad-sub">${q.sub}</div>`;
        TIME_TASKS.filter(t => assigns[t.id] === q.id).forEach(t => {
          const tag = h("span", "quad-tag", `${t.id}. ${t.t.substring(0, 22)}…`);
          quad.appendChild(tag);
        });
        matrix.appendChild(quad);
      });
      container.appendChild(matrix);

      if (!checked) {
        const allDone = Object.keys(assigns).length === TIME_TASKS.length;
        const b = btn(
            allDone ? "✓ Verificar clasificación" : `Clasifique todas las tareas (${Object.keys(assigns).length}/8)`,
            "btn-p mt4", () => {
              if (!allDone) return;
              const score = TIME_TASKS.reduce((acc, t) => acc + (assigns[t.id] === t.q ? 10 : 0), 0);
              checked = true;
              render();
              setTimeout(() => onDone(score, 80), 800);
            });
        b.disabled = !allDone;
        container.appendChild(b);
      }
    }
    render();
  }
};

// ═══════════════════════════════════════════════════════════
// 2. ADAPTABILIDAD
// ═══════════════════════════════════════════════════════════
const SimAdapt = {
  render(container, onDone) {
    renderStepSim(container, ADAPT_STEPS, 90,
        "Tome las mejores decisiones ante un cambio curricular imprevisto en su institución.",
        onDone);
  }
};

// ═══════════════════════════════════════════════════════════
// 3. COMUNICACIÓN EFECTIVA — AI Chat con Groq
// ═══════════════════════════════════════════════════════════
const SimComm = {
  render(container, onDone) {
    let msgs = [{ role:"ai", sender:"Sr./Sra. Rodríguez", text:"Buenas tardes. Vengo porque me parece un abuso lo que pasó con Alejandro/a. Estudia todos los días y usted lo reprobó. ¿Qué explicación me da?" }];
    let scores = [], turns = 0, finished = false;

    function renderChat() {
      container.innerHTML = "";

      const intro = h("div", "card card-or mb4",
          `<div class="mu">Un padre o madre de familia molesto llega a su aula. Responda con empatía, datos concretos y orientación hacia soluciones. <strong>4 turnos evaluados por IA.</strong></div>`);
      container.appendChild(intro);

      const grid = h("div", "grid2");
      grid.style.alignItems = "start";

      // ── Chat panel ──
      const chatCard = h("div", "card");
      chatCard.style.padding = "0";
      chatCard.style.overflow = "hidden";

      const avg = scores.length > 0 ? Math.round(scores.reduce((a,b)=>a+b) / scores.length) : 0;
      const chatHdr = h("div", "", `
        <div style="padding:12px 17px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:10px">
          <span style="font-size:18px">🎭</span>
          <div>
            <div class="sm bold">Simulación: Familia del Estudiante</div>
            <div style="font-size:11px;color:${finished?"#2dd4a0":"#ff8c32"}">${finished?"● Completado":`● Turno ${turns+1}/4`}</div>
          </div>
          <div style="margin-left:auto;text-align:right">
            <div class="xs mu">PROMEDIO</div>
            <div style="font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:#ff8c32">${avg}</div>
          </div>
        </div>`);
      chatCard.appendChild(chatHdr);

      const chatBox = h("div", "chat-box");
      chatBox.id = "chat-messages";
      msgs.forEach(m => {
        const msg = h("div", `msg ${m.role === "u" ? "user" : m.role === "sys" ? "sys" : "ai"}`);
        if (m.sender) msg.appendChild(h("div", "msg-sender", m.sender));
        msg.appendChild(document.createTextNode(m.text));
        chatBox.appendChild(msg);
      });
      chatCard.appendChild(chatBox);

      if (!finished) {
        const chatRow = h("div", "chat-row");
        const inp = h("input", "inp");
        inp.type = "text";
        inp.placeholder = "Responda como docente empático…";
        const sendBtn = btn("Enviar", "btn-p btn-sm", async () => {
          const txt = inp.value.trim();
          if (!txt) return;
          inp.value = "";
          sendBtn.disabled = true;
          sendBtn.textContent = "⏳";

          msgs.push({ role:"u", sender:"Usted (Docente)", text:txt });
          turns++;
          renderChat();

          try {
            const history = msgs.slice(0,-1).map(m => ({
              role: m.role === "u" ? "user" : "assistant",
              content: m.text
            }));
            history.push({ role:"user", content:txt });

            const res = await fetch("/api/chat", {
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify({ system: COMM_SYSTEM, messages: history })
            });
            const data = await res.json();
            const raw = data.text || "";

            const ei = raw.indexOf("EVAL:");
            const charTxt = ei > 0 ? raw.substring(0, ei).trim() : raw.trim();
            msgs.push({ role:"ai", sender:"Sr./Sra. Rodríguez", text:charTxt });

            let ev = null;
            if (ei > 0) {
              try { ev = JSON.parse(raw.substring(ei + 5).trim()); } catch {}
            }
            if (ev) {
              const tot = (ev.empathy||0) + (ev.evidence||0) + (ev.solution||0) + (ev.tone||0);
              scores.push(tot);
              msgs.push({ role:"sys", text:`🎯 Coach IA: ${ev.comment} (+${tot}pts)` });
            }

            if (turns >= 4) {
              finished = true;
              const finalAvg = scores.length > 0 ? Math.round(scores.reduce((a,b)=>a+b)/scores.length) : 50;
              renderChat();
              setTimeout(() => onDone(finalAvg, 100), 800);
            } else {
              renderChat();
            }
          } catch {
            msgs.push({ role:"sys", text:"Error de conexión. Intente de nuevo." });
            renderChat();
          }
        });
        inp.addEventListener("keydown", e => { if (e.key === "Enter") sendBtn.click(); });
        chatRow.appendChild(inp);
        chatRow.appendChild(sendBtn);
        chatCard.appendChild(chatRow);
      }
      grid.appendChild(chatCard);

      // ── Tips panel ──
      const tipsCol = h("div", "");
      tipsCol.style.display = "flex";
      tipsCol.style.flexDirection = "column";
      tipsCol.style.gap = "14px";

      const dimCard = h("div", "card card-or");
      dimCard.innerHTML = `
        <div class="xs bold mb3" style="color:rgba(229,223,213,.4);text-transform:uppercase;letter-spacing:.8px">Dimensiones evaluadas (0-25 c/u)</div>
        ${[["🤝 Empatía","Valide la preocupación del padre"],["📊 Evidencia","Use datos concretos"],["💡 Solución","Oriente hacia un plan"],["🌡 Tono","Mantenga calma y calidez"]].map(([d,s])=>`
        <div style="padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.04);margin-bottom:6px">
          <div class="sm bold">${d}</div><div class="xs mu">${s}</div>
        </div>`).join("")}`;
      tipsCol.appendChild(dimCard);

      const histCard = h("div", "card");
      histCard.innerHTML = `<div class="xs bold mb2" style="color:rgba(229,223,213,.4);text-transform:uppercase;letter-spacing:.8px">Puntajes por turno</div>`;
      if (scores.length === 0) {
        histCard.appendChild(h("div", "mu sm", "Comience la conversación…"));
      } else {
        scores.forEach((s, i) => {
          const row = h("div", "info-row");
          row.innerHTML = `<span class="mu">Turno ${i+1}</span><span class="bold" style="color:${s>=70?"#2dd4a0":s>=40?"#ff8c32":"#f87272"}">${s}/100</span>`;
          histCard.appendChild(row);
        });
      }
      tipsCol.appendChild(histCard);
      grid.appendChild(tipsCol);

      container.appendChild(grid);

      // Scroll chat
      setTimeout(() => {
        const cb = document.getElementById("chat-messages");
        if (cb) cb.scrollTop = cb.scrollHeight;
      }, 50);
    }
    renderChat();
  }
};

// ═══════════════════════════════════════════════════════════
// 4. RESOLUCIÓN DE CONFLICTOS
// ═══════════════════════════════════════════════════════════
const SimConflict = {
  render(container, onDone) {
    renderStepSim(container, CONFLICT_STEPS, 100,
        "Medie el conflicto entre dos estudiantes tomando las mejores decisiones en cada etapa.",
        onDone);
  }
};

// ═══════════════════════════════════════════════════════════
// 5. PENSAMIENTO CRÍTICO
// ═══════════════════════════════════════════════════════════
const SimCritical = {
  render(container, onDone) {
    let phase = 0, sel = new Set(), solSel = null, causeScore = 0, solRev = false;

    function render() {
      container.innerHTML = "";

      // Evidence card
      const ev = h("div", "card card-or mb4");
      ev.innerHTML = `<div class="h3 mb3">📊 Datos del caso: Rendimiento grupal</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${EVIDENCE.map(e=>`<div style="padding:8px 11px;border-radius:8px;background:rgba(255,255,255,.05);font-size:12px">${e}</div>`).join("")}
        </div>`;
      container.appendChild(ev);

      if (phase === 0) {
        container.appendChild(h("div", "h3 mb2", "Paso 1: Identifique las 3 causas raíz más probables"));
        container.appendChild(h("div", "mu mb3", "Seleccione exactamente 3 basándose en la evidencia disponible."));

        CAUSES.forEach(c => {
          const b = h("button", `opt ${sel.has(c.id) ? "sel" : ""}`,
              `${sel.has(c.id) ? "☑ " : "☐ "}${c.t}`);
          b.addEventListener("click", () => {
            if (sel.has(c.id)) sel.delete(c.id);
            else if (sel.size < 3) sel.add(c.id);
            render();
          });
          container.appendChild(b);
        });

        const confirmBtn = btn(`Confirmar causas (${sel.size}/3)`, "btn-p mt3", () => {
          const hits = [...sel].filter(id => CAUSES.find(c => c.id === id)?.ok).length;
          causeScore = hits * 15;
          phase = 1;
          render();
        });
        confirmBtn.disabled = sel.size !== 3;
        container.appendChild(confirmBtn);

      } else {
        const resultCard = h("div", "card card-gr mb4",
            `<div class="sm">✅ Las causas correctas son: fatiga laboral externa, cambio metodológico sin preparación y pérdida de líderes grupales.</div>
           <div class="xs mu mt2">Puntaje causas: ${causeScore}/45</div>`);
        container.appendChild(resultCard);

        container.appendChild(h("div", "h3 mb2", "Paso 2: Seleccione la mejor estrategia de intervención"));

        SOLUTIONS.forEach((s, i) => {
          const b = h("button", `opt ${solRev ? (i === solSel ? (s.ok ? "ok" : "bad") : s.ok ? "ok" : "") : solSel === i ? "sel" : ""}`, s.t);
          if (!solRev) b.addEventListener("click", () => { solSel = i; render(); });
          else b.disabled = true;
          container.appendChild(b);
        });

        if (solRev && solSel !== null) {
          container.appendChild(fb(SOLUTIONS[solSel].ok, SOLUTIONS[solSel].fb));
        }

        const row = h("div", "mt4", "");
        row.style.display = "flex"; row.style.gap = "12px";
        if (!solRev) {
          const c = btn("Confirmar estrategia", "btn-p", () => { if (solSel === null) return; solRev = true; render(); });
          c.disabled = solSel === null;
          row.appendChild(c);
        } else {
          row.appendChild(btn("Ver resultado →", "btn-p", () => onDone(causeScore + (SOLUTIONS[solSel]?.s || 0), 85)));
        }
        container.appendChild(row);
      }
    }
    render();
  }
};

// ═══════════════════════════════════════════════════════════
// 6. INTELIGENCIA EMOCIONAL
// ═══════════════════════════════════════════════════════════
const SimEmotion = {
  render(container, onDone) {
    let step = 0, ph = "e", eSel = null, rSel = null, eOk = false, rRev = false, score = 0;
    let shuffledRopts = [];

    function render() {
      container.innerHTML = "";
      container.appendChild(steps(EMOTS.length, step));

      const cur = EMOTS[step];
      const ctx = h("div", "card card-or mb4 ani");
      ctx.innerHTML = `<div class="mu mb2">📍 Situación:</div><div style="font-size:14px;line-height:1.6">${cur.ctx}</div>`;
      container.appendChild(ctx);

      if (ph === "e") {
        container.appendChild(h("div", "h3 mb3", cur.eq));
        cur.eOpts.forEach((o, i) => {
          const b = h("button", `opt ${eSel === i ? "sel" : ""}`, o);
          b.addEventListener("click", () => { eSel = i; render(); });
          container.appendChild(b);
        });
        const c = btn("Confirmar", "btn-p mt3", () => {
          if (eSel === null) return;
          eOk = eSel === cur.ce;
          if (eOk) score += 5;
          ph = "r"; render();
        });
        c.disabled = eSel === null;
        container.appendChild(c);

      } else {
        container.appendChild(h("div", `card ${eOk ? "card-gr" : "card-re"} mb4`,
            eOk ? "✅ Identificación emocional correcta. +5 pts" : `❌ La emoción más probable es: "${cur.eOpts[cur.ce]}"`));

        container.appendChild(h("div", "h3 mb3", cur.rq));
        cur.rOpts.forEach((o, i) => {
          const b = h("button", `opt ${rRev ? (i === rSel ? (o.ok ? "ok" : "bad") : o.ok ? "ok" : "") : rSel === i ? "sel" : ""}`, o.t);
          if (!rRev) b.addEventListener("click", () => { rSel = i; render(); });
          else b.disabled = true;
          container.appendChild(b);
        });

        if (rRev && rSel !== null) {
          container.appendChild(fb(shuffledRopts[rSel].ok, shuffledRopts[rSel].fb, shuffledRopts[rSel].s));
        }

        const row = h("div", "mt4", "");
        row.style.display = "flex"; row.style.gap = "12px";
        if (!rRev) {
          const c = btn("Confirmar respuesta", "btn-p", () => {
            if (rSel === null) return;
            score += shuffledRopts[rSel].s;
            rRev = true; render();
          });
          c.disabled = rSel === null;
          row.appendChild(c);
        } else {
          const isLast = step >= EMOTS.length - 1;
          row.appendChild(btn(isLast ? "Ver resultado final" : "Siguiente situación →", "btn-p", () => {
            if (isLast) { onDone(score, 175); return; }
            step++; ph = "e"; eSel = null; rSel = null; eOk = false; rRev = false; shuffledRopts = []; render();
          }));
        }
        container.appendChild(row);
      }
    }
    render();
  }
};

// ═══════════════════════════════════════════════════════════
// 7. TRABAJO EN EQUIPO
// ═══════════════════════════════════════════════════════════
const SimTeam = {
  render(container, onDone) {
    let assigns = {}, submitted = false;

    function render() {
      container.innerHTML = "";
      container.appendChild(h("div", "card card-or mb4",
          `<div class="h3 mb2">🎪 Feria Vocacional del Centro Educativo</div>
         <div class="mu">Deben organizarla en 2 semanas. Asigne cada tarea al miembro más adecuado según su perfil.</div>`));

      const grid = h("div", "grid2");

      // Profiles
      const profilesCol = h("div", "");
      profilesCol.appendChild(h("div", "h3 mb3", "Perfiles del equipo"));
      TEAM_M.forEach(m => {
        const card = h("div", "card mb2");
        card.style.padding = "11px 13px";
        card.innerHTML = `<div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:20px">${m.icon}</span>
          <div><div class="sm bold">${m.name}</div><div class="xs mu">${m.p}</div></div>
        </div>`;
        profilesCol.appendChild(card);
      });
      grid.appendChild(profilesCol);

      // Tasks
      const tasksCol = h("div", "");
      tasksCol.appendChild(h("div", "h3 mb3", "Asignación de tareas"));
      TEAM_T.forEach(t => {
        const card = h("div", "card mb2");
        card.style.padding = "11px 13px";
        card.innerHTML = `<div class="sm bold mb2">${t.task}</div>`;

        if (!submitted) {
          const sel = h("select", "sel");
          sel.innerHTML = `<option value="">— Seleccionar —</option>${TEAM_M.map(m=>`<option value="${m.id}">${m.icon} ${m.name}</option>`).join("")}`;
          sel.value = assigns[t.id] || "";
          sel.addEventListener("change", e => { assigns[t.id] = e.target.value; render(); });
          card.appendChild(sel);
        } else {
          const assigned = TEAM_M.find(m => m.id === assigns[t.id]);
          const score = assigns[t.id] ? t.scores[assigns[t.id]] || 0 : 0;
          const ok = score >= 25;
          const ideal = TEAM_M.find(m => m.id === t.ideal);
          card.innerHTML += `
            <div style="display:flex;align-items:center;gap:8px;margin-top:6px">
              <span class="tag ${ok?"tag-gr":"tag-re"}">${assigned?.icon||"—"} ${assigned?.name||"—"}</span>
              ${!ok ? `<span class="xs mu">Ideal: ${ideal?.name}</span>` : ""}
            </div>
            <div class="xs mu mt2">${t.why}</div>`;
        }
        tasksCol.appendChild(card);
      });

      if (!submitted) {
        const allDone = Object.values(assigns).filter(v=>v).length === TEAM_T.length;
        const c = btn(allDone ? "✓ Verificar asignaciones" : `Asigne todas (${Object.values(assigns).filter(v=>v).length}/${TEAM_T.length})`, "btn-p mt3", () => {
          if (!allDone) return;
          const score = TEAM_T.reduce((acc, t) => acc + (assigns[t.id] ? t.scores[assigns[t.id]] || 0 : 0), 0);
          submitted = true;
          render();
          setTimeout(() => onDone(score, 180), 800);
        });
        c.disabled = !allDone;
        tasksCol.appendChild(c);
      }
      grid.appendChild(tasksCol);
      container.appendChild(grid);
    }
    render();
  }
};

// ═══════════════════════════════════════════════════════════
// 8. LIDERAZGO PEDAGÓGICO — AI Text Evaluation
// ═══════════════════════════════════════════════════════════
const SimLeader = {
  render(container, onDone) {
    let result = null, loading = false;

    function render() {
      container.innerHTML = "";
      container.appendChild(h("div", "card card-or mb4",
          `<div class="h3 mb2">📍 Contexto del liderazgo</div>
         <div class="mu">Su departamento está dividido en dos grupos con visiones distintas. Hay tensión y desmotivación. Redacte un mensaje que los motive y los una considerando: visión compartida, reconocimiento del esfuerzo, propuesta concreta y tono empático.</div>`));

      const grid = h("div", "grid2");
      grid.style.alignItems = "start";

      // Write panel
      const writeCol = h("div", "");
      writeCol.appendChild(h("div", "h3 mb2", "Redacte su mensaje"));
      writeCol.appendChild(h("div", "mu mb3", "Mínimo 30 caracteres. La IA evaluará 4 dimensiones del liderazgo transformacional."));
      const ta = h("textarea", "");
      ta.placeholder = "Estimado equipo…";
      ta.rows = 9;
      writeCol.appendChild(ta);

      const evalBtn = btn("🤖 Evaluar con IA", "btn-p mt3", async () => {
        const txt = ta.value.trim();
        if (txt.length < 30 || loading) return;
        loading = true;
        evalBtn.textContent = "⏳ Evaluando…";
        evalBtn.disabled = true;

        try {
          const res = await fetch("/api/chat", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ system: LEADER_SYSTEM, messages:[{ role:"user", content:txt }] })
          });
          const data = await res.json();
          const raw = data.text.replace(/```json|```/g, "").trim();
          result = JSON.parse(raw);
          loading = false;
          const total = result.vision + result.recognition + result.action + result.empathy;
          render();
          setTimeout(() => onDone(total, 100), 400);
        } catch {
          loading = false;
          const errDiv = h("div", "fb bad mt3", "Error de conexión. Intente de nuevo.");
          writeCol.appendChild(errDiv);
          evalBtn.textContent = "🤖 Evaluar con IA";
          evalBtn.disabled = false;
        }
      });
      writeCol.appendChild(evalBtn);
      grid.appendChild(writeCol);

      // Result panel
      const resCol = h("div", "");
      if (!result) {
        const placeholder = h("div", "card");
        placeholder.style.height = "100%";
        placeholder.style.display = "flex";
        placeholder.style.flexDirection = "column";
        placeholder.style.alignItems = "center";
        placeholder.style.justifyContent = "center";
        placeholder.style.gap = "14px";
        placeholder.style.opacity = ".5";
        placeholder.innerHTML = `<span style="font-size:48px">⭐</span>
          <div class="mu sm" style="text-align:center">La IA evaluará su mensaje en 4 dimensiones del liderazgo transformacional</div>`;
        resCol.appendChild(placeholder);
      } else {
        const dims = [
          { label:"Visión compartida", val:result.vision, col:"#3b82f6" },
          { label:"Reconocimiento", val:result.recognition, col:"#10b981" },
          { label:"Llamado a la acción", val:result.action, col:"#f59e0b" },
          { label:"Tono empático", val:result.empathy, col:"#ec4899" },
        ];
        const evalCard = h("div", "card mb3 ani");
        evalCard.innerHTML = `<div class="xs bold mb3" style="color:rgba(229,223,213,.4);text-transform:uppercase;letter-spacing:.8px">Evaluación IA</div>`;
        dims.forEach(d => {
          const row = h("div", "dim-row");
          row.innerHTML = `<span class="dim-label sm">${d.label}</span>
            <div class="dim-bar"><div class="dim-fill" style="width:${(d.val/25)*100}%;background:${d.col}"></div></div>
            <span class="bold xs" style="color:${d.col};min-width:30px;text-align:right">${d.val}/25</span>`;
          evalCard.appendChild(row);
        });
        const total = result.vision + result.recognition + result.action + result.empathy;
        evalCard.innerHTML += `<div class="divider"></div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="bold">Total</span>
            <span style="font-family:'Fraunces',serif;font-size:24px;font-weight:700;color:#ff8c32">${total}/100</span>
          </div>`;
        resCol.appendChild(evalCard);
        resCol.appendChild(h("div", "card card-gr mb3 ani", `<div class="xs bold mb1" style="color:#2dd4a0">FORTALEZA</div><div class="sm">💪 ${result.strength}</div>`));
        resCol.appendChild(h("div", "card card-re mb3 ani", `<div class="xs bold mb1" style="color:#f87272">ÁREA DE MEJORA</div><div class="sm">📈 ${result.improve}</div>`));
        resCol.appendChild(h("div", "card ani", `<div class="sm" style="line-height:1.6">${result.feedback}</div>`));
      }
      grid.appendChild(resCol);
      container.appendChild(grid);
    }
    render();
  }
};

// ═══════════════════════════════════════════════════════════
// 9. CREATIVIDAD E INNOVACIÓN
// ═══════════════════════════════════════════════════════════
const SimCreative = {
  render(container, onDone) {
    let picks = {}, submitted = false;

    function total() {
      return Object.entries(picks).reduce((s, [k, id]) => {
        const cat = CREATIVE.find(c => c.key === k);
        return s + (cat?.opts.find(o => o.id === id)?.v || 0);
      }, 0);
    }

    function render() {
      container.innerHTML = "";
      container.appendChild(h("div", "card card-or mb4",
          `<div class="h3 mb2">📍 El reto: 40% de ausencias recurrentes</div>
         <div class="mu">Los estudiantes que asisten también parecen desmotivados. Diseñe una estrategia creativa seleccionando un componente de cada categoría.</div>`));

      CREATIVE.forEach(cat => {
        const section = h("div", "");
        section.style.marginBottom = "22px";
        section.innerHTML = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <div class="h3">${cat.label}</div>
          <div class="mu sm">— ${cat.desc}</div>
        </div>`;

        cat.opts.forEach(o => {
          const b = h("button", `opt ${picks[cat.key] === o.id ? "sel" : ""}`,
              `${picks[cat.key] === o.id ? "▶ " : "○ "}${o.t}${o.bold ? '<span class="tag tag-or" style="margin-left:8px;font-size:10px">Innovador</span>' : ""}`);
          if (!submitted) {
            b.addEventListener("click", () => {
              picks[cat.key] = o.id;
              render();
            });
          } else {
            b.disabled = true;
          }
          section.appendChild(b);
        });
        container.appendChild(section);
      });

      const done = Object.keys(picks).length === CREATIVE.length;

      if (done && !submitted) {
        const preview = h("div", "card card-or mb4");
        preview.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
          <div><div class="h3">Puntuación de innovación</div><div class="mu sm mt2">Combinación seleccionada</div></div>
          <div style="font-family:'Fraunces',serif;font-size:36px;font-weight:900;color:#ff8c32">${total()}</div>
        </div>`;
        container.appendChild(preview);
        container.appendChild(btn("✓ Confirmar estrategia", "btn-p", () => {
          const s = total();
          submitted = true;
          render();
          setTimeout(() => onDone(s, 120), 600);
        }));
      }

      if (submitted) {
        const res = h("div", "card card-gr ani mt4");
        res.innerHTML = `<div class="h3 mb3">✨ Tu estrategia de innovación</div>`;
        CREATIVE.forEach(cat => {
          const opt = cat.opts.find(o => o.id === picks[cat.key]);
          const row = h("div", "");
          row.style.padding = "10px 0";
          row.style.borderBottom = "1px solid rgba(255,255,255,.07)";
          row.innerHTML = `<div class="xs" style="color:rgba(229,223,213,.4);font-weight:700;text-transform:uppercase;letter-spacing:.7px">${cat.label}</div>
            <div class="sm mt2">→ ${opt?.t} <span style="color:#2dd4a0;font-weight:700">+${opt?.v}pts</span></div>`;
          res.appendChild(row);
        });
        const t = total();
        res.innerHTML += `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">
          <span class="bold">Total de innovación</span>
          <span style="font-family:'Fraunces',serif;font-size:26px;font-weight:900;color:${t>=90?"#2dd4a0":t>=60?"#ff8c32":"#f87272"}">${t}/120</span>
        </div>`;
        container.appendChild(res);
      }
    }
    render();
  }
};

// ── SIM MAP ──────────────────────────────────────────────────────
const SIM_MAP = {
  time: SimTime, adapt: SimAdapt, comm: SimComm,
  conflict: SimConflict, critical: SimCritical, emotion: SimEmotion,
  team: SimTeam, leader: SimLeader, creative: SimCreative
};