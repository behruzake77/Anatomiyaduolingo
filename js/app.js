// AnatomiLingo — asosiy ilova
(function () {
  const $app = document.getElementById("app");
  const MASCOT = {
    wave: "assets/mascot/wave.png",
    party: "assets/mascot/party.png",
    sad: "assets/mascot/sad.png",
    think: "assets/mascot/think.png",
  };

  // ---------- Holat (localStorage) ----------
  const DEFAULT_STATE = {
    xp: 0,
    hearts: 5,
    heartsLostAt: null,
    streak: 0,
    lastActive: null,
    done: {},        // lessonId -> {acc, at}
    mistakes: {},    // "lessonId:exIndex" -> count (takrorlash uchun)
  };
  let S = load();
  function load() {
    try { return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem("anatomilingo") || "{}")); }
    catch { return { ...DEFAULT_STATE }; }
  }
  function save() { localStorage.setItem("anatomilingo", JSON.stringify(S)); }

  // Yuraklar tiklanishi: har 30 daqiqada +1
  function regenHearts() {
    if (S.hearts >= 5) { S.heartsLostAt = null; return; }
    if (!S.heartsLostAt) { S.heartsLostAt = Date.now(); return; }
    const gained = Math.floor((Date.now() - S.heartsLostAt) / (30 * 60 * 1000));
    if (gained > 0) {
      S.hearts = Math.min(5, S.hearts + gained);
      S.heartsLostAt = S.hearts >= 5 ? null : Date.now();
      save();
    }
  }

  // Streak
  function touchStreak() {
    const today = new Date().toDateString();
    if (S.lastActive === today) return false;
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    S.streak = S.lastActive === yesterday ? S.streak + 1 : 1;
    S.lastActive = today;
    save();
    return true;
  }

  // ---------- Yordamchilar ----------
  const flatLessons = [];
  COURSE.units.forEach(u => u.lessons.forEach(l => flatLessons.push({ ...l, unit: u })));
  function lessonIndex(id) { return flatLessons.findIndex(l => l.id === id); }
  function isUnlocked(id) {
    const i = lessonIndex(id);
    if (i === 0) return true;
    return !!S.done[flatLessons[i - 1].id];
  }
  function currentLessonId() {
    for (const l of flatLessons) if (!S.done[l.id]) return l.id;
    return null;
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  const KIND_LABEL = {
    quiz: "✏️ Savol", img: "🔍 Rasmni aniqlang", match: "🔗 Moslashtiring",
    build: "🧩 Atama yig'ing", tf: "⚖️ To'g'ri yoki noto'g'ri",
  };

  // Ovoz effektlari (WebAudio)
  let audioCtx;
  function beep(good) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = good ? [523.25, 659.25, 783.99] : [220, 174.61];
      notes.forEach((f, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.12, audioCtx.currentTime + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.09 + 0.25);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + i * 0.09); o.stop(audioCtx.currentTime + i * 0.09 + 0.3);
      });
    } catch {}
  }

  function confetti() {
    const box = document.createElement("div");
    box.className = "confetti";
    const colors = ["#58cc02", "#1cb0f6", "#ff9600", "#ffc800", "#ce82ff", "#ff4b4b"];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = 1.4 + Math.random() * 1.6 + "s";
      p.style.animationDelay = Math.random() * 0.6 + "s";
      p.style.width = p.style.height = 6 + Math.random() * 8 + "px";
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3600);
  }

  // ---------- Sahifalar ----------
  function topbar() {
    return `<div class="topbar">
      <div class="stat streak"><span class="ico">🔥</span>${S.streak}</div>
      <div class="stat xp"><span class="ico">⚡</span>${S.xp} XP</div>
      <div class="stat hearts"><span class="ico">❤️</span>${S.hearts}</div>
    </div>`;
  }

  function heroGreeting() {
    const cur = currentLessonId();
    const doneCount = Object.keys(S.done).length;
    let msg, sub;
    if (!doneCount) { msg = "Salom! Men Vertik 🦴"; sub = "Anatomiyani birga o'rganamiz. Birinchi darsni boshlang!"; }
    else if (!cur) { msg = "Kurs tugallandi! 🏆"; sub = "Barcha darslarni yakunladingiz. Endi xatolarni takrorlang!"; }
    else { msg = `Zo'r ketyapsiz! ${doneCount}/${flatLessons.length} dars`; sub = "Bugungi mashqni unutmang — streakni saqlang! 🔥"; }
    return `<div class="hero">
      <img src="${MASCOT.wave}" alt="Vertik">
      <div class="h-txt"><b>${msg}</b><span>${sub}</span></div>
    </div>`;
  }

  function renderHome() {
    regenHearts();
    const cur = currentLessonId();
    let html = topbar() + `<div class="home">` + heroGreeting();
    for (const u of COURSE.units) {
      html += `<div class="unit-header" style="background:${u.color}">
        <div>
          <div class="u-sub">${esc(COURSE.title)}</div>
          <div class="u-title">${esc(u.title)}</div>
        </div>
        <div class="u-book">${u.icon}</div>
      </div><div class="path">`;
      for (const l of u.lessons) {
        const unlocked = isUnlocked(l.id);
        const done = !!S.done[l.id];
        const isCur = l.id === cur;
        html += `<div class="node-wrap">
          <div class="node-pos">
            ${isCur ? `<div class="start-tip">BOSHLASH</div>` : ""}
            <button class="node ${done ? "done" : ""} ${unlocked ? "" : "locked"} ${isCur ? "current" : ""}"
              style="${unlocked ? `background:${u.color};box-shadow:0 8px 0 ${shade(u.color)}` : ""}"
              data-lesson="${l.id}" ${unlocked ? "" : "disabled"}>
              <span class="inner-ring"></span>
              ${done ? "⭐" : unlocked ? "★" : "🔒"}
            </button>
            <div class="node-label">${esc(l.title)}</div>
          </div>
        </div>`;
      }
      html += `</div>`;
    }
    html += `</div>` + bottomnav("home");
    $app.innerHTML = html;
    $app.querySelectorAll(".node[data-lesson]").forEach(b =>
      b.addEventListener("click", () => startLesson(b.dataset.lesson)));
    bindNav();
    window.scrollTo(0, 0);
  }

  function shade(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (n >> 16) - 50), g = Math.max(0, ((n >> 8) & 255) - 50), b = Math.max(0, (n & 255) - 50);
    return `rgb(${r},${g},${b})`;
  }

  function bottomnav(active) {
    return `<div class="bottomnav">
      <button data-nav="home" class="${active === "home" ? "active" : ""}">🏠</button>
      <button data-nav="review" class="${active === "review" ? "active" : ""}">💪</button>
      <button data-nav="profile" class="${active === "profile" ? "active" : ""}">👤</button>
    </div>`;
  }
  function bindNav() {
    $app.querySelectorAll("[data-nav]").forEach(b => b.addEventListener("click", () => {
      const n = b.dataset.nav;
      if (n === "home") renderHome();
      else if (n === "profile") renderProfile();
      else if (n === "review") startReview();
    }));
  }

  function renderProfile() {
    regenHearts();
    const doneCount = Object.keys(S.done).length;
    const mistakes = Object.keys(S.mistakes).length;
    $app.innerHTML = topbar() + `<div class="profile">
      <div class="profile-head">
        <img src="${MASCOT.think}" alt="">
        <div>
          <h1>Profil</h1>
          <div class="sub">AnatomiLingo — anatomiya o'rganuvchisi</div>
        </div>
      </div>
      <div class="pgrid">
        <div class="pcard"><div class="ico">🔥</div><div><div class="val">${S.streak} kun</div><div class="lbl">Streak</div></div></div>
        <div class="pcard"><div class="ico">⚡</div><div><div class="val">${S.xp}</div><div class="lbl">Jami XP</div></div></div>
        <div class="pcard"><div class="ico">📚</div><div><div class="val">${doneCount}/${flatLessons.length}</div><div class="lbl">Darslar</div></div></div>
        <div class="pcard"><div class="ico">❤️</div><div><div class="val">${S.hearts}/5</div><div class="lbl">Yuraklar</div></div></div>
      </div>
      <div class="review-box">
        <h3>💪 Xatolar ustida ishlash</h3>
        <p>${mistakes ? `Sizda ${mistakes} ta qiyin savol bor. Ularni takrorlab mustahkamlang!` : "Xatolaringiz yo'q. Ajoyib! 🎉"}</p>
        ${mistakes ? `<button class="btn-big blue" id="btn-review">Takrorlashni boshlash</button>` : ""}
      </div>
      <div class="review-box">
        <h3>♻️ Qayta boshlash</h3>
        <p>Barcha progressni o'chirish.</p>
        <button class="btn-big red" id="btn-reset">Progressni o'chirish</button>
      </div>
    </div>` + bottomnav("profile");
    bindNav();
    const rb = document.getElementById("btn-review");
    if (rb) rb.addEventListener("click", startReview);
    document.getElementById("btn-reset").addEventListener("click", () => {
      if (confirm("Rostdan ham barcha progress o'chirilsinmi?")) {
        S = { ...DEFAULT_STATE }; save(); renderHome();
      }
    });
  }

  // ---------- Dars sessiyasi ----------
  let session = null;

  function startLesson(id) {
    regenHearts();
    if (S.hearts <= 0) return renderNoHearts();
    const l = flatLessons[lessonIndex(id)];
    session = {
      lessonId: id,
      title: l.title,
      queue: l.ex.map((e, i) => ({ ...e, _key: id + ":" + i })),
      total: l.ex.length,
      idx: 0,
      correct: 0,
      wrongKeys: [],
      xpBase: l.xp,
      review: false,
    };
    renderExercise();
  }

  function startReview() {
    regenHearts();
    if (S.hearts <= 0) return renderNoHearts();
    const keys = Object.keys(S.mistakes);
    if (!keys.length) { alert("Takrorlash uchun xato savollar yo'q. Avval darslarni ishlang!"); return; }
    const exs = [];
    for (const k of shuffle(keys).slice(0, 10)) {
      const [lid, i] = k.split(":");
      const l = flatLessons[lessonIndex(lid)];
      if (l && l.ex[+i]) exs.push({ ...l.ex[+i], _key: k });
    }
    session = {
      lessonId: null, title: "Xatolar ustida ishlash",
      queue: exs, total: exs.length, idx: 0, correct: 0, wrongKeys: [],
      xpBase: 10, review: true,
    };
    renderExercise();
  }

  function renderNoHearts() {
    let waitTxt = "";
    if (S.heartsLostAt) {
      const next = 30 * 60 * 1000 - (Date.now() - S.heartsLostAt) % (30 * 60 * 1000);
      waitTxt = `Keyingi yurak ~${Math.ceil(next / 60000)} daqiqada tiklanadi.`;
    }
    $app.innerHTML = topbar() + `<div class="nohearts">
      <img src="${MASCOT.sad}" alt="">
      <h1>Yuraklar tugadi!</h1>
      <p>Har 30 daqiqada 1 yurak tiklanadi. ${waitTxt}</p>
      <button class="btn-big blue" id="back-home" style="max-width:300px">Bosh sahifaga</button>
    </div>` + bottomnav("home");
    bindNav();
    document.getElementById("back-home").addEventListener("click", renderHome);
  }

  function progressPct() {
    return Math.round((session.idx / session.queue.length) * 100);
  }

  function lessonHeader() {
    return `<div class="lesson-top">
      <button class="btn-quit" id="quit">✕</button>
      <div class="progress"><div style="width:${progressPct()}%"></div></div>
      <div class="lesson-hearts">❤️ ${S.hearts}</div>
    </div>`;
  }

  function renderExercise() {
    if (session.idx >= session.queue.length) return renderResult();
    const ex = session.queue[session.idx];
    let body = "";
    if (ex.t === "quiz" || ex.t === "img") body = quizBody(ex);
    else if (ex.t === "tf") body = tfBody(ex);
    else if (ex.t === "match") body = matchBody(ex);
    else if (ex.t === "build") body = buildBody(ex);

    $app.innerHTML = `<div class="lesson">${lessonHeader()}
      <div class="ex-body">
        <div class="ex-kind">${KIND_LABEL[ex.t] || ""}</div>
        ${body}
      </div>
      <div class="ex-footer"><button class="btn-big" id="check" disabled>Tekshirish</button></div>
    </div>`;
    document.getElementById("quit").addEventListener("click", () => {
      if (confirm("Darsdan chiqasizmi? Progress saqlanmaydi.")) renderHome();
    });

    if (ex.t === "quiz" || ex.t === "img") bindQuiz(ex);
    else if (ex.t === "tf") bindTF(ex);
    else if (ex.t === "match") bindMatch(ex);
    else if (ex.t === "build") bindBuild(ex);

    const hb = document.getElementById("hint-btn");
    if (hb) hb.addEventListener("click", () => {
      document.getElementById("hint-txt").style.display = "block";
      hb.style.display = "none";
    });
    window.scrollTo(0, 0);
  }

  // ----- Quiz / Img -----
  function quizBody(ex) {
    const order = shuffle(ex.opts.map((o, i) => ({ o, i })));
    ex._order = order;
    return `<div class="ex-title">${esc(ex.q)}</div>
      ${ex.img ? `<div class="ex-img"><img src="${ex.img}" alt=""></div>` : ""}
      <div class="opts">${order.map((x, k) =>
        `<button class="opt" data-i="${x.i}"><span class="key">${k + 1}</span>${esc(x.o)}</button>`).join("")}
      </div>
      ${ex.hint ? `<button class="hint-btn" id="hint-btn">💡 Maslahat</button><div class="hint-txt" id="hint-txt" style="display:none">${esc(ex.hint)}</div>` : ""}`;
  }
  function bindQuiz(ex) {
    let sel = null;
    const check = document.getElementById("check");
    $app.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
      $app.querySelectorAll(".opt").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel"); sel = +b.dataset.i; check.disabled = false;
    }));
    check.addEventListener("click", () => {
      const good = sel === ex.a;
      $app.querySelectorAll(".opt").forEach(b => {
        b.disabled = true;
        if (+b.dataset.i === ex.a) b.classList.add("correct");
        else if (+b.dataset.i === sel && !good) b.classList.add("wrong");
      });
      finishStep(ex, good, good ? null : `To'g'ri javob: ${ex.opts[ex.a]}`);
    });
  }

  // ----- True / False -----
  function tfBody(ex) {
    return `<div class="ex-quote">
        <img src="${MASCOT.think}" alt="">
        <div class="bubble">${esc(ex.q)}</div>
      </div>
      <div class="tf-row">
        <button class="opt" data-v="1">✅ To'g'ri</button>
        <button class="opt" data-v="0">❌ Noto'g'ri</button>
      </div>`;
  }
  function bindTF(ex) {
    let sel = null;
    const check = document.getElementById("check");
    $app.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
      $app.querySelectorAll(".opt").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel"); sel = b.dataset.v === "1"; check.disabled = false;
    }));
    check.addEventListener("click", () => {
      const good = sel === ex.a;
      $app.querySelectorAll(".opt").forEach(b => {
        b.disabled = true;
        const v = b.dataset.v === "1";
        if (v === ex.a) b.classList.add("correct");
        else if (v === sel && !good) b.classList.add("wrong");
      });
      finishStep(ex, good, good ? null : (ex.why || `To'g'ri javob: ${ex.a ? "To'g'ri" : "Noto'g'ri"}`));
    });
  }

  // ----- Match -----
  function matchBody(ex) {
    const left = shuffle(ex.pairs.map((p, i) => ({ txt: p[0], id: i })));
    const right = shuffle(ex.pairs.map((p, i) => ({ txt: p[1], id: i })));
    const rows = [];
    for (let k = 0; k < ex.pairs.length; k++) { rows.push(left[k], right[k]); }
    return `<div class="ex-title">Juftlarni moslashtiring</div>
      <div class="match-grid">${rows.map((c, k) =>
        `<button class="mcard" data-id="${c.id}" data-side="${k % 2 ? "R" : "L"}">${esc(c.txt)}</button>`).join("")}
      </div>`;
  }
  function bindMatch(ex) {
    const check = document.getElementById("check");
    check.textContent = "Davom etish";
    let selBtn = null, solved = 0, errors = 0;
    $app.querySelectorAll(".mcard").forEach(b => b.addEventListener("click", () => {
      if (b.classList.contains("ok")) return;
      if (!selBtn) { selBtn = b; b.classList.add("sel"); return; }
      if (selBtn === b) { b.classList.remove("sel"); selBtn = null; return; }
      if (selBtn.dataset.side === b.dataset.side) {
        selBtn.classList.remove("sel"); selBtn = b; b.classList.add("sel"); return;
      }
      if (selBtn.dataset.id === b.dataset.id) {
        selBtn.classList.remove("sel");
        selBtn.classList.add("ok"); b.classList.add("ok");
        solved++; selBtn = null;
        beep(true);
        if (solved === ex.pairs.length) {
          finishStep(ex, errors === 0, errors ? `${errors} ta xato bilan bajardingiz` : null, true);
        }
      } else {
        errors++;
        const a = selBtn, c = b;
        a.classList.remove("sel");
        a.classList.add("err"); c.classList.add("err");
        beep(false);
        setTimeout(() => { a.classList.remove("err"); c.classList.remove("err"); }, 380);
        selBtn = null;
      }
    }));
  }

  // ----- Build -----
  function buildBody(ex) {
    const words = ex.answer.split(" ");
    const bank = shuffle(words.concat(ex.extra || []));
    ex._bank = bank;
    return `<div class="ex-title">${esc(ex.q)}</div>
      <div class="build-area" id="area"></div>
      <div class="bank" id="bank">${bank.map((w, i) =>
        `<button class="chip" data-w="${esc(w)}" data-i="${i}">${esc(w)}</button>`).join("")}
      </div>`;
  }
  function bindBuild(ex) {
    const area = document.getElementById("area");
    const check = document.getElementById("check");
    const picked = [];
    function refresh() { check.disabled = picked.length === 0; }
    $app.querySelectorAll("#bank .chip").forEach(b => b.addEventListener("click", () => {
      if (b.classList.contains("ghost")) return;
      b.classList.add("ghost");
      const chip = document.createElement("button");
      chip.className = "chip"; chip.textContent = b.dataset.w; chip.dataset.src = b.dataset.i;
      chip.addEventListener("click", () => {
        area.removeChild(chip);
        picked.splice(picked.indexOf(chip), 1);
        $app.querySelector(`#bank .chip[data-i="${chip.dataset.src}"]`).classList.remove("ghost");
        refresh();
      });
      area.appendChild(chip); picked.push(chip); refresh();
    }));
    check.addEventListener("click", () => {
      const ans = picked.map(c => c.textContent).join(" ");
      const good = ans.toLowerCase() === ex.answer.toLowerCase();
      finishStep(ex, good, good ? null : `To'g'ri javob: ${ex.answer}`);
    });
  }

  // ----- Umumiy qadam yakuni -----
  function finishStep(ex, good, subText) {
    beep(good);
    if (good) {
      session.correct++;
      if (S.mistakes[ex._key]) { delete S.mistakes[ex._key]; save(); }
    } else {
      S.hearts = Math.max(0, S.hearts - 1);
      if (!S.heartsLostAt) S.heartsLostAt = Date.now();
      S.mistakes[ex._key] = (S.mistakes[ex._key] || 0) + 1;
      session.wrongKeys.push(ex._key);
      if (!ex._requeued) session.queue.push({ ...ex, _requeued: true });
      save();
    }
    const fb = document.createElement("div");
    fb.className = "feedback " + (good ? "good" : "bad");
    fb.innerHTML = `<div class="fb-row">
        <img class="fb-mascot" src="${good ? MASCOT.party : MASCOT.sad}" alt="">
        <div>
          <div class="fb-title">${good ? "Ajoyib!" : "Noto'g'ri"}</div>
          ${subText ? `<div class="fb-sub">${esc(subText)}</div>` : ""}
        </div>
      </div>
      <button class="btn-big ${good ? "" : "red"}" id="next">Davom etish</button>`;
    document.body.appendChild(fb);
    document.getElementById("next").addEventListener("click", () => {
      fb.remove();
      session.idx++;
      if (S.hearts <= 0 && session.idx < session.queue.length) {
        session = null;
        return renderNoHearts();
      }
      renderExercise();
    });
  }

  // ----- Natija -----
  function renderResult() {
    const total = session.queue.length;
    const acc = Math.round((session.correct / total) * 100);
    const bonus = acc === 100 ? 5 : 0;
    const gained = session.xpBase + bonus;
    S.xp += gained;
    if (session.lessonId) {
      S.done[session.lessonId] = { acc, at: Date.now() };
    }
    const newStreak = touchStreak();
    save();

    $app.innerHTML = `<div class="result">
      <img class="mascot-big" src="${acc >= 70 ? MASCOT.party : MASCOT.wave}" alt="">
      <h1>${session.review ? "Takrorlash yakunlandi!" : "Dars yakunlandi!"}</h1>
      <p>${acc === 100 ? "Mukammal natija! Barcha javoblar to'g'ri!" : "Yaxshi harakat! Davom eting!"}</p>
      <div class="res-cards">
        <div class="res-card xp"><div class="rc-top">Jami XP</div><div class="rc-val">⚡ ${gained}</div></div>
        <div class="res-card acc"><div class="rc-top">Aniqlik</div><div class="rc-val">🎯 ${acc}%</div></div>
      </div>
      <button class="btn-big" id="continue">Davom etish</button>
    </div>`;
    beep(true);
    if (acc >= 70) confetti();
    document.getElementById("continue").addEventListener("click", () => {
      if (newStreak) showStreak();
      else renderHome();
    });
  }

  function showStreak() {
    const d = document.createElement("div");
    d.className = "streak-flame";
    d.innerHTML = `<div class="f">🔥</div><h2>${S.streak} kunlik streak!</h2>
      <p>Har kuni mashq qilib streakni saqlang</p>
      <button class="btn-big" style="max-width:280px" id="sk">Davom etish</button>`;
    document.body.appendChild(d);
    d.querySelector("#sk").addEventListener("click", () => { d.remove(); renderHome(); });
  }

  // ---------- Ishga tushirish ----------
  regenHearts();
  renderHome();
})();
