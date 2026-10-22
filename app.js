(function () {
  "use strict";

  const QUESTIONS = window.SURVEY_QUESTIONS || [];
  const ENDPOINT = (window.SURVEY_CONFIG && window.SURVEY_CONFIG.SHEET_ENDPOINT) || "";
  const DRAFT_KEY = "achaar-survey-draft";

  // Arrow artwork from assets/arrow-back.svg and assets/arrow-next.svg, inlined so CSS can recolour them.
  const ARROW_BACK = '<svg viewBox="0 0 31 17" aria-hidden="true"><path fill="currentColor" d="M6.92969 0.526367C7.55116 -0.141216 8.59601 -0.178956 9.26367 0.442383C9.93117 1.06378 9.96876 2.1087 9.34766 2.77637C9.04093 3.10582 7.74676 4.39572 6.4707 5.6416C7.23938 5.64394 8.10462 5.6443 9.05176 5.64844C11.7117 5.66007 13.1669 5.77011 15.8926 5.94922C18.3445 6.11034 22.9579 6.36678 25.4854 6.51855C27.9771 6.66819 28.2765 6.69526 28.5283 6.72266C28.7693 6.74888 28.9474 6.77293 29.4463 6.85254C30.347 6.99627 30.961 7.84248 30.8174 8.74316C30.6736 9.64387 29.8265 10.258 28.9258 10.1143C28.4522 10.0387 28.3345 10.0237 28.1709 10.0059C28.0181 9.98923 27.8145 9.96818 25.2871 9.81641C22.7916 9.66654 18.1372 9.40686 15.6758 9.24512C12.9394 9.0653 11.581 8.96327 9.03711 8.95215C6.67921 8.94184 4.83015 8.93926 3.7168 8.9375C4.16659 9.70669 4.9017 10.7387 5.9248 12.1328C6.3256 12.6351 6.60033 12.9301 6.89648 13.2227L7.20801 13.5254L7.22754 13.5439C7.3584 13.674 7.40029 13.718 7.46973 13.7803C7.52389 13.8288 7.60144 13.8925 7.74023 13.9883C8.491 14.5062 8.67992 15.5353 8.16211 16.2861C7.64411 17.0368 6.61502 17.2258 5.86426 16.708C5.34604 16.3505 5.10258 16.0896 4.89844 15.8867V15.8857C4.42082 15.4261 3.99359 15.0099 3.33008 14.1768C3.31669 14.1599 3.30276 14.1433 3.29004 14.126C2.17572 12.6081 1.23043 11.2962 0.667969 10.2568C0.390077 9.74327 0.12764 9.15867 0.0351562 8.56055C-0.0656321 7.90858 0.0213409 7.07968 0.662109 6.41309L0.876953 6.20996C1.10344 6.01068 1.35396 5.82864 1.51367 5.70996C1.78714 5.50673 2.00685 5.34064 2.18652 5.1748C3.58554 3.88297 6.51212 0.974829 6.92969 0.526367Z"/></svg>';
  const ARROW_NEXT = '<svg viewBox="0 0 36 19" aria-hidden="true"><path fill="currentColor" d="M25.4131 0.0146484C25.6399 0.0448629 25.8596 0.115659 25.9727 0.15332C26.1233 0.203525 26.2939 0.267224 26.4746 0.338867C26.8386 0.483189 27.2921 0.680222 27.7969 0.916016C28.8053 1.38715 30.0676 2.03784 31.29 2.78906C32.4491 3.50133 33.7674 4.38914 34.5361 4.79199C34.8073 4.93415 35.2066 5.19223 35.5 5.63477L35.6182 5.83691L35.6885 5.98633C35.9974 6.72938 35.7203 7.39972 35.6416 7.58203C35.5127 7.8805 35.3301 8.15145 35.1719 8.36426C34.844 8.80533 34.3681 9.33007 33.8154 9.90332C32.4529 11.3165 31.2469 12.425 30.2627 13.6729C29.2972 15.0998 28.5386 16.313 28.0342 17.1611C27.8798 17.4325 27.5447 18.0912 27.0664 18.5371C26.371 19.185 25.2818 19.1465 24.6338 18.4512C23.9858 17.7557 24.0242 16.6665 24.7197 16.0186C24.6808 16.0549 24.6922 16.0572 24.7637 15.9434C24.7968 15.8905 24.835 15.8253 24.8848 15.7383C24.9094 15.6952 24.9353 15.65 24.9639 15.5996C24.9919 15.5502 25.0227 15.4953 25.0547 15.4395L25.0684 15.416C25.6138 14.4983 26.4241 13.2003 27.4521 11.6836L27.5225 11.5879C28.0339 10.935 28.62 10.2933 29.2168 9.67188C24.8896 9.63154 20.813 9.59104 18.4004 9.52539C17.0472 9.48856 16.217 9.44448 15.4229 9.40332C14.6384 9.36266 13.8888 9.32457 12.6719 9.2959C10.2099 9.23791 5.98165 9.21999 3.84863 9.21094L1.71387 9.20117C0.763613 9.19698 -0.00378023 8.42387 0 7.47363C0.00420643 6.5235 0.777455 5.75616 1.72754 5.75977L3.86328 5.76855C5.98241 5.77755 10.2499 5.79553 12.7529 5.85449C14.018 5.8843 14.8055 5.92456 15.6016 5.96582C16.3879 6.00657 17.1843 6.04834 18.4941 6.08398C21.0656 6.15396 25.5831 6.19554 30.3115 6.23926C30.006 6.04583 29.7233 5.8667 29.4873 5.72168C28.3983 5.0525 27.2558 4.46208 26.3398 4.03418C25.8826 3.82057 25.4932 3.65292 25.2061 3.53906C25.0618 3.48187 24.955 3.44235 24.8848 3.41895C24.7768 3.38297 24.8316 3.40968 24.96 3.42676C24.0179 3.30138 23.3554 2.43621 23.4805 1.49414C23.606 0.552189 24.4711 -0.110451 25.4131 0.0146484Z"/></svg>';

  // Page dot (assets/dot.svg) and option outline (assets/option.svg), inlined so CSS can colour them.
  const DOT = '<svg viewBox="0 0 14 13" aria-hidden="true"><path fill="currentColor" d="M4.43658 5.26267C4.97762 4.89646 5.23755 4.27158 5.28503 4.27158C5.47063 3.98188 5.71612 3.73953 6.10818 3.61858C6.50023 3.49764 7.04258 3.43658 7.44133 3.59731C8.16427 3.88872 8.76339 4.35286 9.19151 4.97246C9.60022 5.56398 9.89282 6.2724 9.74685 7.01473C9.67532 7.37851 9.54511 7.85894 9.07466 7.85104C9.03381 7.85035 8.993 7.84961 8.95224 7.84882C8.87501 8.06672 8.73646 8.2565 8.40898 8.37C7.92171 8.53889 7.04279 8.53889 6.43787 8.4632C5.51175 8.24057 4.63782 7.88152 4.43294 7.11136C4.4028 6.99808 4.38157 6.87682 4.36513 6.75267C4.21325 6.7284 4.03843 6.64632 3.90891 6.54988C3.64478 6.35321 3.47007 6.05173 3.50707 5.77502C3.54407 5.4983 3.79807 5.2555 3.95669 5.30782C4.08642 5.35061 4.16505 5.46669 4.21625 5.62668C4.24776 5.47601 4.31704 5.34358 4.43658 5.26267Z"/><path fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" d="M5.28503 4.27158C5.23755 4.27158 4.97762 4.89646 4.43658 5.26267C4.31704 5.34358 4.24776 5.47601 4.21625 5.62668M4.53754 6.7499C4.6131 6.73041 4.6687 6.68139 4.68775 6.59226C4.85933 5.78976 4.91286 4.85252 5.28503 4.27158C5.47063 3.98188 5.71612 3.73953 6.10818 3.61858C6.50023 3.49764 7.04258 3.43658 7.44133 3.59731C8.16427 3.88872 8.76339 4.35286 9.19151 4.97246C9.60022 5.56398 9.89282 6.2724 9.74685 7.01473C9.67532 7.37851 9.54511 7.85894 9.07466 7.85104C9.03381 7.85035 8.993 7.84961 8.95224 7.84882M4.21625 5.62668C4.17694 5.81461 4.19638 6.03093 4.25033 6.21111C4.27229 6.28445 4.29893 6.35449 4.33005 6.42139M4.21625 5.62668C4.16505 5.46669 4.08642 5.35061 3.95669 5.30782C3.79807 5.2555 3.54407 5.4983 3.50707 5.77502C3.47007 6.05173 3.64478 6.35321 3.90891 6.54988C4.03843 6.64632 4.21325 6.7284 4.36513 6.75267M4.21625 5.62668C4.28378 5.83768 4.30361 6.12506 4.33005 6.42139M4.33005 6.42139C4.38548 6.54059 4.45507 6.64981 4.53754 6.7499M4.33005 6.42139C4.33989 6.53174 4.35065 6.64332 4.36513 6.75267M4.53754 6.7499C5.28056 7.6517 7.06833 7.81203 8.95224 7.84882M4.53754 6.7499C4.48727 6.76286 4.42818 6.76275 4.36513 6.75267M8.95224 7.84882C8.87501 8.06672 8.73646 8.2565 8.40898 8.37C7.92171 8.53889 7.04279 8.53889 6.43787 8.4632C5.51175 8.24057 4.63782 7.88152 4.43294 7.11136C4.4028 6.99808 4.38157 6.87682 4.36513 6.75267M8.95224 7.84882C8.98993 7.74249 9.01301 7.62947 9.03632 7.51534"/></svg>';
  const OPTION_SHAPE = '<svg class="opt__shape" viewBox="0 0 214 33" preserveAspectRatio="none" aria-hidden="true"><path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" d="M128.105 0.602713C116.832 0.602713 88.5542 0.726987 75.5296 1.00862C56.1394 1.42791 44.6577 1.61428 30.5791 2.14764C25.7169 2.33184 17.0029 2.80959 6.25131 3.53004C2.14357 3.8053 1.54653 4.17932 1.01371 8.60744C0.480883 13.0356 0.228056 21.5786 0.927692 26.1386C1.62733 30.6987 3.28709 31.0168 5.75622 31.3481C23.8682 33.7778 71.8388 31.6984 88.6687 31.1268C97.5809 30.8241 106.22 30.7949 114.523 30.6231C123.163 30.4443 132.233 30.365 148.52 30.2285C187.114 29.9051 198.519 29.7284 206.641 29.0488C210.041 28.7642 210.793 27.717 212.21 24.646C215.5 17.5198 211.598 12.0589 210.419 10.6988C208.567 8.56225 206.964 7.26054 205.288 5.95315C203.62 4.65178 200.275 3.36012 195.491 2.21647C187.728 1.24876 181.379 0.713068 168.806 0.530495C158.057 0.458037 148.943 0.527873 128.105 0.602713Z"/></svg>';

  const $ = (sel) => document.querySelector(sel);

  // WhatsApp button on the final screen
  (() => {
    const cfg = window.SURVEY_CONFIG || {};
    const number = String(cfg.WHATSAPP_NUMBER || "").replace(/\D/g, "");
    const text = encodeURIComponent(cfg.WHATSAPP_MESSAGE || "");
    const btn = document.querySelector("#whatsapp-btn");
    if (btn) btn.href = `https://wa.me/${number}${text ? `?text=${text}` : ""}`;
  })();
  const views = { home: $("#home"), survey: $("#survey"), done: $("#done") };
  const card = $("#card");
  const dots = el("div", "dots"); // lives between the back and next arrows

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

  // Fetch every question photo in the background once the home screen has loaded,
  // so they're already cached when their question comes up.
  window.addEventListener("load", () => {
    QUESTIONS.forEach((q) => (q.options || []).forEach((o) => {
      if (o.image) new Image().src = o.image;
    }));
  });

  $("#start-btn").addEventListener("click", () => {
    index = 0;
    show("survey");
    render(1);
  });

  // A question with showIf: { question, equals } only appears when that earlier answer matches.
  function applies(q) {
    if (!q.showIf) return true;
    return [].concat(answers[q.showIf.question] || []).includes(q.showIf.equals);
  }

  function back() {
    let i = index - 1;
    while (i >= 0 && !applies(QUESTIONS[i])) i--;
    if (i >= 0) { index = i; render(-1); }
    else show("home");
  }

  function next() {
    let i = index + 1;
    while (i < QUESTIONS.length && !applies(QUESTIONS[i])) i++;
    if (i < QUESTIONS.length) { index = i; render(1); }
    else submit();
  }

  // ---------- rendering ----------
  function renderDots() {
    dots.innerHTML = "";
    // only count questions that apply given the answers so far
    const shown = QUESTIONS.map((q, i) => i).filter((i) => applies(QUESTIONS[i]));
    shown.forEach((i) => {
      const d = el("span", "dot" + (i === index ? " is-current" : i < index ? " is-done" : ""));
      d.innerHTML = DOT;
      dots.append(d);
    });
    const pos = shown.indexOf(index) + 1;
    const count = el("span", "dots__count", `${pos} of ${shown.length}`);
    count.setAttribute("aria-hidden", "true");
    dots.append(count);
    dots.setAttribute("aria-label", `Question ${pos} of ${shown.length}`);
  }

  function render(direction) {
    const q = QUESTIONS[index];
    const isLast = index === QUESTIONS.length - 1;
    renderDots();

    card.innerHTML = "";
    card.className = "survey__card";
    void card.offsetWidth; // restart animation
    card.classList.add(direction < 0 ? "enter-back" : "enter", ["single", "multi", "chips", "spice", "pictures"].includes(q.type) ? "q--choice" : "q--fields", `q--${q.type}`);

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
    nav.append(backBtn, dots, nextBtn);
    card.append(nav);

    // The last page sends everything with a proper Submit button instead of the next arrow.
    let submitBtn = null;
    if (isLast) {
      nextBtn.classList.add("is-hidden");
      nextBtn.tabIndex = -1;
      submitBtn = el("button", "submit-btn");
      submitBtn.type = "submit";
      submitBtn.innerHTML = '<img src="assets/button-submit.svg" alt="Submit"><span class="submit-btn__loader" aria-hidden="true"></span>';
      card.insertBefore(submitBtn, nav);
    }

    // On questions that don't move on by themselves (pick-several, or "Other" with a text box),
    // a Next button shows up under the answers once there's something to send.
    const continueBtn = el("button", "continue-btn");
    continueBtn.type = "submit";
    continueBtn.innerHTML = '<img src="assets/button-next.svg" alt="Next">';
    const mayWait = q.type === "multi" || q.type === "chips" || (q.type === "pictures" && q.max) || !!q.other;
    if (!isLast && mayWait) card.insertBefore(continueBtn, nav); // only where it can appear, so other pages keep their layout

    const builders = { fields: buildFields, longtext: buildLongText, single: buildChoice, multi: buildChoice, chips: buildChoice, pictures: buildPictures, spice: buildSpice };
    const api = (builders[q.type] || buildLongText)(q, body, nextBtn);

    // The next arrow stays dark until the question has what it needs.
    const refresh = () => {
      nextBtn.classList.toggle("is-waiting", !!api.missing());
      if (!api.missing()) error.textContent = ""; // clear "please answer" once it's answered
      if (submitBtn) submitBtn.disabled = submitting || !!api.missing();
      const ready = !api.missing() && !!api.waitsForTap && api.waitsForTap();
      continueBtn.classList.toggle("is-shown", ready);
      continueBtn.tabIndex = ready ? 0 : -1;
      nextBtn.classList.toggle("is-ready", ready);
    };
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
      if (f.type === "checkbox") {
        const wrap = el("label", "check-field");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "check-field__box";
        input.checked = answers[f.id] === "Yes";
        wrap.append(input, el("span", "check-field__label", f.label));
        body.append(wrap);
        return { f, input, error: null };
      }
      const wrap = el("label", "line-field");
      const input = document.createElement("input");
      input.type = f.type === "email" ? "email" : f.type === "tel" ? "tel" : "text";
      input.className = "field";
      input.placeholder = f.placeholder || "";
      input.maxLength = 200;
      input.value = answers[f.id] || "";
      input.setAttribute("aria-label", (f.placeholder || f.column).replace(/\*$/, ""));
      if (f.type === "email") input.autocomplete = "email";
      if (f.type === "tel") { input.autocomplete = "tel"; input.inputMode = "tel"; }
      if (f.id === "name") input.autocomplete = "given-name";
      wrap.append(input);
      const error = el("p", "field__error");
      error.setAttribute("role", "alert");
      body.append(wrap, error);
      input.addEventListener("input", () => { error.textContent = ""; });
      return { f, input, error, wrap };
    });

    // Fields with `showIf` only appear while the named checkbox is ticked.
    const byId = Object.fromEntries(inputs.map((i) => [i.f.id, i]));
    const shown = (i) => !i.f.showIf || byId[i.f.showIf].input.checked;
    const syncShown = () => inputs.forEach((i) => {
      if (!i.f.showIf) return;
      i.wrap.hidden = !shown(i);
      if (!shown(i)) i.error.textContent = "";
    });
    inputs.forEach((i) => {
      if (i.f.type !== "checkbox") return;
      i.input.addEventListener("change", () => {
        syncShown();
        const dependent = inputs.find((d) => d.f.showIf === i.f.id);
        if (i.input.checked && dependent) dependent.input.focus({ preventScroll: true });
      });
    });
    syncShown();
    setTimeout(() => inputs[0] && inputs[0].input.focus({ preventScroll: true }), 350);

    // Each field reports its own problem, shown right under it.
    const problemWith = ({ f, input }) => {
      const v = input.value.trim();
      if (f.required && !v) return f.missing || "Please fill this in :(";
      if (f.type === "email" && v && !EMAIL.test(v)) return "That email ID doesn’t look right :(";
      if (f.type === "tel" && v && v.replace(/\D/g, "").length < 7) return "That number doesn’t look right :(";
      return "";
    };
    const visibleText = () => inputs.filter((i) => i.f.type !== "checkbox" && shown(i));
    return {
      missing: () => (visibleText().some(({ f, input }) => f.required && !input.value.trim()) ? "missing" : ""),
      invalid: () => "",
      validate: () => {
        let ok = true;
        visibleText().forEach((i) => {
          i.error.textContent = problemWith(i);
          if (i.error.textContent && ok) { ok = false; i.input.focus({ preventScroll: true }); }
        });
        return ok;
      },
      save: () => inputs.forEach((i) => {
        const { f, input } = i;
        if (f.type === "checkbox") { answers[f.id] = input.checked ? "Yes" : "No"; return; }
        const v = shown(i) ? input.value.trim() : "";
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

  // Two (or more) photos side by side with a caption; tapping one answers and moves on.
  // Photos with a caption. Single choice answers and moves on; with `max`, several can be picked.
  function buildPictures(q, body, nextBtn) {
    const multi = !!q.max;
    body.classList.add("pics");
    if (q.options.length === 4) { body.classList.add("is-grid"); card.classList.add("q--pic-grid"); }
    body.setAttribute("role", "group");
    body.setAttribute("aria-labelledby", `q-${q.id}`);
    let selected = multi ? [].concat(answers[q.id] || []) : answers[q.id];
    const isOn = (label) => (multi ? selected.includes(label) : selected === label);

    q.options.forEach((o) => {
      const btn = el("button", "pic");
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(isOn(o.label)));
      const img = document.createElement("img");
      img.src = o.image;
      img.alt = "";
      img.decoding = "async";
      img.style.setProperty("--w", o.width);
      const photo = el("span", "pic__photo");
      const tick = el("span", "pic__tick", "✓");
      tick.setAttribute("aria-hidden", "true");
      photo.append(img, tick);
      btn.append(photo, el("span", "pic__label", o.label));
      btn.addEventListener("click", () => {
        if (multi) {
          if (selected.includes(o.label)) selected = selected.filter((s) => s !== o.label);
          else if (selected.length >= q.max) { nudge(btn); return; }
          else selected.push(o.label);
          body.querySelectorAll(".pic").forEach((b, i) => b.setAttribute("aria-pressed", String(isOn(q.options[i].label))));
          // once the limit is reached there's nothing more to choose, so move on
          if (selected.length === q.max) setTimeout(() => card.requestSubmit(nextBtn), 250);
        } else {
          selected = o.label;
          body.querySelectorAll(".pic").forEach((b) => b.setAttribute("aria-pressed", "false"));
          btn.setAttribute("aria-pressed", "true");
          setTimeout(() => card.requestSubmit(nextBtn), 400); // long enough to see the tick
        }
      });
      body.append(btn);
    });

    const empty = () => (multi ? selected.length === 0 : !selected);
    return {
      missing: () => (q.required && empty() ? "Arre, pick one first!" : ""),
      waitsForTap: () => multi,
      invalid: () => "",
      save: () => { if (empty()) delete answers[q.id]; else answers[q.id] = selected; }
    };
  }


  function buildChoice(q, body, nextBtn) {
    const multi = q.type !== "single";
    if (q.type === "chips") body.classList.add("chips");
    if ((q.options.length > 6 && q.layout !== "stack") || q.layout === "tiles") body.classList.add("is-long");
    if (q.options.length === 4) body.classList.add("is-four");
    if (q.options.length === 2) body.classList.add("is-pair");
    body.setAttribute("role", "group");
    body.setAttribute("aria-labelledby", `q-${q.id}`);

    // An "other" option (q.other names it) reveals a text field; it's saved as "Other: <their words>".
    const otherPrefix = q.other ? `${q.other}: ` : null;
    let otherText = "";
    let selected = multi ? [].concat(answers[q.id] || []) : answers[q.id];
    if (otherPrefix) {
      const saved = [].concat(selected || []).find((v) => v.startsWith(otherPrefix));
      if (saved) {
        otherText = saved.slice(otherPrefix.length);
        selected = multi ? selected.map((v) => (v === saved ? q.other : v)) : q.other;
      }
    }
    const isOn = (label) => (multi ? selected.includes(label) : selected === label);
    const otherOn = () => !!q.other && isOn(q.other);

    q.options.forEach(([label, emoji]) => {
      const btn = el("button", "opt");
      btn.type = "button";
      if (q.type !== "chips") btn.innerHTML = OPTION_SHAPE;
      if (emoji) btn.append(el("span", "opt__emoji", emoji));
      btn.append(el("span", "opt__label", label));
      btn.setAttribute("aria-pressed", String(isOn(label)));

      btn.addEventListener("click", () => {
        if (multi) {
          const exclusive = q.exclusive || [];
          if (selected.includes(label)) selected = selected.filter((s) => s !== label);
          else if (exclusive.includes(label)) selected = [label];
          else if (q.max && selected.filter((s) => !exclusive.includes(s)).length >= q.max) { nudge(btn); return; }
          else selected = selected.filter((s) => !exclusive.includes(s)).concat(label);
        } else {
          selected = label;
        }
        body.querySelectorAll(".opt").forEach((b, i) => b.setAttribute("aria-pressed", String(isOn(q.options[i][0]))));
        syncOther();
        if (otherOn()) { otherInput.focus({ preventScroll: true }); return; } // wait for them to type
        // move on once there's nothing more to choose: a single answer, the limit, or a stand-alone answer like "Nothing"
        const exclusive = q.exclusive || [];
        const done = !multi || (q.max && selected.length === q.max) || (selected.length === 1 && exclusive.includes(selected[0]));
        if (done) setTimeout(() => card.requestSubmit(nextBtn), multi ? 300 : 400);
      });
      body.append(btn);
    });

    let otherWrap = null;
    let otherInput = null;
    if (q.other) {
      otherWrap = el("label", "line-field other-field");
      otherInput = document.createElement("input");
      otherInput.type = "text";
      otherInput.className = "field";
      otherInput.maxLength = 300;
      otherInput.placeholder = q.otherPlaceholder || "Tell us more";
      otherInput.value = otherText;
      otherInput.setAttribute("aria-label", q.otherPlaceholder || "Other");
      otherWrap.append(otherInput);
      body.append(otherWrap);
    }
    function syncOther() { if (otherWrap) otherWrap.hidden = !otherOn(); }
    syncOther();

    const empty = () => (multi ? selected.length === 0 : !selected);
    return {
      waitsForTap: () => multi || otherOn(),
      missing: () => {
        if (q.required && empty()) return "Arre, pick one first!";
        if (otherOn() && !otherInput.value.trim()) return q.otherMissing || "Please tell us a little more :(";
        return "";
      },
      invalid: () => "",
      save: () => {
        if (empty()) { delete answers[q.id]; return; }
        const withText = (v) => (v === q.other ? `${otherPrefix}${otherInput.value.trim()}` : v);
        answers[q.id] = multi ? selected.map(withText) : withText(selected);
      }
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
        const v = applies(q) ? answers[p.id] : undefined; // skipped follow-ups stay blank
        columns.push(p.column);
        row[p.column] = Array.isArray(v) ? v.join(", ") : v === undefined ? "" : v;
      });
    });
    return { columns, answers: row };
  }

  async function submit() {
    submitting = true;
    const nextBtn = card.querySelector(".submit-btn") || card.querySelector(".arrow--next");
    if (nextBtn) { nextBtn.disabled = true; nextBtn.classList.add("is-sending"); }
    const payload = Object.assign(sheetRow(), { userAgent: navigator.userAgent });

    try {
      if (!ENDPOINT) throw new Error("SHEET_ENDPOINT is not set in config.js");
      // text/plain keeps this a "simple" request (no CORS preflight), and Apps Script's reply allows
      // cross-origin reads, so we can check the row was really saved. If the web app isn't open to
      // "Anyone", Google answers with a sign-in page instead and this throws.
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      const reply = await res.json();
      if (!reply.ok) throw new Error(reply.error || "The sheet script reported a problem");
    } catch (err) {
      console.error("Could not send answers:", err, payload);
      submitting = false;
      if (nextBtn) { nextBtn.disabled = false; nextBtn.classList.remove("is-sending"); }
      const error = card.querySelector(".q__error");
      if (error) error.textContent = "Hmm, that didn’t go through. Check your connection and try again.";
      return;
    }

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
