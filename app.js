(function () {
  "use strict";

  const QUESTIONS = window.SURVEY_QUESTIONS || [];
  const ENDPOINT = (window.SURVEY_CONFIG && window.SURVEY_CONFIG.SHEET_ENDPOINT) || "";
  const DRAFT_KEY = "achaar-survey-draft";

  const $ = (sel) => document.querySelector(sel);
  const views = { home: $("#home"), survey: $("#survey"), done: $("#done") };
  const card = $("#card");
  const backBtn = $("#back-btn");
  const meterFill = $("#meter-fill");
  const meterCount = $("#meter-count");

  let answers = loadDraft();
  let index = 0;
  let submitting = false;

  // ---------- storage (best effort only) ----------
  function loadDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(answers)); } catch (e) { /* ignore */ }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
  }

  // ---------- navigation ----------
  function show(name) {
    Object.entries(views).forEach(([key, el]) => el.classList.toggle("is-active", key === name));
    window.scrollTo({ top: 0 });
  }

  $("#start-btn").addEventListener("click", () => {
    index = 0;
    show("survey");
    render(1);
  });

  backBtn.addEventListener("click", () => {
    if (index > 0) { index--; render(-1); }
  });

  function next() {
    if (index < QUESTIONS.length - 1) { index++; render(1); }
    else submit();
  }

  // ---------- rendering ----------
  function render(direction) {
    const q = QUESTIONS[index];
    const total = QUESTIONS.length;

    backBtn.disabled = index === 0;
    meterFill.style.width = `${(index / total) * 100}%`;
    meterCount.textContent = `${index + 1} / ${total}`;

    card.innerHTML = "";
    card.classList.remove("enter", "enter-back");
    void card.offsetWidth; // restart animation
    card.classList.add(direction < 0 ? "enter-back" : "enter");

    const kicker = el("p", "q__kicker", `Question ${index + 1}`);
    const title = el("h2", "q__title", q.title);
    title.id = `q-${q.id}`;
    card.append(kicker, title);
    if (q.hint) card.append(el("p", "q__hint", q.hint));

    const body = el("div", "q__body");
    card.append(body);

    const actions = el("div", "q__actions");
    const nextBtn = el("button", "next-btn", index === total - 1 ? "Send it" : "Next");
    nextBtn.type = "submit";
    const error = el("p", "q__error");
    error.setAttribute("role", "alert");
    actions.append(nextBtn);
    if (!q.required) {
      const skip = el("button", "skip-btn", index === total - 1 ? "Skip & send" : "Skip");
      skip.type = "button";
      skip.addEventListener("click", () => { delete answers[q.id]; saveDraft(); next(); });
      actions.append(skip);
    }
    actions.append(error);
    card.append(actions);

    const builders = { text: buildText, email: buildText, longtext: buildText, single: buildChoice, multi: buildChoice, chips: buildChoice, spice: buildSpice };
    const getValue = (builders[q.type] || buildText)(q, body, nextBtn);

    card.onsubmit = (e) => {
      e.preventDefault();
      if (submitting) return;
      const value = getValue();
      const empty = value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
      if (empty && q.required) { error.textContent = "Arre, answer this one first!"; return; }
      if (q.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) { error.textContent = "That email looks a little off."; return; }
      if (empty) delete answers[q.id]; else answers[q.id] = value;
      saveDraft();
      if (q.reaction && !empty) react(q.reaction);
      next();
    };
  }

  function buildText(q, body) {
    const input = q.type === "longtext" ? document.createElement("textarea") : document.createElement("input");
    if (q.type !== "longtext") input.type = q.type === "email" ? "email" : "text";
    if (q.type === "email") input.autocomplete = "email";
    if (q.id === "name") input.autocomplete = "given-name";
    input.className = "field";
    input.placeholder = q.placeholder || "";
    input.maxLength = q.type === "longtext" ? 2000 : 200;
    input.value = answers[q.id] || "";
    input.setAttribute("aria-labelledby", `q-${q.id}`);
    body.append(input);
    setTimeout(() => input.focus({ preventScroll: true }), 350);
    return () => input.value.trim();
  }

  function buildChoice(q, body, nextBtn) {
    const multi = q.type !== "single";
    if (q.type === "chips") body.classList.add("chips");
    body.setAttribute("role", "group");
    body.setAttribute("aria-labelledby", `q-${q.id}`);

    let selected = multi ? [].concat(answers[q.id] || []) : answers[q.id];

    q.options.forEach(([label, emoji]) => {
      const btn = el("button", "opt");
      btn.type = "button";
      if (emoji) btn.append(el("span", "opt__emoji", emoji));
      btn.append(el("span", "opt__label", label));
      btn.append(el("span", "opt__check"));
      const isOn = () => (multi ? selected.includes(label) : selected === label);
      btn.setAttribute("aria-pressed", String(isOn()));

      btn.addEventListener("click", () => {
        if (multi) {
          if (selected.includes(label)) selected = selected.filter((s) => s !== label);
          else if (q.max && selected.length >= q.max) { nudge(btn); return; }
          else selected.push(label);
          body.querySelectorAll(".opt").forEach((b, i) => b.setAttribute("aria-pressed", String(selected.includes(q.options[i][0]))));
        } else {
          selected = label;
          body.querySelectorAll(".opt").forEach((b) => b.setAttribute("aria-pressed", "false"));
          btn.setAttribute("aria-pressed", "true");
          // single choice: move on automatically for a snappier feel
          setTimeout(() => card.requestSubmit(nextBtn), 320);
        }
      });
      body.append(btn);
    });

    return () => selected;
  }

  function buildSpice(q, body) {
    const wrap = el("div", "spice");
    const face = el("div", "spice__face");
    const label = el("p", "spice__label");
    const range = document.createElement("input");
    range.type = "range";
    range.min = 1;
    range.max = q.labels.length;
    range.step = 1;
    range.value = answers[q.id] || Math.ceil(q.labels.length / 2);
    range.className = "spice__range";
    range.setAttribute("aria-labelledby", `q-${q.id}`);
    const ends = el("div", "spice__ends");
    ends.append(el("span", "", "Mild"), el("span", "", "🔥 Fire"));

    const update = () => {
      const v = Number(range.value);
      face.textContent = q.faces[v - 1];
      face.style.transform = `scale(${0.85 + v * 0.08}) rotate(${(v - 3) * 4}deg)`;
      label.textContent = q.labels[v - 1];
      range.setAttribute("aria-valuetext", q.labels[v - 1]);
    };
    range.addEventListener("input", update);
    update();

    wrap.append(face, label, range, ends);
    body.append(wrap);
    return () => Number(range.value);
  }

  // ---------- submit ----------
  async function submit() {
    submitting = true;
    meterFill.style.width = "100%";
    const btn = card.querySelector(".next-btn");
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

    const columns = QUESTIONS.map((q) => q.column);
    const row = {};
    QUESTIONS.forEach((q) => {
      const v = answers[q.id];
      row[q.column] = Array.isArray(v) ? v.join(", ") : v === undefined ? "" : v;
    });
    const payload = { columns, answers: row, userAgent: navigator.userAgent };

    try {
      if (!ENDPOINT) throw new Error("SHEET_ENDPOINT is not set in config.js");
      // text/plain + no-cors keeps this a "simple" request so Apps Script accepts it without a CORS preflight.
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Could not send answers:", err, payload);
      submitting = false;
      if (btn) { btn.disabled = false; btn.textContent = "Try again"; }
      const error = card.querySelector(".q__error");
      if (error) error.textContent = "Hmm, that didn’t go through. Check your connection and try again.";
      return;
    }

    $("#done-name").textContent = answers.name || "hot stuff";
    clearDraft();
    answers = {};
    submitting = false;
    show("done");
    chilliRain();
  }

  // ---------- little delights ----------
  function react(text) {
    const r = el("div", "reaction", text);
    document.body.append(r);
    setTimeout(() => r.remove(), 1000);
  }

  function nudge(node) {
    node.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 250 });
  }

  function chilliRain() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bits = ["🌶️", "🥭", "🍋", "🧄", "🫙"];
    for (let i = 0; i < 36; i++) {
      const s = el("span", "chilli-rain", bits[i % bits.length]);
      s.style.left = `${Math.random() * 100}vw`;
      s.style.animationDuration = `${2.2 + Math.random() * 2}s`;
      s.style.animationDelay = `${Math.random() * 1.2}s`;
      document.body.append(s);
      setTimeout(() => s.remove(), 5000);
    }
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
})();
