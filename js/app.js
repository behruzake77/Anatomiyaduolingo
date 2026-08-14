// AnatomiLingo — asosiy ilova (Duolingo uslubi)
(function () {
  const $app = document.getElementById("app");

  // ---------- Holat (localStorage) ----------
  const DEFAULT_STATE = {
    xp: 0,
    hearts: 5,
    heartsLostAt: null,
    streak: 0,
    lastActive: null,
    done: {},        // lessonId -> {acc, at}
    mistakes: {},    // "lessonId:exIndex" -> count
    examBest: null,  // {pct, at}
    srs: {},         // "key" -> {due, level}  (spaced repetition)
    dailyGoal: 50,   // kunlik XP maqsadi
    dailyXP: 0,      // bugungi to'plangan XP
    dailyDate: null, // qaysi kunga tegishli
    answered: 0,     // jami javob berilgan savollar
    correct: 0,      // jami to'g'ri javoblar
    achievements: {},// id -> timestamp
    sound: true,
  };
  let S = load();
  function load() {
    try { return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem("anatomilingo") || "{}")); }
    catch { return { ...DEFAULT_STATE }; }
  }
  function save() { localStorage.setItem("anatomilingo", JSON.stringify(S)); }

  // Kunlik maqsad: yangi kun bo'lsa, bugungi XP ni nollash
  function resetDailyIfNeeded() {
    const today = new Date().toDateString();
    if (S.dailyDate !== today) { S.dailyXP = 0; S.dailyDate = today; save(); }
  }

  // Yuraklar: har 30 daqiqada +1
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

  function touchStreak() {
    const today = new Date().toDateString();
    if (S.lastActive === today) return false;
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    S.streak = S.lastActive === yesterday ? S.streak + 1 : 1;
    S.lastActive = today;
    save();
    return true;
  }

  // ---------- Daraja ----------
  function levelFromXP(xp) { return Math.min(99, 1 + Math.floor(xp / 100)); }
  function levelName(lv) { return lv <= 3 ? "Boshlang'ich" : lv <= 6 ? "O'rta" : "Yuksak"; }

  // ---------- Spaced repetition (SM-2 soddalashtirilgan) ----------
  const SRS_STEPS = [0, 1, 3, 7, 16, 35]; // kunlar
  function srsUpdate(key, good) {
    const it = S.srs[key] || { level: 0 };
    it.level = good ? Math.min(it.level + 1, SRS_STEPS.length - 1) : 0;
    it.due = Date.now() + SRS_STEPS[it.level] * 864e5;
    S.srs[key] = it;
  }
  function srsDueKeys() {
    const now = Date.now();
    return Object.keys(S.srs).filter(k => S.srs[k].due <= now && S.srs[k].level < SRS_STEPS.length - 1);
  }

  // ---------- Yordamchilar ----------
  const flatLessons = [];
  COURSE.units.forEach(u => u.lessons.forEach(l => flatLessons.push({ ...l, unit: u })));
  const allExercises = [];
  flatLessons.forEach(l => l.ex.forEach((e, i) => allExercises.push({ ...e, _key: l.id + ":" + i })));

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
  function exCountLabel(n) { return n + " ta mashq"; }
  function greet() {
    const h = new Date().getHours();
    if (h < 5) return "Xayrli tun";
    if (h < 12) return "Xayrli tong";
    if (h < 18) return "Xayrli kun";
    return "Xayrli kech";
  }

  const KIND_LABEL = {
    quiz: "Savol", img: "Rasmni aniqlang", match: "Moslashtiring",
    build: "Atamani tuzing", tf: "To'g'ri / noto'g'ri",
  };

  // ---------- Yutuqlar ----------
  const ACHIEVEMENTS = [
    { id: "first_lesson", icon: "🌱", t: "Ilk qadam", d: "Birinchi darsni tugating", test: s => Object.keys(s.done).length >= 1 },
    { id: "five_lessons", icon: "📚", t: "O'quvchi", d: "5 ta darsni tugating", test: s => Object.keys(s.done).length >= 5 },
    { id: "half_course", icon: "🔥", t: "Yarim yo'l", d: "Kursning yarmini tugating", test: s => Object.keys(s.done).length >= Math.ceil(flatLessons.length / 2) },
    { id: "all_lessons", icon: "🏆", t: "Bilimdon", d: "Barcha darslarni tugating", test: s => Object.keys(s.done).length >= flatLessons.length },
    { id: "streak_3", icon: "⚡", t: "Seriya", d: "3 kunlik streak", test: s => s.streak >= 3 },
    { id: "streak_7", icon: "🔥", t: "Hafta jangchisi", d: "7 kunlik streak", test: s => s.streak >= 7 },
    { id: "xp_500", icon: "⭐", t: "Faol", d: "500 XP to'plang", test: s => s.xp >= 500 },
    { id: "xp_1000", icon: "💎", t: "Yulduz", d: "1000 XP to'plang", test: s => s.xp >= 1000 },
    { id: "acc_90", icon: "🎯", t: "Mutaxassis", d: "Imtihonda 90%+ natija", test: s => !!(s.examBest && s.examBest.pct >= 90) },
    { id: "acc_100", icon: "🎓", t: "Mukammal", d: "Imtihonda 100% natija", test: s => !!(s.examBest && s.examBest.pct >= 100) },
    { id: "answers_100", icon: "🧠", t: "Quiz ustasi", d: "100 ta to'g'ri javob", test: s => s.correct >= 100 },
    { id: "level_5", icon: "🚀", t: "5-daraja", d: "5-darajaga chiqing", test: s => levelFromXP(s.xp) >= 5 },
  ];
  function checkAchievements() {
    const unlocked = [];
    for (const a of ACHIEVEMENTS) {
      if (!S.achievements[a.id] && a.test(S)) {
        S.achievements[a.id] = Date.now();
        unlocked.push(a);
      }
    }
    if (unlocked.length) save();
    return unlocked;
  }
  function showToast(icon, title, sub) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span class="t-ico">${icon}</span><div><div class="t-t">${esc(title)}</div><div class="t-s">${esc(sub)}</div></div>`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.transition = "opacity .3s"; t.style.opacity = "0"; }, 2600);
    setTimeout(() => t.remove(), 3000);
  }
  function showAchievements(list) {
    list.forEach((a, i) => setTimeout(() => showToast(a.icon, "Yutuq: " + a.t, a.d), i * 2200));
  }

  // ---------- Ovoz ----------
  let audioCtx;
  function beep(good) {
    if (!S.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = good ? [587.33, 880] : [220, 174.61];
      notes.forEach((f, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.22);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + i * 0.08); o.stop(audioCtx.currentTime + i * 0.08 + 0.26);
      });
    } catch {}
  }

  function confetti() {
    const box = document.createElement("div");
    box.className = "confetti";
    const colors = ["#6C5CE7", "#A298FE", "#00B894", "#FD79A8", "#F59E0B"];
    for (let i = 0; i < 60; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = 1.3 + Math.random() * 1.5 + "s";
      p.style.animationDelay = Math.random() * 0.5 + "s";
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3400);
  }

  // ---------- Umumiy UI ----------
  function topbar() {
    return `<div class="topbar">
      <div class="brand"><img class="logo" src="assets/icons/favicon.png" alt="">AnatomiLingo</div>
      <div class="tstats">
        <div class="stat streak"><span class="ico">🔥</span>${S.streak}</div>
        <div class="stat"><span class="ico">⚡</span>${S.xp}</div>
        <div class="stat hearts"><span class="ico">❤️</span>${S.hearts}</div>
      </div>
    </div>`;
  }

  function bottomnav(active) {
    const items = [
      ["home", "🏠", "Bosh sahifa"],
      ["atlas", "🧠", "Atlas"],
      ["exam", "🎓", "Imtihon"],
      ["profile", "👤", "Profil"],
    ];
    return `<div class="bottomnav">${items.map(([id, ico, lbl]) =>
      `<button data-nav="${id}" class="${active === id ? "active" : ""}"><span class="nico">${ico}</span>${lbl}</button>`).join("")}
    </div>`;
  }
  function bindNav() {
    $app.querySelectorAll("[data-nav]").forEach(b => b.addEventListener("click", () => {
      const n = b.dataset.nav;
      if (n === "home") renderHome();
      else if (n === "atlas") renderAtlas();
      else if (n === "exam") renderExamPage();
      else if (n === "profile") renderProfile();
    }));
  }

  // ---------- Bosh sahifa (Dashboard) ----------
  const COMING_SYSTEMS = [
    { title: "Asab tizimi", icon: "🧠", color: "#3B82F6" },
    { title: "Qon aylanish", icon: "🫀", color: "#E5484D" },
  ];

  function renderHome() {
    regenHearts();
    resetDailyIfNeeded();
    const doneCount = Object.keys(S.done).length;
    const pct = Math.round((doneCount / flatLessons.length) * 100);
    const due = srsDueKeys().length;
    const mistakes = Object.keys(S.mistakes).length;
    const lv = levelFromXP(S.xp);
    const goalPct = Math.min(100, Math.round((S.dailyXP / S.dailyGoal) * 100));

    let html = topbar() + `<div class="home">
      <div class="hero">
        <div class="greet">${greet()} 👋 Qaytib kelganingizdan xursandmiz!</div>
        <h1>Bugun o'rganishga tayyormisiz?</h1>
        <div class="tagline">Anatomiyani o'rgan. Hayotni boshqar. 🦴</div>
        <div class="hero-chips">
          <span class="hero-chip">🔥 ${S.streak} kunlik seriya</span>
          <span class="hero-chip">⭐ ${lv}-daraja · ${levelName(lv)}</span>
          <span class="hero-chip">⚡ ${S.xp} XP</span>
        </div>
        <div class="hero-goal">
          <div class="goal-ring" style="--p:${goalPct * 3.6}deg"><div>${goalPct}%</div></div>
          <div class="goal-text"><b>Kunlik maqsad:</b> ${S.dailyXP}/${S.dailyGoal} XP<br>${goalPct >= 100 ? "Bajarildi, barakalla! 🎉" : "Davom eting, oz qoldi!"}</div>
        </div>
      </div>`;

    // Continue Learning
    const cur = currentLessonId();
    if (cur) {
      const cl = flatLessons[lessonIndex(cur)];
      html += `<button class="continue-btn" id="btn-continue">
        <div class="c-ico">▶</div>
        <div>
          <div class="c-t">${esc(cl.title)}</div>
          <div class="c-s">${esc(cl.unit.title)} · davom etish</div>
        </div>
        <div class="l-go">›</div>
      </button>`;
    }

    // Takrorlash
    if (due || mistakes) {
      html += `<div class="card mode-card">
        <div class="m-ico" style="background:var(--primary-bg);color:var(--primary)">🔁</div>
        <div style="flex:1">
          <h3>Takrorlash vaqti keldi</h3>
          <p>${due ? `${due} ta savol takrorlash uchun tayyor (interval usuli).` : `${mistakes} ta xato savolingiz bor.`}</p>
          <button class="btn ghost" id="btn-srs" style="padding:9px 16px;font-size:13px">Takrorlashni boshlash</button>
        </div>
      </div>`;
    }

    // Quick Topics
    html += `<div class="section-title">Tezkor mavzular</div>
      <div class="quick-row">${QUICK.map(q =>
        `<button class="quick-chip ${q.soon ? "soon" : ""}" data-quick="${q.id}">
          <div class="q-ico" style="background:${q.color}1a">${q.icon}</div>
          <div><div class="q-t">${esc(q.label)}</div><div class="q-s">${q.soon ? "Tez kunda" : "Tezkor mashq"}</div></div>
        </button>`).join("")}
      </div>`;

    // Topics (tizimlar)
    html += `<div class="section-title">Mavzular <span class="see">${doneCount}/${flatLessons.length} dars</span></div>
      <div class="topics-grid">`;
    COURSE.units.forEach((u) => {
      const uDone = u.lessons.filter(l => S.done[l.id]).length;
      const up = Math.round((uDone / u.lessons.length) * 100);
      html += `<button class="topic-card" data-unit="${u.id}">
        <div class="tp-top">
          <div class="tp-ico" style="background:${u.color}1a">${u.icon}</div>
          <div>
            <div class="tp-title">${esc(u.title)}</div>
            <div class="tp-count">${uDone}/${u.lessons.length} dars</div>
          </div>
        </div>
        <div class="tp-bar"><div style="width:${up}%;background:${u.color}"></div></div>
      </button>`;
    });
    COMING_SYSTEMS.forEach(c => {
      html += `<div class="topic-card soon">
        <span class="soon-tag">Tez kunda</span>
        <div class="tp-top">
          <div class="tp-ico" style="background:${c.color}1a">${c.icon}</div>
          <div>
            <div class="tp-title">${esc(c.title)}</div>
            <div class="tp-count">II jildda</div>
          </div>
        </div>
        <div class="tp-bar"><div style="width:0%;background:${c.color}"></div></div>
      </div>`;
    });
    html += `</div>`;

    html += `</div>` + bottomnav("home");
    $app.innerHTML = html;

    const cb = document.getElementById("btn-continue");
    if (cb) cb.addEventListener("click", () => startLesson(cur));
    const srsBtn = document.getElementById("btn-srs");
    if (srsBtn) srsBtn.addEventListener("click", startReview);
    $app.querySelectorAll("[data-unit]").forEach(b =>
      b.addEventListener("click", () => renderUnit(b.dataset.unit)));
    $app.querySelectorAll("[data-quick]").forEach(b =>
      b.addEventListener("click", () => startQuickTopic(b.dataset.quick)));
    bindNav();
    window.scrollTo(0, 0);
  }

  // ---------- Modul detail (darslar) ----------
  function renderUnit(id) {
    const u = COURSE.units.find(x => x.id === id);
    if (!u) return renderHome();
    const uDone = u.lessons.filter(l => S.done[l.id]).length;
    const up = Math.round((uDone / u.lessons.length) * 100);
    const cur = currentLessonId();

    let html = `<div class="detail-top">
      <button class="btn-back" id="back">‹</button>
      <h2>${esc(u.title)}</h2>
    </div>
    <div class="page" style="padding-top:10px">
      <div class="page-desc" style="margin-bottom:12px">${uDone}/${u.lessons.length} dars tugallandi · ${up}%</div>
      <div style="margin:0 18px 14px"><div class="tp-bar" style="height:9px"><div style="width:${up}%;background:${u.color};height:100%;border-radius:6px"></div></div></div>
      <div style="margin:0 18px 18px;display:flex;flex-direction:column;gap:2px">`;
    for (const l of u.lessons) {
      const unlocked = isUnlocked(l.id);
      const done = S.done[l.id];
      const isCur = l.id === cur;
      html += `<button class="lesson-row" data-lesson="${l.id}" ${unlocked ? "" : "disabled"}>
        <div class="l-state ${done ? "done" : isCur ? "cur" : ""}">${done ? "✓" : isCur ? "▶" : unlocked ? "" : "🔒"}</div>
        <div>
          <div class="l-title">${esc(l.title)}</div>
          <div class="l-sub">${exCountLabel(l.ex.length)} · ${l.xp} XP</div>
        </div>
        ${done ? `<div class="l-acc">${done.acc}%</div>` : `<div class="l-go">›</div>`}
      </button>`;
    }
    html += `</div></div>` + bottomnav("home");
    $app.innerHTML = html;
    document.getElementById("back").addEventListener("click", renderHome);
    $app.querySelectorAll("[data-lesson]").forEach(b =>
      b.addEventListener("click", () => startLesson(b.dataset.lesson)));
    bindNav();
    window.scrollTo(0, 0);
  }

  // ---------- Atlas (nazariya + 3D) ----------
  function renderAtlas() {
    regenHearts();
    let html = topbar() + `<div class="page">
      <div class="page-title">Atlas</div>
      <div class="page-desc">Nazariy material — darslik asosida. Har bir mavzuda atamalar jadvali va interaktiv 3D modellar (aylantirish, kattalashtirish mumkin).</div>`;
    for (const a of ATLAS) {
      html += `<button class="card atlas-item" data-atlas="${a.id}">
        <div class="a-ico" style="background:${a.color}1a">${a.icon}</div>
        <div>
          <div class="a-t">${esc(a.title)}</div>
          <div class="a-s">${esc(a.subtitle)} · ${a.sections.length} bo'lim${a.m3d && a.m3d.length ? " · " + a.m3d.length + " ta 3D" : ""}</div>
        </div>
        <div class="l-go">›</div>
      </button>`;
    }
    html += `</div>` + bottomnav("atlas");
    $app.innerHTML = html;
    $app.querySelectorAll("[data-atlas]").forEach(b =>
      b.addEventListener("click", () => renderAtlasDetail(b.dataset.atlas)));
    bindNav();
    window.scrollTo(0, 0);
  }

  function renderAtlasDetail(id) {
    const a = ATLAS.find(x => x.id === id);
    if (!a) return renderAtlas();
    let html = `<div class="detail-top">
      <button class="btn-back" id="back">‹</button>
      <h2>${esc(a.title)}</h2>
    </div>
    <div class="theory">
      <p class="lead">${esc(a.lead)}</p>`;

    for (const s of a.sections) {
      html += `<div class="card tsection">
        <div class="ts-head">${esc(s.h)}<span class="tag">${esc(s.tag || "")}</span></div>
        ${s.img ? `<figure><img src="${s.img}" alt="" loading="lazy"><figcaption>${esc(s.cap || "")}</figcaption></figure>` : ""}
        <table class="term-table">${s.terms.map(([lat, uz]) =>
          `<tr><td class="lat">${esc(lat)}</td><td class="uzb">${esc(uz)}</td></tr>`).join("")}
        </table>
      </div>`;
    }

    if (a.m3d && a.m3d.length) {
      for (const m of a.m3d) {
        html += `<div class="card m3d" data-uid="${m.uid}">
          <div class="m3d-head"><span class="badge3d">3D</span><span class="t">${esc(m.t)}</span><span class="src">${esc(m.src)}</span></div>
          <div class="m3d-body">
            <button class="m3d-load">
              <span class="cube">🧊</span>
              <b>3D modelni yuklash</b>
              <span>Aylantirish · Kattalashtirish · Yorliqlar</span>
              <span class="go">Yuklash</span>
            </button>
          </div>
          <div class="m3d-note">Manba: ${esc(m.src)} · Sketchfab (ochiq ta'lim litsenziyasi) · Internet kerak</div>
        </div>`;
      }
    }

    html += `</div>` + bottomnav("atlas");
    $app.innerHTML = html;
    document.getElementById("back").addEventListener("click", renderAtlas);
    $app.querySelectorAll(".m3d").forEach(card => {
      const btn = card.querySelector(".m3d-load");
      btn.addEventListener("click", () => {
        const uid = card.dataset.uid;
        const body = card.querySelector(".m3d-body");
        body.innerHTML = `<iframe title="3D model" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen
          src="https://sketchfab.com/models/${uid}/embed?autostart=1&ui_theme=dark&ui_watermark=0&ui_hint=1"></iframe>`;
      });
    });
    bindNav();
    window.scrollTo(0, 0);
  }

  // ---------- Imtihon sahifasi ----------
  function renderExamPage() {
    regenHearts();
    const best = S.examBest;
    const due = srsDueKeys().length;
    const mistakes = Object.keys(S.mistakes).length;
    const acc = S.answered ? Math.round((S.correct / S.answered) * 100) : 0;
    $app.innerHTML = topbar() + `<div class="page">
      <div class="page-title">Sinov rejimlari</div>
      <div class="page-desc">Bilimingizni turli usullarda mustahkamlang va tekshiring.</div>

      <div class="card mode-card">
        <div class="m-ico" style="background:var(--violet-bg);color:var(--violet)">🎓</div>
        <div style="flex:1">
          <h3>${EXAM.title}</h3>
          <p>${EXAM.desc}</p>
          <div class="meta">
            <span>📝 ${EXAM.count} savol</span><span>⏱ ${EXAM.minutes} daqiqa</span><span>✅ ${EXAM.passPct}% o'tish</span>
          </div>
          ${best ? `<div class="meta"><span style="background:${best.pct >= EXAM.passPct ? "var(--success-bg);color:var(--success)" : "var(--error-bg);color:var(--error)"}">Eng yaxshi natija: ${best.pct}%</span></div>` : ""}
          <button class="btn full" id="btn-exam">Imtihonni boshlash</button>
        </div>
      </div>

      <div class="card mode-card">
        <div class="m-ico" style="background:var(--blue-bg);color:var(--blue)">🔁</div>
        <div style="flex:1">
          <h3>Aqlli takrorlash</h3>
          <p>Interval takrorlash (spaced repetition): xato qilgan va unutish arafasidagi savollar avtomatik tanlanadi.</p>
          <div class="meta"><span>🧠 ${due} ta navbatda</span><span>❗ ${mistakes} ta xato</span></div>
          <button class="btn full ghost" id="btn-rev" ${due || mistakes ? "" : "disabled"}>Takrorlashni boshlash</button>
        </div>
      </div>

      <div class="card mode-card">
        <div class="m-ico" style="background:var(--warn-bg);color:var(--warn)">⚡</div>
        <div style="flex:1">
          <h3>Tezkor mashq</h3>
          <p>Barcha mavzulardan 10 ta tasodifiy savol — bilimni tez tekshirish uchun. Yurak talab qilinmaydi.</p>
          <div class="meta"><span>🎯 Umumiy aniqlik: ${acc}%</span></div>
          <button class="btn full ghost" id="btn-quick">Boshlash</button>
        </div>
      </div>
    </div>` + bottomnav("exam");
    bindNav();
    document.getElementById("btn-exam").addEventListener("click", startExam);
    document.getElementById("btn-rev").addEventListener("click", startReview);
    document.getElementById("btn-quick").addEventListener("click", startQuick);
  }

  // ---------- Profil ----------
  function renderProfile() {
    regenHearts();
    const doneCount = Object.keys(S.done).length;
    const mistakes = Object.keys(S.mistakes).length;
    const srsTotal = Object.keys(S.srs).length;
    const mastered = Object.values(S.srs).filter(x => x.level >= 4).length;
    const lv = levelFromXP(S.xp);
    const acc = S.answered ? Math.round((S.correct / S.answered) * 100) : 0;
    const unlockedAch = Object.keys(S.achievements).length;
    resetDailyIfNeeded();

    $app.innerHTML = topbar() + `<div class="page profile">
      <div class="profile-hero">
        <div class="avatar">🧑‍⚕️</div>
        <div class="pname">Anatomiya o'quvchisi</div>
        <div class="plevel">${lv}-daraja · ${levelName(lv)}</div>
        <div class="pstats">
          <div class="ps"><div class="v">🔥 ${S.streak}</div><div class="l">Seriya</div></div>
          <div class="ps"><div class="v">⚡ ${S.xp}</div><div class="l">Jami XP</div></div>
          <div class="ps"><div class="v">🎯 ${acc}%</div><div class="l">Aniqlik</div></div>
        </div>
      </div>

      <div class="pgrid">
        <div class="card pcard"><div class="ico">📚</div><div><div class="val">${doneCount}/${flatLessons.length}</div><div class="lbl">Darslar</div></div></div>
        <div class="card pcard"><div class="ico">❤️</div><div><div class="val">${S.hearts}/5</div><div class="lbl">Yuraklar</div></div></div>
        <div class="card pcard"><div class="ico">🧠</div><div><div class="val">${mastered}/${srsTotal || 0}</div><div class="lbl">O'zlashtirilgan</div></div></div>
        <div class="card pcard"><div class="ico">🎓</div><div><div class="val">${S.examBest ? S.examBest.pct + "%" : "—"}</div><div class="lbl">Imtihon</div></div></div>
        <div class="card pcard"><div class="ico">📅</div><div><div class="val">${S.dailyXP}/${S.dailyGoal}</div><div class="lbl">Bugungi XP</div></div></div>
        <div class="card pcard"><div class="ico">🏅</div><div><div class="val">${unlockedAch}/${ACHIEVEMENTS.length}</div><div class="lbl">Yutuqlar</div></div></div>
      </div>

      <div class="section-title">Yutuqlar</div>
      <div class="ach-grid">${ACHIEVEMENTS.map(a => {
        const on = !!S.achievements[a.id];
        return `<div class="ach ${on ? "" : "locked"}"><div class="ach-ico">${a.icon}</div><div class="ach-t">${esc(a.t)}</div><div class="ach-d">${esc(a.d)}</div></div>`;
      }).join("")}
      </div>

      <div class="card review-box">
        <h3>Xatolar ustida ishlash</h3>
        <p>${mistakes ? `${mistakes} ta qiyin savol bor. Interval usulida takrorlab mustahkamlang.` : "Faol xatolar yo'q — ajoyib natija."}</p>
        ${mistakes ? `<button class="btn full ghost" id="btn-review">Takrorlashni boshlash</button>` : ""}
      </div>

      <div class="card review-box" style="display:flex;flex-direction:column;gap:10px">
        <button class="btn ghost full" id="btn-settings">⚙️ Sozlamalar</button>
        <button class="btn ghost full" id="btn-about">ℹ️ Ilova haqida</button>
      </div>
    </div>` + bottomnav("profile");
    bindNav();
    const rb = document.getElementById("btn-review");
    if (rb) rb.addEventListener("click", startReview);
    document.getElementById("btn-settings").addEventListener("click", renderSettings);
    document.getElementById("btn-about").addEventListener("click", renderAbout);
  }

  // ---------- Sozlamalar ----------
  function renderSettings() {
    let html = `<div class="detail-top">
      <button class="btn-back" id="back">‹</button>
      <h2>Sozlamalar</h2>
    </div>
    <div class="page" style="padding-top:10px">
      <div style="margin:0 18px;display:flex;flex-direction:column;gap:2px">
        <div class="set-row">
          <span class="s-ico">🔊</span>
          <div><div class="s-t">Ovozli signallar</div><div class="s-s">To'g'ri/noto'g'ri javobda signal</div></div>
          <label class="switch"><input type="checkbox" id="sw-sound" ${S.sound ? "checked" : ""}><span class="sl"></span></label>
        </div>
        <div class="set-row">
          <span class="s-ico">🎯</span>
          <div style="flex:1"><div class="s-t">Kunlik maqsad</div><div class="s-s">Har kuni to'planadigan XP</div></div>
          <select id="sel-goal" style="padding:8px 10px;border-radius:10px;border:1px solid var(--line);font-family:inherit;font-weight:700;color:var(--ink)">
            ${[30, 50, 100].map(g => `<option value="${g}" ${S.dailyGoal === g ? "selected" : ""}>${g} XP</option>`).join("")}
          </select>
        </div>
        <div class="set-row">
          <span class="s-ico">🗑️</span>
          <div style="flex:1"><div class="s-t">Progressni tiklash</div><div class="s-s">Barcha yutuqlar, XP va statistika o'chiriladi</div></div>
          <button class="btn danger" id="btn-reset" style="padding:9px 14px;font-size:12.5px">O'chirish</button>
        </div>
      </div>
    </div>` + bottomnav("profile");
    $app.innerHTML = html;
    document.getElementById("back").addEventListener("click", renderProfile);
    document.getElementById("sw-sound").addEventListener("change", e => { S.sound = e.target.checked; save(); });
    document.getElementById("sel-goal").addEventListener("change", e => { S.dailyGoal = +e.target.value; save(); });
    document.getElementById("btn-reset").addEventListener("click", () => {
      if (confirm("Rostdan ham barcha progress o'chirilsinmi?")) {
        S = JSON.parse(JSON.stringify(DEFAULT_STATE)); save(); renderHome();
      }
    });
    bindNav();
  }

  // ---------- Ilova haqida ----------
  function renderAbout() {
    const lv = levelFromXP(S.xp);
    $app.innerHTML = `<div class="detail-top">
      <button class="btn-back" id="back">‹</button>
      <h2>Ilova haqida</h2>
    </div>
    <div class="page" style="padding-top:10px">
      <div class="card about-box" style="margin:0 18px">
        <div class="logo-big">🦴</div>
        <h2>AnatomiLingo</h2>
        <div class="ver">Versiya 2.0 · ${levelName(lv)} daraja</div>
        <p><b>«Anatomiyani o'rgan. Hayotni boshqar.»</b><br>Anatomiyani Duolingo uslubida o'rganish uchun interaktiv mobil ilova. ${COURSE.units.length} ta mavzu, ${flatLessons.length} ta dars va ${allExercises.length}+ mashq.</p>
        <p><b>Manba:</b> A. Ahmedov va boshq. «Anatomiya I jild» (Toshkent, 2018) darsligi asosida tuzilgan.</p>
        <p><b>3D modellar:</b> Sketchfab ochiq ta'lim manbalari — Univ. of Michigan BlueLink, Elon University, Leiden University MC, Dr. P. Valchanov.</p>
        <p style="margin-bottom:0"><b>Kurs tarkibi:</b> suyaklar (osteologiya), bo'g'imlar (artrologiya), mushaklar (miologiya), hazm va nafas a'zolari.</p>
      </div>
    </div>` + bottomnav("profile");
    $app.innerHTML = html;
    document.getElementById("back").addEventListener("click", renderProfile);
    bindNav();
  }

  // ---------- Sessiyalar ----------
  let session = null;
  let examTimer = null;

  function startLesson(id) {
    regenHearts();
    if (S.hearts <= 0) return renderNoHearts();
    const l = flatLessons[lessonIndex(id)];
    session = {
      kind: "lesson", lessonId: id, title: l.title,
      queue: l.ex.map((e, i) => ({ ...e, _key: id + ":" + i })),
      idx: 0, correct: 0, xpBase: l.xp, useHearts: true, startedAt: Date.now(),
    };
    renderExercise();
  }

  function startReview() {
    regenHearts();
    if (S.hearts <= 0) return renderNoHearts();
    let keys = srsDueKeys();
    if (!keys.length) keys = Object.keys(S.mistakes);
    if (!keys.length) { showToast("ℹ️", "Takrorlash uchun savollar yo'q", "Avval darslarni ishlang"); return; }
    const exs = [];
    for (const k of shuffle(keys).slice(0, 10)) {
      const [lid, i] = k.split(":");
      const l = flatLessons[lessonIndex(lid)];
      if (l && l.ex[+i]) exs.push({ ...l.ex[+i], _key: k });
    }
    session = {
      kind: "review", lessonId: null, title: "Aqlli takrorlash",
      queue: exs, idx: 0, correct: 0, xpBase: 10, useHearts: true, startedAt: Date.now(),
    };
    renderExercise();
  }

  function startQuick() {
    const exs = shuffle(allExercises).slice(0, 10).map(e => ({ ...e }));
    session = {
      kind: "quick", lessonId: null, title: "Tezkor mashq",
      queue: exs, idx: 0, correct: 0, xpBase: 8, useHearts: false, startedAt: Date.now(),
    };
    renderExercise();
  }

  function startQuickTopic(catId) {
    const q = QUICK.find(x => x.id === catId);
    if (!q || q.soon) { showToast("ℹ️", q.label + " — tez kunda", "II jild qo'shilgach ochiladi"); return; }
    const pool = [];
    q.units.forEach(uid => {
      const u = COURSE.units.find(x => x.id === uid);
      if (u) u.lessons.forEach(l => l.ex.forEach(e => pool.push({ ...e, _key: null })));
    });
    const exs = shuffle(pool).slice(0, 8);
    if (!exs.length) return;
    session = {
      kind: "quick", lessonId: null, title: q.label,
      queue: exs, idx: 0, correct: 0, xpBase: 8, useHearts: false, startedAt: Date.now(),
    };
    renderExercise();
  }

  function startExam() {
    const exs = shuffle(allExercises).slice(0, EXAM.count).map(e => ({ ...e }));
    session = {
      kind: "exam", lessonId: null, title: EXAM.title,
      queue: exs, idx: 0, correct: 0, xpBase: 40, useHearts: false,
      deadline: Date.now() + EXAM.minutes * 60 * 1000, startedAt: Date.now(),
    };
    renderExercise();
  }

  function renderNoHearts() {
    let waitTxt = "";
    if (S.heartsLostAt) {
      const next = 30 * 60 * 1000 - (Date.now() - S.heartsLostAt) % (30 * 60 * 1000);
      waitTxt = ` Keyingi yurak ~${Math.ceil(next / 60000)} daqiqada tiklanadi.`;
    }
    $app.innerHTML = topbar() + `<div class="nohearts">
      <div class="r-emoji">💔</div>
      <h1>Yuraklar tugadi</h1>
      <p>Har 30 daqiqada 1 yurak tiklanadi.${waitTxt}<br>Yuraklarsiz «Tezkor mashq» rejimida mashq qilishingiz mumkin.</p>
      <button class="btn" id="go-quick" style="max-width:300px;width:100%;margin-bottom:10px">Tezkor mashq</button><br>
      <button class="btn ghost" id="back-home" style="max-width:300px;width:100%">Bosh sahifaga</button>
    </div>` + bottomnav("home");
    bindNav();
    document.getElementById("back-home").addEventListener("click", renderHome);
    document.getElementById("go-quick").addEventListener("click", startQuick);
  }

  function lessonHeader() {
    const pct = Math.round((session.idx / session.queue.length) * 100);
    let right;
    if (session.kind === "exam") {
      right = `<div class="exam-timer" id="timer">⏱ --:--</div>`;
    } else if (session.useHearts) {
      right = `<div class="lesson-hearts">❤️ ${S.hearts}</div>`;
    } else {
      right = `<div class="exam-timer">${session.idx + 1}/${session.queue.length}</div>`;
    }
    return `<div class="lesson-top">
      <button class="btn-quit" id="quit">✕</button>
      <div class="progress"><div style="width:${pct}%"></div></div>
      ${right}
    </div>`;
  }

  function tickExam() {
    const el = document.getElementById("timer");
    if (!el || !session || session.kind !== "exam") return;
    const left = Math.max(0, session.deadline - Date.now());
    const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    el.textContent = `⏱ ${m}:${String(s).padStart(2, "0")}`;
    if (left < 60000) el.classList.add("low");
    if (left <= 0) {
      clearInterval(examTimer);
      renderResult(true);
    }
  }

  function renderExercise() {
    if (!session || session.idx >= session.queue.length) return renderResult();
    const ex = session.queue[session.idx];
    let body = "";
    if (ex.t === "quiz" || ex.t === "img") body = quizBody(ex);
    else if (ex.t === "tf") body = tfBody(ex);
    else if (ex.t === "match") body = matchBody(ex);
    else if (ex.t === "build") body = buildBody(ex);

    $app.innerHTML = `<div class="lesson">${lessonHeader()}
      <div class="ex-body">
        <div class="ex-kind">${KIND_LABEL[ex.t] || ""} · ${session.title}</div>
        ${body}
      </div>
      <div class="ex-footer"><button class="btn full" id="check" disabled>Tekshirish</button></div>
    </div>`;
    document.getElementById("quit").addEventListener("click", () => {
      if (confirm("Chiqasizmi? Sessiya natijasi saqlanmaydi.")) {
        clearInterval(examTimer); session = null; renderHome();
      }
    });

    if (session.kind === "exam") {
      clearInterval(examTimer);
      examTimer = setInterval(tickExam, 500);
      tickExam();
    }

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
    return `<div class="ex-title">${esc(ex.q)}</div>
      ${ex.img ? `<div class="ex-img"><img src="${ex.img}" alt=""></div>` : ""}
      <div class="opts">${order.map((x, k) =>
        `<button class="opt" data-i="${x.i}"><span class="key">${String.fromCharCode(65 + k)}</span>${esc(x.o)}</button>`).join("")}
      </div>
      ${ex.hint && session.kind !== "exam" ? `<button class="hint-btn" id="hint-btn">💡 Maslahat</button><div class="hint-txt" id="hint-txt" style="display:none">${esc(ex.hint)}</div>` : ""}`;
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
    return `<div class="ex-title">${esc(ex.q)}</div>
      <div class="tf-row">
        <button class="opt" data-v="1">To'g'ri</button>
        <button class="opt" data-v="0">Noto'g'ri</button>
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
    return `<div class="ex-title">Lotincha atamani o'zbekcha tarjimasi bilan moslang</div>
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
          finishStep(ex, errors === 0, errors ? `${errors} ta xato bilan bajarildi` : null);
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

  // ----- Qadam yakuni -----
  function finishStep(ex, good, subText) {
    beep(good);
    S.answered++;
    if (good) S.correct++;
    if (ex._key) srsUpdate(ex._key, good);
    if (good) {
      session.correct++;
      if (ex._key && S.mistakes[ex._key]) delete S.mistakes[ex._key];
    } else {
      if (session.useHearts) {
        S.hearts = Math.max(0, S.hearts - 1);
        if (!S.heartsLostAt) S.heartsLostAt = Date.now();
      }
      if (ex._key) S.mistakes[ex._key] = (S.mistakes[ex._key] || 0) + 1;
      if (session.kind !== "exam" && !ex._requeued) session.queue.push({ ...ex, _requeued: true });
    }
    save();

    const fb = document.createElement("div");
    fb.className = "feedback " + (good ? "good" : "bad");
    fb.innerHTML = `<div class="fb-title">${good ? "✓ To'g'ri" : "✕ Noto'g'ri"}</div>
      ${subText ? `<div class="fb-sub">${esc(subText)}</div>` : `<div class="fb-sub"></div>`}
      <button class="btn full ${good ? "" : "danger"}" id="next">Davom etish</button>`;
    document.body.appendChild(fb);
    document.getElementById("next").addEventListener("click", () => {
      fb.remove();
      session.idx++;
      if (session.useHearts && S.hearts <= 0 && session.idx < session.queue.length) {
        clearInterval(examTimer); session = null;
        return renderNoHearts();
      }
      renderExercise();
    });
  }

  // ----- Natija -----
  function renderResult(timeUp) {
    clearInterval(examTimer);
    resetDailyIfNeeded();
    const total = session.queue.length;
    const acc = total ? Math.round((session.correct / total) * 100) : 0;
    const isExam = session.kind === "exam";
    const passed = !isExam || acc >= EXAM.passPct;
    const bonus = acc === 100 ? 10 : 0;
    const gained = passed ? session.xpBase + bonus : Math.round(session.xpBase / 4);
    const secs = Math.round((Date.now() - session.startedAt) / 1000);
    const timeStr = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

    S.xp += gained;
    S.dailyXP += gained;
    if (session.lessonId) S.done[session.lessonId] = { acc, at: Date.now() };
    if (isExam && (!S.examBest || acc > S.examBest.pct)) S.examBest = { pct: acc, at: Date.now() };
    const newStreak = touchStreak();
    save();
    const newAch = checkAchievements();

    let h1, sub, emoji;
    if (isExam) {
      emoji = passed ? "🎓" : "📚";
      h1 = timeUp ? "Vaqt tugadi" : passed ? "Imtihondan o'tdingiz!" : "Imtihondan o'tolmadingiz";
      sub = passed ? `Natija: ${acc}% (o'tish balli ${EXAM.passPct}%)` : `Natija: ${acc}%. Yana tayyorlanib qayta topshiring.`;
    } else {
      emoji = acc === 100 ? "🏆" : acc >= 70 ? "✅" : "💪";
      h1 = session.kind === "review" ? "Takrorlash yakunlandi" : session.kind === "quick" ? "Mashq yakunlandi" : "Dars yakunlandi";
      sub = acc === 100 ? "Mukammal — barcha javoblar to'g'ri." : "Xatolar avtomatik takrorlash navbatiga qo'shildi.";
    }

    $app.innerHTML = `<div class="result">
      <div class="r-emoji">${emoji}</div>
      <h1>${h1}</h1>
      <p>${sub}</p>
      <div class="res-cards">
        <div class="res-card xp"><div class="rc-top">XP</div><div class="rc-val">+${gained}</div></div>
        <div class="res-card acc"><div class="rc-top">Aniqlik</div><div class="rc-val">${acc}%</div></div>
        <div class="res-card time"><div class="rc-top">Vaqt</div><div class="rc-val">${timeStr}</div></div>
      </div>
      <button class="btn" id="continue">Davom etish</button>
    </div>`;
    beep(passed && acc >= 70);
    if (passed && acc >= 70) confetti();
    if (newAch.length) showAchievements(newAch);
    const wasExam = isExam;
    session = null;
    document.getElementById("continue").addEventListener("click", () => {
      if (newStreak) showStreak();
      else if (wasExam) renderExamPage();
      else renderHome();
    });
  }

  function showStreak() {
    const d = document.createElement("div");
    d.className = "streak-flame";
    d.innerHTML = `<div class="f">🔥</div><h2>${S.streak} kunlik seriya</h2>
      <p>Har kuni mashq qilib seriyani saqlang</p>
      <button class="btn" id="sk">Davom etish</button>`;
    document.body.appendChild(d);
    d.querySelector("#sk").addEventListener("click", () => { d.remove(); renderHome(); });
  }

  // ---------- Boshlash ----------
  regenHearts();
  resetDailyIfNeeded();
  renderHome();
})();
