(function () {
  "use strict";

  const QUESTIONS = window.SURVEY_QUESTIONS || [];
  const ENDPOINT = (window.SURVEY_CONFIG && window.SURVEY_CONFIG.SHEET_ENDPOINT) || "";
  const DRAFT_KEY = "achaar-survey-draft";

  // Arrow artwork from assets/arrow-back.svg and assets/arrow-next.svg, inlined so CSS can recolour them.
  const ARROW_BACK = '<svg viewBox="0 0 31 17" aria-hidden="true"><path fill="currentColor" d="M6.92969 0.526367C7.55116 -0.141216 8.59601 -0.178956 9.26367 0.442383C9.93117 1.06378 9.96876 2.1087 9.34766 2.77637C9.04093 3.10582 7.74676 4.39572 6.4707 5.6416C7.23938 5.64394 8.10462 5.6443 9.05176 5.64844C11.7117 5.66007 13.1669 5.77011 15.8926 5.94922C18.3445 6.11034 22.9579 6.36678 25.4854 6.51855C27.9771 6.66819 28.2765 6.69526 28.5283 6.72266C28.7693 6.74888 28.9474 6.77293 29.4463 6.85254C30.347 6.99627 30.961 7.84248 30.8174 8.74316C30.6736 9.64387 29.8265 10.258 28.9258 10.1143C28.4522 10.0387 28.3345 10.0237 28.1709 10.0059C28.0181 9.98923 27.8145 9.96818 25.2871 9.81641C22.7916 9.66654 18.1372 9.40686 15.6758 9.24512C12.9394 9.0653 11.581 8.96327 9.03711 8.95215C6.67921 8.94184 4.83015 8.93926 3.7168 8.9375C4.16659 9.70669 4.9017 10.7387 5.9248 12.1328C6.3256 12.6351 6.60033 12.9301 6.89648 13.2227L7.20801 13.5254L7.22754 13.5439C7.3584 13.674 7.40029 13.718 7.46973 13.7803C7.52389 13.8288 7.60144 13.8925 7.74023 13.9883C8.491 14.5062 8.67992 15.5353 8.16211 16.2861C7.64411 17.0368 6.61502 17.2258 5.86426 16.708C5.34604 16.3505 5.10258 16.0896 4.89844 15.8867V15.8857C4.42082 15.4261 3.99359 15.0099 3.33008 14.1768C3.31669 14.1599 3.30276 14.1433 3.29004 14.126C2.17572 12.6081 1.23043 11.2962 0.667969 10.2568C0.390077 9.74327 0.12764 9.15867 0.0351562 8.56055C-0.0656321 7.90858 0.0213409 7.07968 0.662109 6.41309L0.876953 6.20996C1.10344 6.01068 1.35396 5.82864 1.51367 5.70996C1.78714 5.50673 2.00685 5.34064 2.18652 5.1748C3.58554 3.88297 6.51212 0.974829 6.92969 0.526367Z"/></svg>';
  const ARROW_NEXT = '<svg viewBox="0 0 36 19" aria-hidden="true"><path fill="currentColor" d="M25.4131 0.0146484C25.6399 0.0448629 25.8596 0.115659 25.9727 0.15332C26.1233 0.203525 26.2939 0.267224 26.4746 0.338867C26.8386 0.483189 27.2921 0.680222 27.7969 0.916016C28.8053 1.38715 30.0676 2.03784 31.29 2.78906C32.4491 3.50133 33.7674 4.38914 34.5361 4.79199C34.8073 4.93415 35.2066 5.19223 35.5 5.63477L35.6182 5.83691L35.6885 5.98633C35.9974 6.72938 35.7203 7.39972 35.6416 7.58203C35.5127 7.8805 35.3301 8.15145 35.1719 8.36426C34.844 8.80533 34.3681 9.33007 33.8154 9.90332C32.4529 11.3165 31.2469 12.425 30.2627 13.6729C29.2972 15.0998 28.5386 16.313 28.0342 17.1611C27.8798 17.4325 27.5447 18.0912 27.0664 18.5371C26.371 19.185 25.2818 19.1465 24.6338 18.4512C23.9858 17.7557 24.0242 16.6665 24.7197 16.0186C24.6808 16.0549 24.6922 16.0572 24.7637 15.9434C24.7968 15.8905 24.835 15.8253 24.8848 15.7383C24.9094 15.6952 24.9353 15.65 24.9639 15.5996C24.9919 15.5502 25.0227 15.4953 25.0547 15.4395L25.0684 15.416C25.6138 14.4983 26.4241 13.2003 27.4521 11.6836L27.5225 11.5879C28.0339 10.935 28.62 10.2933 29.2168 9.67188C24.8896 9.63154 20.813 9.59104 18.4004 9.52539C17.0472 9.48856 16.217 9.44448 15.4229 9.40332C14.6384 9.36266 13.8888 9.32457 12.6719 9.2959C10.2099 9.23791 5.98165 9.21999 3.84863 9.21094L1.71387 9.20117C0.763613 9.19698 -0.00378023 8.42387 0 7.47363C0.00420643 6.5235 0.777455 5.75616 1.72754 5.75977L3.86328 5.76855C5.98241 5.77755 10.2499 5.79553 12.7529 5.85449C14.018 5.8843 14.8055 5.92456 15.6016 5.96582C16.3879 6.00657 17.1843 6.04834 18.4941 6.08398C21.0656 6.15396 25.5831 6.19554 30.3115 6.23926C30.006 6.04583 29.7233 5.8667 29.4873 5.72168C28.3983 5.0525 27.2558 4.46208 26.3398 4.03418C25.8826 3.82057 25.4932 3.65292 25.2061 3.53906C25.0618 3.48187 24.955 3.44235 24.8848 3.41895C24.7768 3.38297 24.8316 3.40968 24.96 3.42676C24.0179 3.30138 23.3554 2.43621 23.4805 1.49414C23.606 0.552189 24.4711 -0.110451 25.4131 0.0146484Z"/></svg>';

  const $ = (sel) => document.querySelector(sel);
  const views = { home: $("#home"), survey: $("#survey"), done: $("#done") };
  const card = $("#card");
  const dots = $("#dots");

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

  function back() {
    if (index > 0) { index--; render(-1); }
    else show("home");
  }

  function next() {
    if (index < QUESTIONS.length - 1) { index++; render(1); }
    else submit();
  }

  // ---------- rendering ----------
  function renderDots() {
    dots.innerHTML = "";
    QUESTIONS.forEach((_, i) => {
      const d = el("span", "dot" + (i === index ? " is-current" : i < index ? " is-done" : ""));
      dots.append(d);
    });
    dots.setAttribute("aria-label", `Question ${index + 1} of ${QUESTIONS.length}`);
  }

  function render(direction) {
    const q = QUESTIONS[index];
    const isLast = index === QUESTIONS.length - 1;
    renderDots();

    card.innerHTML = "";
    card.className = "survey__card";
    void card.offsetWidth; // restart animation
    card.classList.add(direction < 0 ? "enter-back" : "enter", ["single", "multi", "chips", "spice"].includes(q.type) ? "q--choice" : "q--fields");

    const title = el("h2", "q__title", q.title);
    title.id = `q-${q.id}`;
    card.append(title);
    if (q.hint) card.append(el("p", "q__hint", q.hint));

    const body = el("div", "q__body");
    card.append(body);
    const error = el("p", "q__error");
    error.setAttribute("role", "alert");
    card.append(error);

    const nav = el("div", "q__nav");
    const backBtn = el("button", "arrow arrow--back");
    backBtn.type = "button";
    backBtn.innerHTML = ARROW_BACK;
    backBtn.setAttribute("aria-label", index === 0 ? "Back to start" : "Previous question");
    backBtn.addEventListener("click", back);
    const nextBtn = el("button", "arrow arrow--next");
    nextBtn.type = "submit";
    nextBtn.innerHTML = ARROW_NEXT;
    nextBtn.setAttribute("aria-label", isLast ? "Send answers" : "Next question");
    nav.append(backBtn, nextBtn);
    card.append(nav);

    const builders = { fields: buildFields, longtext: buildLongText, single: buildChoice, multi: buildChoice, chips: buildChoice, spice: buildSpice };
    const api = (builders[q.type] || buildLongText)(q, body, nextBtn);

    // The next arrow stays dark until the question has what it needs.
    const refresh = () => nextBtn.classList.toggle("is-waiting", !!api.missing());
    card.oninput = refresh;
    card.onclick = () => setTimeout(refresh);
    refresh();

    card.onsubmit = (e) => {
      e.preventDefault();
      if (submitting) return;
      if (api.validate) {
        if (!api.validate()) return;
      } else {
        const problem = api.missing() || api.invalid();
        if (problem) { error.textContent = problem; return; }
      }
      api.save();
      saveDraft();
      if (q.reaction) react(q.reaction);
      next();
    };
  }

  function buildFields(q, body) {
    const EMAIL = /^\S+@\S+\.\S+$/;
    const inputs = q.fields.map((f) => {
      const wrap = el("label", "line-field");
      const input = document.createElement("input");
      input.type = f.type === "email" ? "email" : "text";
      input.className = "field";
      input.placeholder = f.placeholder || "";
      input.maxLength = 200;
      input.value = answers[f.id] || "";
      input.setAttribute("aria-label", (f.placeholder || f.column).replace(/\*$/, ""));
      if (f.type === "email") input.autocomplete = "email";
      if (f.id === "name") input.autocomplete = "given-name";
      wrap.append(input);
      const error = el("p", "field__error");
      error.setAttribute("role", "alert");
      body.append(wrap, error);
      input.addEventListener("input", () => { error.textContent = ""; });
      return { f, input, error };
    });
    setTimeout(() => inputs[0] && inputs[0].input.focus({ preventScroll: true }), 350);

    // Each field reports its own problem, shown right under it.
    const problemWith = ({ f, input }) => {
      const v = input.value.trim();
      if (f.required && !v) return f.missing || "Please fill this in :(";
      if (f.type === "email" && v && !EMAIL.test(v)) return "That email ID doesn’t look right :(";
      return "";
    };
    return {
      missing: () => (inputs.some(({ f, input }) => f.required && !input.value.trim()) ? "missing" : ""),
      invalid: () => "",
      validate: () => {
        let ok = true;
        inputs.forEach((i) => {
          i.error.textContent = problemWith(i);
          if (i.error.textContent && ok) { ok = false; i.input.focus({ preventScroll: true }); }
        });
        return ok;
      },
      save: () => inputs.forEach(({ f, input }) => {
        const v = input.value.trim();
        if (v) answers[f.id] = v; else delete answers[f.id];
      })
    };
  }

  function buildLongText(q, body) {
    const wrap = el("label", "line-field");
    const input = document.createElement("textarea");
    input.className = "field";
    input.placeholder = q.placeholder || "";
    input.maxLength = 2000;
    input.value = answers[q.id] || "";
    input.setAttribute("aria-labelledby", `q-${q.id}`);
    wrap.append(input);
    body.append(wrap);
    setTimeout(() => input.focus({ preventScroll: true }), 350);
    return {
      missing: () => (q.required && !input.value.trim() ? "Arre, answer this one first!" : ""),
      invalid: () => "",
      save: () => {
        const v = input.value.trim();
        if (v) answers[q.id] = v; else delete answers[q.id];
      }
    };
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
      btn.setAttribute("aria-pressed", String(multi ? selected.includes(label) : selected === label));

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

    const empty = () => (multi ? selected.length === 0 : !selected);
    return {
      missing: () => (q.required && empty() ? "Arre, pick one first!" : ""),
      invalid: () => "",
      save: () => { if (empty()) delete answers[q.id]; else answers[q.id] = selected; }
    };
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
    return { missing: () => "", invalid: () => "", save: () => { answers[q.id] = Number(range.value); } };
  }

  // ---------- submit ----------
  function sheetRow() {
    const columns = [];
    const row = {};
    QUESTIONS.forEach((q) => {
      const parts = q.type === "fields" ? q.fields : [q];
      parts.forEach((p) => {
        const v = answers[p.id];
        columns.push(p.column);
        row[p.column] = Array.isArray(v) ? v.join(", ") : v === undefined ? "" : v;
      });
    });
    return { columns, answers: row };
  }

  async function submit() {
    submitting = true;
    const nextBtn = card.querySelector(".arrow--next");
    if (nextBtn) nextBtn.disabled = true;
    const payload = Object.assign(sheetRow(), { userAgent: navigator.userAgent });

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
      if (nextBtn) nextBtn.disabled = false;
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
