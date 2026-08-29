// AnatomiLingo — asosiy ilova (premium redesign)
(function () {
  const $app = document.getElementById("app");

  // ---------- Holat ----------
  const DEFAULT_STATE = {
    xp: 0,
    hearts: 5,
    heartsLostAt: null,
    streak: 0,
    lastActive: null,
    done: {},          // lessonId -> {acc, at}
    mistakes: {},      // "lessonId:exIndex" -> count
    examBest: null,    // {pct, at}
    srs: {},           // "key" -> {due, level}
    dailyGoal: 50,
    dailyXP: 0,
    dailyDate: null,
    answered: 0,
    correct: 0,
    achievements: {},
    sound: true,
    bookmarks: {},     // lessonId -> true
    history: {},       // "YYYY-MM-DD" -> xp
  };
  let S = load();
  function load() {
    try { return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem("anatomilingo") || "{}")); }
    catch { return { ...DEFAULT_STATE }; }
  }
  function save() { localStorage.setItem("anatomilingo", JSON.stringify(S)); }

  const todayKey = () => new Date().toDateString();
  const dateKey = (d) => d.toDateString();
  function resetDailyIfNeeded() {
    const t = todayKey();
    if (S.dailyDate !== t) { S.dailyXP = 0; S.dailyDate = t; save(); }
  }
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
    const t = todayKey();
    if (S.lastActive === t) return false;
    const y = dateKey(new Date(Date.now() - 864e5));
    S.streak = S.lastActive === y ? S.streak + 1 : 1;
    S.lastActive = t;
    save();
    return true;
  }

  // ---------- Daraja ----------
  function levelFromXP(xp) { return Math.min(99, 1 + Math.floor(xp / 100)); }
  function levelName(lv) { return lv <= 3 ? "Boshlang'ich" : lv <= 6 ? "O'rta" : "Yuksak"; }

  // ---------- Spaced repetition ----------
  const SRS_STEPS = [0, 1, 3, 7, 16, 35];
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
  function pct(part, total) { return total ? Math.round((part / total) * 100) : 0; }
  function exCountLabel(n) { return n + " ta mashq"; }
  // Mavzuni o'zlashtirish darajasi (%) — bajarilgan darslar aniqligi asosida
  function topicMastery(unitId) {
    const u = COURSE.units.find(x => x.id === unitId);
    if (!u || !u.lessons.length) return 0;
    const sum = u.lessons.reduce((s, l) => s + (S.done[l.id] ? Math.min(100, S.done[l.id].acc) : 0), 0);
    return Math.round(sum / u.lessons.length);
  }
  function systemMastery(unitIds) {
    const uids = unitIds.map(i => COURSE.units.find(u => u.id === i)).filter(Boolean);
    if (!uids.length) return 0;
    const lessons = uids.flatMap(u => u.lessons);
    const sum = lessons.reduce((s, l) => s + (S.done[l.id] ? Math.min(100, S.done[l.id].acc) : 0), 0);
    return lessons.length ? Math.round(sum / lessons.length) : 0;
  }

  const KIND_LABEL = {
    quiz: "Savol", img: "Rasmni aniqlang", match: "Moslashtiring",
    build: "Atamani tuzing", tf: "To'g'ri / noto'g'ri",
    order: "Tartiblang", fill: "Bo'sh joyni to'ldiring", func: "Tuzilma → vazifa",
  };

  // ---------- Yutuqlar ----------
  const ACHIEVEMENTS = [
    { id: "first_lesson", icon: "sparkles", t: "Ilk qadam", d: "Birinchi darsni tugating", test: s => Object.keys(s.done).length >= 1 },
    { id: "five_lessons", icon: "book-open", t: "O'quvchi", d: "5 ta darsni tugating", test: s => Object.keys(s.done).length >= 5 },
    { id: "half_course", icon: "flame", t: "Yarim yo'l", d: "Kursning yarmini tugating", test: s => Object.keys(s.done).length >= Math.ceil(flatLessons.length / 2) },
    { id: "all_lessons", icon: "trophy", t: "Bilimdon", d: "Barcha darslarni tugating", test: s => Object.keys(s.done).length >= flatLessons.length },
    { id: "streak_3", icon: "zap", t: "Seriya", d: "3 kunlik streak", test: s => s.streak >= 3 },
    { id: "streak_7", icon: "flame", t: "Hafta jangchisi", d: "7 kunlik streak", test: s => s.streak >= 7 },
    { id: "xp_500", icon: "star", t: "Faol", d: "500 XP to'plang", test: s => s.xp >= 500 },
    { id: "xp_1000", icon: "award", t: "Yulduz", d: "1000 XP to'plang", test: s => s.xp >= 1000 },
    { id: "acc_90", icon: "target", t: "Mutaxassis", d: "Imtihonda 90%+", test: s => !!(s.examBest && s.examBest.pct >= 90) },
    { id: "acc_100", icon: "graduation-cap", t: "Mukammal", d: "Imtihonda 100%", test: s => !!(s.examBest && s.examBest.pct >= 100) },
    { id: "answers_100", icon: "medal", t: "Quiz ustasi", d: "100 ta to'g'ri javob", test: s => s.correct >= 100 },
    { id: "level_5", icon: "trending-up", t: "5-daraja", d: "5-darajaga chiqing", test: s => levelFromXP(s.xp) >= 5 },
  ];
  function checkAchievements() {
    const unlocked = [];
    for (const a of ACHIEVEMENTS) {
      if (!S.achievements[a.id] && a.test(S)) { S.achievements[a.id] = Date.now(); unlocked.push(a); }
    }
    if (unlocked.length) save();
    return unlocked;
  }
  function showToast(icon, title, sub) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span class="t-ico">${ic(icon)}</span><div><div class="t-t">${esc(title)}</div><div class="t-s">${esc(sub)}</div></div>`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.transition = "opacity .3s"; t.style.opacity = "0"; }, 2600);
    setTimeout(() => t.remove(), 3000);
  }
  function showAchievements(list) {
    list.forEach((a, i) => setTimeout(() => showToast(a.icon, a.t + " — yutuq ochildi!", a.d), i * 2100));
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
        g.gain.setValueAtTime(0.07, audioCtx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.22);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + i * 0.08); o.stop(audioCtx.currentTime + i * 0.08 + 0.26);
      });
    } catch {}
  }
  function confetti() {
    const box = document.createElement("div");
    box.className = "confetti";
    const colors = ["#6C5CE7", "#8B6CFF", "#20D9C5", "#F472B6", "#F59E0B"];
    for (let i = 0; i < 50; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = 1.2 + Math.random() * 1.4 + "s";
      p.style.animationDelay = Math.random() * 0.4 + "s";
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3200);
  }

  // ---------- Navigatsiya ----------
  const NAV = [
    ["home", "home", "Bosh sahifa"],
    ["learn", "book-open", "O'rganish"],
    ["atlas", "map", "Atlas"],
    ["quiz", "graduation-cap", "Sinov"],
    ["profile", "user", "Profil"],
  ];
  const routes = { home: renderHome, learn: renderLearn, atlas: renderAtlas, quiz: renderQuizPage, profile: renderProfile };
  function go(n) { (routes[n] || renderHome)(); }

  function brandHTML() {
    return `<div class="brand"><img class="logo" src="assets/icons/logo.svg" alt=""><span>Anatomi<span class="ln">Lingo</span></span></div>`;
  }
  function topbar() {
    return `<header class="topbar glass">
      ${brandHTML()}
      <div class="tstats">
        <div class="stat streak">${ic("flame")}<span class="num">${S.streak}</span></div>
        <div class="stat">${ic("zap")}<span class="num">${S.xp}</span></div>
        <div class="stat hearts">${ic("heart")}<span class="num">${S.hearts}</span></div>
      </div>
    </header>`;
  }
  function sidebar(active) {
    const lv = levelFromXP(S.xp);
    return `<aside class="sidebar glass">
      ${brandHTML()}
      <nav style="display:flex;flex-direction:column;gap:4px">
        ${NAV.map(([id, ico, lbl]) =>
          `<button class="side-nav ${active === id ? "active" : ""}" data-nav="${id}">${ic(ico)}<span>${lbl}</span></button>`).join("")}
      </nav>
      <div class="side-foot">
        <div class="mini">
          <div class="avatar">${ic("user")}</div>
          <div><div class="xp num" style="display:flex;align-items:center;gap:5px">${ic("zap", "ico-sm")} ${S.xp} XP</div><div class="lv">${lv}-daraja · ${levelName(lv)}</div></div>
        </div>
      </div>
    </aside>`;
  }
  function bottomnav(active) {
    return `<div class="bottomnav glass">
      ${NAV.map(([id, ico, lbl]) =>
        `<button data-nav="${id}" class="${active === id ? "active" : ""}">${ic(ico)}<span>${lbl}</span></button>`).join("")}
    </div>`;
  }
  function layout(viewHtml, active) {
    return `<div class="shell">${sidebar(active)}<div class="main">${topbar()}<div class="view">${viewHtml}</div></div></div>${bottomnav(active)}`;
  }
  function bindNav() {
    $app.querySelectorAll("[data-nav]").forEach(b => b.addEventListener("click", () => go(b.dataset.nav)));
  }

  // ---------- Bosh sahifa (Dashboard) ----------
  function renderHome() {
    regenHearts(); resetDailyIfNeeded();
    const doneCount = Object.keys(S.done).length;
    const totalPct = pct(doneCount, flatLessons.length);
    const lv = levelFromXP(S.xp);
    const goalPct = Math.min(100, Math.round((S.dailyXP / S.dailyGoal) * 100));
    const cur = currentLessonId();

    let html = `
      <div class="pad" style="padding-top:18px">
        <div class="h1">Bugun o'rganishga tayyormisan?</div>
        <div class="lead-muted">Anatomiyani o'rgan. Hayotni boshqar.</div>
      </div>

      <div class="goal-card">
        <div class="goal-ring" style="--p:${goalPct * 3.6}deg">
          <div><span class="pct num">${goalPct}%</span><span class="lbl">Maqsad</span></div>
        </div>
        <div class="goal-body">
          <div class="tag">Bugungi maqsad</div>
          <div class="val"><b>${S.dailyXP}</b> / ${S.dailyGoal} XP</div>
          <div class="bar"><div style="width:${goalPct}%"></div></div>
          <div class="goal-foot">${ic("flame")} ${S.streak} kunlik seriya</div>
        </div>
      </div>

      <div class="course-card">
        <div class="cc-body">
          <div class="cc-info">
            <div class="cc-tag">Joriy kurs</div>
            <div class="cc-title">${esc(COURSE.title)}</div>
            <div class="cc-sub">${esc(COURSE.subtitle)}</div>
            <div class="cc-progress bar"><div style="width:${totalPct}%"></div></div>
            <div class="cc-meta"><span>${doneCount} / ${flatLessons.length} dars</span><span class="num">${totalPct}%</span></div>
          </div>
          <div class="cc-illu"><img src="assets/img/illu/skeleton.jpg" alt="" loading="lazy" onerror="this.style.display='none'"></div>
        </div>
        <button class="cc-cta" id="btn-continue">${ic("play", "ico-sm")} ${cur ? "Davom etish" : "Boshlash"}</button>
      </div>

      <div class="sec-head"><h2>Bilimlar xaritasi</h2><span class="link">${doneCount}/${flatLessons.length}</span></div>
      <div class="path">${learningPathHTML()}</div>`;

    if (cur) {
      const cl = flatLessons[lessonIndex(cur)];
      html += `<div class="sec-head"><h2>Tavsiya etilgan dars</h2></div>
      <div class="pad">
        <button class="card topic-card" id="btn-rec">
          <div class="t-ico" style="background:rgba(108,92,231,0.16);color:var(--purple-3);border-color:rgba(124,92,255,0.35)">${ic(UNIT_META[cl.unit.id]?.icon || "bone")}</div>
          <div class="t-body">
            <div class="t-title">${esc(cl.title)}</div>
            <div class="t-latin">${esc(cl.unit.title)} · ${exCountLabel(cl.ex.length)}</div>
            <div class="t-meta"><span style="display:inline-flex;align-items:center;gap:4px">${ic("clock", "ico-sm")} ~5 daqiqa</span><span style="color:var(--purple-3)">+${cl.xp} XP</span></div>
          </div>
          <div class="t-go">${ic("chevron-right")}</div>
        </button>
      </div>`;
    }

    $app.innerHTML = layout(html, "home");
    const cb = document.getElementById("btn-continue");
    if (cb) cb.addEventListener("click", () => cur ? startLesson(cur) : startLesson(flatLessons[0].id));
    const rb = document.getElementById("btn-rec");
    if (rb) rb.addEventListener("click", () => startLesson(cur));
    bindPath();
    bindNav();
    window.scrollTo(0, 0);
  }

  // ---------- O'rganish yo'li ----------
  function learningPathHTML() {
    const cur = currentLessonId();
    let out = "";
    COURSE.units.forEach((u, ui) => {
      const uDone = u.lessons.filter(l => S.done[l.id]).length;
      const firstLocked = !isUnlocked(u.lessons[0].id);
      const meta = UNIT_META[u.id] || { icon: "bone" };
      out += `<div class="pgroup">
        <div class="punit ${firstLocked ? "locked" : ""}">
          <div class="pu-ico" style="background:rgba(108,92,231,0.16);color:var(--purple-3);border:1px solid rgba(124,92,255,0.3)">${ic(firstLocked ? "lock" : meta.icon)}</div>
          <div>
            <div class="pu-title">${esc(u.title)}</div>
            <div class="pu-sub">${uDone}/${u.lessons.length} dars · ${u.lessons.reduce((s, l) => s + l.xp, 0)} XP</div>
          </div>
          <div class="pu-prog num">${pct(uDone, u.lessons.length)}%</div>
        </div>
        <div class="pconn"></div>
        <div class="plessons">`;
      u.lessons.forEach(l => {
        const done = S.done[l.id];
        const isCur = l.id === cur;
        const locked = !isUnlocked(l.id);
        const stateCls = done ? "done" : isCur ? "current" : locked ? "locked" : "";
        const stateIcon = done ? "check" : isCur ? "play" : locked ? "lock" : "";
        out += `<button class="plesson ${locked ? "locked" : ""}" data-lesson="${l.id}" ${locked ? "disabled" : ""}>
          <div class="pnode ${stateCls}">${ic(stateIcon)}</div>
          <div class="pl-t">
            <div class="t">${esc(l.title)}</div>
            <div class="s">${exCountLabel(l.ex.length)} · ~5 daqiqa</div>
          </div>
          <div class="pl-xp">+${l.xp} XP</div>
        </button>`;
      });
      out += `</div></div>`;
    });
    return out;
  }
  function bindPath() {
    $app.querySelectorAll("[data-lesson]").forEach(b =>
      b.addEventListener("click", () => startLesson(b.dataset.lesson)));
  }

  // ---------- O'rganish (tizimlar) ----------
  function renderLearn() {
    regenHearts(); resetDailyIfNeeded();
    const due = srsDueKeys().length, mistakes = Object.keys(S.mistakes).length;

    let html = `
      <div class="sec-head" style="margin-top:20px"><h2>Tezkor mavzular</h2></div>
      <div class="topics-grid" style="grid-template-columns:1fr 1fr">
        ${QUICK.map(q => `
          <button class="topic-card ${q.soon ? "locked" : ""}" data-quick="${q.id}">
            <div class="t-ico" style="background:${q.color}1f;color:${q.color};border-color:${q.color}55">${ic(q.icon)}</div>
            <div class="t-body">
              <div class="t-title">${esc(q.label)}</div>
              <div class="t-latin">${q.soon ? "Tez kunda" : "Tezkor mashq"}</div>
            </div>
          </button>`).join("")}
      </div>

      ${due || mistakes ? `
      <div class="card mode-card" style="margin-top:16px">
        <div class="m-ico" style="background:rgba(108,92,231,0.16);color:var(--purple-3)">${ic("repeat")}</div>
        <div style="flex:1">
          <h3>Takrorlash vaqti keldi</h3>
          <p>${due ? due + " ta savol takrorlash uchun tayyor (interval usuli)." : mistakes + " ta xato savolingiz bor."}</p>
          <button class="btn ghost" id="btn-srs" style="padding:10px 16px;font-size:13px">Takrorlashni boshlash</button>
        </div>
      </div>` : ""}

      <div class="sec-head"><h2>Tana tizimlari</h2></div>
      <div class="topics-grid">
        ${SYSTEMS.map(sys => systemCardHTML(sys)).join("")}
      </div>`;

    $app.innerHTML = layout(html, "learn");
    $app.querySelectorAll("[data-quick]").forEach(b =>
      b.addEventListener("click", () => startQuickTopic(b.dataset.quick)));
    $app.querySelectorAll("[data-system]").forEach(b =>
      b.addEventListener("click", () => renderSystemUnits(b.dataset.system)));
    const sb = document.getElementById("btn-srs");
    if (sb) sb.addEventListener("click", startReview);
    bindNav();
    window.scrollTo(0, 0);
  }

  function systemCardHTML(sys) {
    if (sys.soon) {
      return `<button class="topic-card locked" data-system="${sys.id}">
        <div class="t-ico" style="background:${sys.color}1a;color:${sys.color};border-color:${sys.color}44">${ic(sys.icon)}</div>
        <div class="t-body">
          <div class="t-title">${esc(sys.title)}</div>
          <div class="t-latin">${esc(sys.latin)}</div>
          <div class="t-meta"><span>Tez kunda</span></div>
        </div>
        <span class="soon-badge">${esc(sys.num)}</span>
        ${ic("lock", "ico t-go")}
      </button>`;
    }
    const uids = sys.units.map(id => COURSE.units.find(u => u.id === id)).filter(Boolean);
    const done = uids.reduce((s, u) => s + u.lessons.filter(l => S.done[l.id]).length, 0);
    const total = uids.reduce((s, u) => s + u.lessons.length, 0);
    const xp = uids.reduce((s, u) => s + u.lessons.reduce((a, l) => a + l.xp, 0), 0);
    const pr = pct(done, total);
    return `<button class="topic-card" data-system="${sys.id}">
      <div class="t-ico" style="background:${sys.color}1a;color:${sys.color};border-color:${sys.color}44">${ic(sys.icon)}</div>
      <div class="t-body">
        <div class="t-title">${esc(sys.num)} · ${esc(sys.title)}</div>
        <div class="t-latin">${esc(sys.latin)}</div>
        <div class="t-progress bar" style="background:rgba(255,255,255,0.06)"><div style="width:${pr}%;background:linear-gradient(90deg,${sys.color},${sys.color}cc)"></div></div>
        <div class="t-meta"><span>${done}/${total} dars</span><span class="num">${pr}%</span><span>+${xp} XP</span></div>
      </div>
      <div class="t-go">${ic("chevron-right")}</div>
    </button>`;
  }

  function renderSystemUnits(id) {
    const sys = SYSTEMS.find(x => x.id === id);
    if (!sys || sys.soon) { showToast("lock", "Tez kunda", "Bu tizim II jildda ochiladi"); return renderLearn(); }
    const sysId = id;
    const uids = sys.units.map(i => COURSE.units.find(u => u.id === i)).filter(Boolean);
    let html = `<div class="detail-top" style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid var(--border)">
      <button class="btn-quit" id="back" style="color:var(--text-2)">${ic("arrow-left")}</button>
      <div><div class="sec-head" style="margin:0"><h2 style="font-size:17px">${esc(sys.title)}</h2></div></div>
    </div>`;
    for (const u of uids) {
      const uDone = u.lessons.filter(l => S.done[l.id]).length;
      html += `<div class="sec-head" style="margin-top:20px"><h2 style="font-size:15px">${esc(u.title)}</h2><span class="link">${uDone}/${u.lessons.length}</span></div>
      <div class="card menu" style="margin-top:0">
        ${u.lessons.map(l => {
          const done = S.done[l.id], cur = l.id === currentLessonId(), locked = !isUnlocked(l.id);
          const bm = S.bookmarks[l.id];
          return `<div class="set-row" style="display:flex">
            <div class="pnode ${done ? "done" : cur ? "current" : locked ? "locked" : ""}" style="width:32px;height:32px">${ic(done ? "check" : cur ? "play" : locked ? "lock" : "")}</div>
            <button class="pl-t" data-lesson="${l.id}" style="flex:1;text-align:left;background:none;border:none;color:inherit;${locked ? "opacity:.45;pointer-events:none" : ""}">
              <div class="t" style="font-size:13.5px;font-weight:700">${esc(l.title)}</div>
              <div class="s" style="font-size:11.5px;color:var(--muted);font-weight:600">${exCountLabel(l.ex.length)} · +${l.xp} XP</div>
            </button>
            <button class="bm-btn" data-bm="${l.id}" style="color:${bm ? "var(--teal)" : "var(--muted)"};padding:4px">${ic("bookmark", "ico")}</button>
          </div>`;
        }).join("")}
      </div>`;
    }
    html += `<div style="height:10px"></div>`;
    $app.innerHTML = layout(html, "learn");
    document.getElementById("back").addEventListener("click", renderLearn);
    $app.querySelectorAll("[data-lesson]").forEach(b => b.addEventListener("click", () => startLesson(b.dataset.lesson)));
    $app.querySelectorAll("[data-bm]").forEach(b => b.addEventListener("click", () => {
      const lid = b.dataset.bm;
      if (S.bookmarks[lid]) delete S.bookmarks[lid]; else S.bookmarks[lid] = true;
      save(); renderSystemUnits(sysId);
    }));
    bindNav();
    window.scrollTo(0, 0);
  }

  // ---------- Atlas ----------
  function renderAtlas() {
    regenHearts();
    let html = `<div class="sec-head" style="margin-top:20px"><h2>Anatomiya atlasi</h2></div>
      <div class="pad" style="margin-bottom:16px"><div class="lead-muted">Nazariy mavzular — kitob va Atlas'dan olingan 2D tasvirlar. Ba'zi mavzularda interaktiv 3D model ham bor.</div></div>
      <div class="pad atlas-topics">`;
    ATLAS.forEach(a => {
      const m3d = a.m3d ? a.m3d.length : 0;
      html += `<button class="atlas-topic" data-topic="${a.id}">
        <div class="at-cover"><img src="${a.cover}" alt="" loading="lazy" onerror="this.style.display='none'"></div>
        <div class="at-body">
          <div class="at-title">${esc(a.title)}</div>
          <div class="at-sub">${esc(a.subtitle)}</div>
          <div class="at-meta">${a.sections.length} bo'lim${m3d ? " · " + m3d + " ta 3D" : ""}</div>
        </div>
        <div class="at-go">${ic("chevron-right")}</div>
      </button>`;
    });
    html += `</div>`;

    // Anatomiya ob'yektlari (a'zolar) — 2D kartalar
    html += `<div class="sec-head"><h2>Anatomiya ob'yektlari</h2></div>
      <div class="atlas-cats">`;
    ATLAS_CATS.forEach((cat, ci) => {
      html += `<div class="atlas-cat">
        <div class="ac-head" style="color:${cat.color}">${ic(cat.icon)}<h3>${esc(cat.title)}</h3></div>
        ${cat.items.map((it, ii) => `
          <button class="anatomy-card" data-cat="${ci}" data-item="${ii}" style="width:100%;text-align:left">
            <div class="ac-illu"><img src="${it.img}" alt="${esc(it.name)}" loading="lazy" onerror="this.style.display='none'"></div>
            <div class="ac-body">
              <div class="ac-name">${esc(it.name)} <span class="ac-latin">— ${esc(it.latin)}</span></div>
              <div class="ac-desc">${esc(it.desc)}</div>
              <div class="ac-func">${ic("activity", "ico")}<span><b>Vazifasi:</b> ${esc(it.func)}</span></div>
              ${it.lessons.length ? `<div class="ac-lessons">${it.lessons.map(l => `<span class="chip">${esc(l)}</span>`).join("")}</div>` : ""}
            </div>
          </button>`).join("")}
      </div>`;
    });
    html += `</div>`;
    $app.innerHTML = layout(html, "atlas");
    $app.querySelectorAll("[data-topic]").forEach(b =>
      b.addEventListener("click", () => renderAtlasTopic(b.dataset.topic)));
    $app.querySelectorAll("[data-cat]").forEach(b =>
      b.addEventListener("click", () => renderAtlasItem(+b.dataset.cat, +b.dataset.item)));
    bindNav();
    window.scrollTo(0, 0);
  }

  // Nazariy mavzu tafsiloti: 2D → kitob ma'lumoti → [ixtiyoriy 3D]
  function renderAtlasTopic(id) {
    const a = ATLAS.find(x => x.id === id);
    if (!a) return renderAtlas();
    let html = `<div class="detail-top" style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid var(--border)">
      <button class="btn-quit" id="back" style="color:var(--text-2)">${ic("arrow-left")}</button>
      <h2 style="font-size:16px">${esc(a.title)}</h2>
    </div>
    <div class="pad" style="padding-top:16px">
      <div class="at-hero"><img src="${a.cover}" alt="${esc(a.title)}" onerror="this.style.display='none'"></div>
      <div style="margin-top:12px;display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--teal);font-weight:700">${ic("book-open", "ico-sm")} ${esc(a.source)}</div>
      <p class="theory-lead">${esc(a.lead)}</p>`;
    for (const s of a.sections) {
      html += `<div class="card tsection">
        <div class="ts-head">${esc(s.h)}<span class="tag">${esc(s.tag || "")}</span></div>
        ${s.img ? `<figure><img src="${s.img}" alt="" loading="lazy" onerror="this.style.display='none'"><figcaption>${esc(s.cap || "")}</figcaption></figure>` : ""}
        <table class="term-table">${s.terms.map(([lat, uz]) =>
          `<tr><td class="lat">${esc(lat)}</td><td class="uzb">${esc(uz)}</td></tr>`).join("")}
        </table>
      </div>`;
    }
    if (a.m3d && a.m3d.length) {
      html += `<div class="sec-head" style="margin:24px 0 0"><h2 style="font-size:15px">${ic("layers", "ico-sm")} Interaktiv 3D</h2></div>
        <p class="lead-muted" style="margin:0 0 12px;font-size:12px">3D — qo'shimcha o'rganish vositasi. Aylantiring, kattalashtiring, tuzilmalarni o'rganing.</p>`;
      for (const m of a.m3d) {
        html += `<div class="card m3d" data-uid="${m.uid}">
          <div class="m3d-head"><span class="badge3d">3D</span><span class="t">${esc(m.t)}</span><span class="src">${esc(m.src)}</span></div>
          <div class="m3d-body">
            <button class="m3d-load">
              <span class="cube">${ic("box")}</span>
              <b>3D modelni yuklash</b>
              <span>Aylantirish · Kattalashtirish · Yorliqlar</span>
              <span class="go">3D KO'RISH</span>
            </button>
          </div>
          <div class="m3d-note">Manba: ${esc(m.src)} · Sketchfab · Internet kerak</div>
        </div>`;
      }
    }
    html += `</div>`;
    $app.innerHTML = layout(html, "atlas");
    document.getElementById("back").addEventListener("click", renderAtlas);
    // 3D lazy-load: faqat bosilganda iframe yuklanadi
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

  function renderAtlasItem(ci, ii) {
    const cat = ATLAS_CATS[ci];
    const it = cat.items[ii];
    if (!it) return renderAtlas();
    let html = `<div class="detail-top" style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid var(--border)">
      <button class="btn-quit" id="back" style="color:var(--text-2)">${ic("arrow-left")}</button>
      <h2 style="font-size:16px">${esc(cat.title)}</h2>
    </div>
    <div class="pad" style="padding-top:16px">
      <div class="ac-illu" style="border-radius:18px;overflow:hidden;border:1px solid var(--border)"><img src="${it.img}" alt="${esc(it.name)}" onerror="this.style.display='none'"></div>
      <div style="margin-top:16px">
        <div class="ac-name" style="font-size:22px;font-weight:800">${esc(it.name)}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          <span class="chip" style="color:var(--purple-3);font-weight:700">${esc(it.latin)}</span>
          ${it.en ? `<span class="chip">${esc(it.en)}</span>` : ""}
        </div>
        <p style="color:var(--text-2);line-height:1.65;font-size:14px;margin-top:14px">${esc(it.desc)}</p>
        <div class="ac-func" style="margin-top:14px">${ic("activity", "ico")}<span><b>Vazifasi:</b> ${esc(it.func)}</span></div>
        ${it.lessons.length ? `<div class="sec-head" style="margin:22px 0 0"><h2 style="font-size:14px">Bog'liq darslar</h2></div>
          <div class="ac-lessons" style="margin-top:8px">${it.lessons.map(l => `<span class="chip">${esc(l)}</span>`).join("")}</div>` : ""}
        <button class="btn full" id="btn-learn" style="margin-top:22px">${ic("play", "ico-sm")} O'rganish</button>
      </div>
    </div>`;
    $app.innerHTML = layout(html, "atlas");
    document.getElementById("back").addEventListener("click", renderAtlas);
    document.getElementById("btn-learn").addEventListener("click", () => {
      if (it.quiz) startUnitQuiz(it.quiz);
      else showToast("info", "Dars hozircha yo'q", "Atlas ob'yekti uchun mashq tayyorlanmoqda");
    });
    bindNav();
    window.scrollTo(0, 0);
  }

  // Bitta modul (tizim) bo'yicha tezkor mashq
  function startUnitQuiz(unitId) {
    const u = COURSE.units.find(x => x.id === unitId);
    if (!u) return;
    const pool = [];
    u.lessons.forEach(l => l.ex.forEach(e => pool.push({ ...e, _key: null })));
    const exs = shuffle(pool).slice(0, 8);
    if (!exs.length) { showToast("info", "Mashq yo'q", "Bu mavzuda hozircha savollar yo'q"); return; }
    session = { kind: "quick", lessonId: null, title: u.title, retry: () => startUnitQuiz(unitId), queue: exs, idx: 0, correct: 0, xpBase: 8, useHearts: false, startedAt: Date.now() };
    renderExercise();
  }

  // ---------- Sinov ----------
  function renderQuizPage() {
    regenHearts();
    const best = S.examBest;
    const due = srsDueKeys().length, mistakes = Object.keys(S.mistakes).length;
    const acc = S.answered ? Math.round((S.correct / S.answered) * 100) : 0;
    const html = `
      <div class="sec-head" style="margin-top:20px"><h2>Sinov rejimlari</h2></div>

      <div class="card mode-card">
        <div class="m-ico" style="background:rgba(108,92,231,0.16);color:var(--purple-3)">${ic("graduation-cap")}</div>
        <div style="flex:1">
          <h3>${EXAM.title}</h3>
          <p>${EXAM.desc}</p>
          <div class="meta"><span>${ic("graduation-cap", "ico-sm")} ${EXAM.count} savol</span><span>${ic("clock", "ico-sm")} ${EXAM.minutes} daqiqa</span><span>${ic("check", "ico-sm")} ${EXAM.passPct}% o'tish</span></div>
          ${best ? `<div class="meta"><span style="background:${best.pct >= EXAM.passPct ? "rgba(34,197,94,0.14);color:var(--success)" : "rgba(239,68,68,0.14);color:var(--danger)"}">Eng yaxshi: ${best.pct}%</span></div>` : ""}
          <button class="btn full" id="btn-exam">Imtihonni boshlash</button>
        </div>
      </div>

      <div class="card mode-card">
        <div class="m-ico" style="background:rgba(32,217,197,0.14);color:var(--teal)">${ic("repeat")}</div>
        <div style="flex:1">
          <h3>Aqlli takrorlash</h3>
          <p>Interval takrorlash (spaced repetition): xato qilgan va unutish arafasidagi savollar avtomatik tanlanadi.</p>
          <div class="meta"><span>${ic("brain", "ico-sm")} ${due} ta navbatda</span><span>${ic("x", "ico-sm")} ${mistakes} ta xato</span></div>
          <button class="btn full ghost" id="btn-rev" ${due || mistakes ? "" : "disabled"}>Takrorlashni boshlash</button>
        </div>
      </div>

      <div class="card mode-card">
        <div class="m-ico" style="background:rgba(245,158,11,0.14);color:var(--warn)">${ic("zap")}</div>
        <div style="flex:1">
          <h3>Tezkor mashq</h3>
          <p>Barcha mavzulardan 10 ta tasodifiy savol — bilimni tez tekshirish uchun. Yurak talab qilinmaydi.</p>
          <div class="meta"><span>${ic("target", "ico-sm")} Umumiy aniqlik: ${acc}%</span></div>
          <button class="btn full ghost" id="btn-quick">Boshlash</button>
        </div>
      </div>

      <div class="sec-head"><h2>Statistika</h2></div>
      <div class="pad" style="display:flex;gap:10px">
        <button class="btn ghost" style="flex:1" id="btn-progress">${ic("bar-chart-3", "ico-sm")} Progress</button>
        <button class="btn ghost" style="flex:1" id="btn-ach">${ic("trophy", "ico-sm")} Yutuqlar</button>
      </div>`;

    $app.innerHTML = layout(html, "quiz");
    document.getElementById("btn-exam").addEventListener("click", startExam);
    document.getElementById("btn-rev").addEventListener("click", startReview);
    document.getElementById("btn-quick").addEventListener("click", startQuick);
    document.getElementById("btn-progress").addEventListener("click", renderProgress);
    document.getElementById("btn-ach").addEventListener("click", renderAchievements);
    bindNav();
  }

  // ---------- Profil ----------
  function renderProfile() {
    regenHearts();
    const doneCount = Object.keys(S.done).length;
    const lv = levelFromXP(S.xp);
    const acc = S.answered ? Math.round((S.correct / S.answered) * 100) : 0;
    const unlockedAch = Object.keys(S.achievements).length;
    resetDailyIfNeeded();

    const html = `
      <div class="profile-hero">
        <div class="avatar">${ic("user", "ico-lg")}</div>
        <div class="pname">Anatomiya o'quvchisi</div>
        <div class="plevel">${lv}-daraja · ${levelName(lv)}</div>
        <div class="pstats">
          <div class="ps"><div class="v">${ic("flame", "ico-sm")} ${S.streak}</div><div class="l">Seriya</div></div>
          <div class="ps"><div class="v">${ic("zap", "ico-sm")} ${S.xp}</div><div class="l">Jami XP</div></div>
          <div class="ps"><div class="v">${ic("target", "ico-sm")} ${acc}%</div><div class="l">Aniqlik</div></div>
        </div>
      </div>

      <div class="pgrid">
        <div class="card pcard">${ic("book-open")}<div><div class="val num">${doneCount}/${flatLessons.length}</div><div class="lbl">Darslar</div></div></div>
        <div class="card pcard">${ic("heart")}<div><div class="val num">${S.hearts}/5</div><div class="lbl">Yuraklar</div></div></div>
        <div class="card pcard">${ic("trending-up")}<div><div class="val num">${S.dailyXP}/${S.dailyGoal}</div><div class="lbl">Bugungi XP</div></div></div>
        <div class="card pcard">${ic("trophy")}<div><div class="val num">${unlockedAch}/${ACHIEVEMENTS.length}</div><div class="lbl">Yutuqlar</div></div></div>
      </div>

      <div class="card menu">
        <button class="set-row" id="m-progress"><span class="s-ico">${ic("bar-chart-3")}</span><span class="s-t">Progress</span>${ic("chevron-right", "ico chev")}</button>
        <button class="set-row" id="m-ach"><span class="s-ico">${ic("trophy")}</span><span class="s-t">Yutuqlar</span>${ic("chevron-right", "ico chev")}</button>
        <button class="set-row" id="m-bm"><span class="s-ico">${ic("bookmark")}</span><span class="s-t">Xatcho'plar</span>${ic("chevron-right", "ico chev")}</button>
        <button class="set-row" id="m-settings"><span class="s-ico">${ic("settings")}</span><span class="s-t">Sozlamalar</span>${ic("chevron-right", "ico chev")}</button>
        <button class="set-row" id="m-about"><span class="s-ico">${ic("info")}</span><span class="s-t">AnatomiLingo haqida</span>${ic("chevron-right", "ico chev")}</button>
      </div>`;

    $app.innerHTML = layout(html, "profile");
    document.getElementById("m-progress").addEventListener("click", renderProgress);
    document.getElementById("m-ach").addEventListener("click", renderAchievements);
    document.getElementById("m-bm").addEventListener("click", renderBookmarks);
    document.getElementById("m-settings").addEventListener("click", renderSettings);
    document.getElementById("m-about").addEventListener("click", renderAbout);
    bindNav();
  }

  // ---------- Progress ----------
  function renderProgress() {
    regenHearts();
    resetDailyIfNeeded();
    const days = [];
    const labels = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      days.push({ key: dateKey(d), label: labels[d.getDay() === 0 ? 6 : d.getDay() - 1], xp: S.history[dateKey(d)] || 0, today: i === 0 });
    }
    const max = Math.max(1, ...days.map(d => d.xp));

    const html = `
      <div class="sec-head" style="margin-top:20px"><h2>Progress</h2></div>

      <div class="card mode-card" style="flex-direction:column;align-items:stretch">
        <div class="meta" style="margin-bottom:14px"><span style="background:rgba(32,217,197,0.14);color:var(--teal)">Bu hafta</span><span style="display:inline-flex;align-items:center;gap:4px">${ic("flame", "ico-sm")} ${S.streak} kunlik seriya</span></div>
        <div class="chart">
          ${days.map(d => `
            <div class="col ${d.today ? "today" : ""}">
              <div class="dx num">${d.xp || ""}</div>
              <div class="bar" style="height:${Math.round((d.xp / max) * 92)}%"></div>
              <div class="dl">${d.label}</div>
            </div>`).join("")}
        </div>
      </div>

      <div class="sec-head"><h2>Tizimlar bo'yicha o'zlashtirish</h2></div>
      <div class="sys-progress">
        ${SYSTEMS.map(sys => {
          if (!sys.units.length) return "";
          const pr = systemMastery(sys.units);
          const mastered = pr >= 80;
          return `<div class="sys-row">
            <div class="sr-top"><span>${esc(sys.title)}${mastered ? ` <span class="chip" style="display:inline-flex;align-items:center;gap:4px;color:var(--success);border-color:rgba(34,197,94,.4);background:rgba(34,197,94,.12)">${ic("check", "ico-sm")} O'zlashtirilgan</span>` : ""}</span><b class="num">${pr}%</b></div>
            <div class="bar"><div style="width:${pr}%;background:linear-gradient(90deg,${sys.color},${sys.color}cc)"></div></div>
          </div>`;
        }).join("")}
      </div>

      <div class="sec-head"><h2>Umumiy</h2></div>
      <div class="pgrid">
        <div class="card pcard">${ic("book-open")}<div><div class="val num">${Object.keys(S.done).length}</div><div class="lbl">Darslar</div></div></div>
        <div class="card pcard">${ic("circle-check")}<div><div class="val num">${S.answered ? Math.round(S.correct / S.answered * 100) : 0}%</div><div class="lbl">Aniqlik</div></div></div>
        <div class="card pcard">${ic("zap")}<div><div class="val num">${S.xp}</div><div class="lbl">Jami XP</div></div></div>
        <div class="card pcard">${ic("target")}<div><div class="val num">${S.examBest ? S.examBest.pct + "%" : "—"}</div><div class="lbl">Imtihon</div></div></div>
      </div>
      <div style="height:10px"></div>`;

    $app.innerHTML = layout(html, "quiz");
    bindNav();
  }

  // ---------- Yutuqlar ----------
  function renderAchievements() {
    const html = `
      <div class="sec-head" style="margin-top:20px"><h2>Yutuqlar</h2></div>
      <div class="ach-grid">
        ${ACHIEVEMENTS.map(a => {
          const on = !!S.achievements[a.id];
          return `<div class="ach ${on ? "" : "locked"}">
            ${on ? "" : `<span class="lock-badge">${ic("lock", "ico-sm")}</span>`}
            <div class="ach-ico">${ic(a.icon)}</div>
            <div class="ach-t">${esc(a.t)}</div>
            <div class="ach-d">${esc(a.d)}</div>
          </div>`;
        }).join("")}
      </div>
      <div style="height:10px"></div>`;
    $app.innerHTML = layout(html, "quiz");
    bindNav();
  }

  // ---------- Xatcho'plar ----------
  function renderBookmarks() {
    const ids = Object.keys(S.bookmarks);
    const html = `
      <div class="sec-head" style="margin-top:20px"><h2>Xatcho'plar</h2></div>
      ${ids.length ? `<div class="card menu" style="margin:0 var(--pad)">
        ${ids.map(id => {
          const l = flatLessons[lessonIndex(id)];
          if (!l) return "";
          return `<button class="set-row" data-lesson="${id}"><span class="s-ico">${ic("bookmark")}</span><span class="s-t">${esc(l.title)}<div class="s-s">${esc(l.unit.title)} · +${l.xp} XP</div></span>${ic("chevron-right", "ico chev")}</button>`;
        }).join("")}
      </div>` : `<div class="empty">${ic("bookmark")}<h4>Xatcho'plar yo'q</h4><p>Darslarni xatcho'plab, keyin tez qaytishingiz mumkin.</p></div>`}
      <div style="height:10px"></div>`;
    $app.innerHTML = layout(html, "profile");
    $app.querySelectorAll("[data-lesson]").forEach(b => b.addEventListener("click", () => startLesson(b.dataset.lesson)));
    bindNav();
  }

  // ---------- Sozlamalar ----------
  function renderSettings() {
    const html = `
      <div class="sec-head" style="margin-top:20px"><h2>Sozlamalar</h2></div>
      <div class="card menu" style="margin:0 var(--pad)">
        <div class="set-row"><span class="s-ico">${ic("zap")}</span><span class="s-t">Ovozli signallar<div class="s-s">To'g'ri/noto'g'ri javobda signal</div></span><label class="switch"><input type="checkbox" id="sw-sound" ${S.sound ? "checked" : ""}><span class="sl"></span></label></div>
        <div class="set-row"><span class="s-ico">${ic("target")}</span><span class="s-t">Kunlik maqsad<div class="s-s">Har kuni to'planadigan XP</div></span>
          <select id="sel-goal" style="padding:8px 10px;border-radius:10px;border:1px solid var(--border);background:var(--card-2);color:var(--text);font-family:inherit;font-weight:700">
            ${[30, 50, 100].map(g => `<option value="${g}" ${S.dailyGoal === g ? "selected" : ""}>${g} XP</option>`).join("")}
          </select></div>
        <div class="set-row"><span class="s-ico" style="color:var(--danger)">${ic("x")}</span><span class="s-t">Progressni tiklash<div class="s-s">Barcha yutuqlar, XP va statistika o'chiriladi</div></span><button class="btn danger" id="btn-reset" style="padding:9px 14px;font-size:12.5px">O'chirish</button></div>
      </div>
      <div style="height:10px"></div>`;
    $app.innerHTML = layout(html, "profile");
    document.getElementById("sw-sound").addEventListener("change", e => { S.sound = e.target.checked; save(); });
    document.getElementById("sel-goal").addEventListener("change", e => { S.dailyGoal = +e.target.value; save(); });
    document.getElementById("btn-reset").addEventListener("click", () => {
      if (confirm("Rostdan ham barcha progress o'chirilsinmi?")) { S = JSON.parse(JSON.stringify(DEFAULT_STATE)); save(); renderHome(); }
    });
    bindNav();
  }

  // ---------- Haqida ----------
  function renderAbout() {
    const html = `
      <div class="card about-box" style="margin:20px var(--pad) 0;padding:26px 20px;text-align:center">
        <img src="assets/icons/logo.svg" width="84" height="84" style="border-radius:22px;margin:0 auto 12px;box-shadow:var(--glow-purple)" alt="">
        <h2 style="font-size:20px">Anatomi<span style="color:var(--purple-3)">Lingo</span></h2>
        <div class="lead-muted" style="margin:4px 0 14px">Anatomiyani o'rgan. Hayotni boshqar.</div>
        <p style="color:var(--text-2);font-size:13px;line-height:1.6">Anatomiyani o'yin uslubida o'rganish uchun premium mobil ilova — ${COURSE.units.length} mavzu, ${flatLessons.length} dars, ${allExercises.length} mashq.</p>
        <p style="color:var(--muted);font-size:12.5px;line-height:1.6;margin-top:10px"><b>Manba:</b> A. Ahmedov va boshq. «Anatomiya I jild» (Toshkent, 2018).<br><b>Ikonkalar:</b> Lucide (ISC). <b>3D modellar:</b> Sketchfab ochiq ta'lim manbalari.</p>
      </div>
      <div style="height:10px"></div>`;
    $app.innerHTML = layout(html, "profile");
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
      kind: "lesson", lessonId: id, title: l.title, retry: () => startLesson(id),
      source: l.source || null,
      slides: l.slides || [], slideIdx: 0,
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
    if (!keys.length) { showToast("info", "Takrorlash uchun savollar yo'q", "Avval darslarni ishlang"); return; }
    const exs = [];
    for (const k of shuffle(keys).slice(0, 10)) {
      const [lid, i] = k.split(":");
      const l = flatLessons[lessonIndex(lid)];
      if (l && l.ex[+i]) exs.push({ ...l.ex[+i], _key: k });
    }
    session = { kind: "review", lessonId: null, title: "Aqlli takrorlash", retry: startReview, queue: exs, idx: 0, correct: 0, xpBase: 10, useHearts: true, startedAt: Date.now() };
    renderExercise();
  }
  function startQuick() {
    const exs = shuffle(allExercises).slice(0, 10).map(e => ({ ...e }));
    session = { kind: "quick", lessonId: null, title: "Tezkor mashq", retry: startQuick, queue: exs, idx: 0, correct: 0, xpBase: 8, useHearts: false, startedAt: Date.now() };
    renderExercise();
  }
  function startQuickTopic(catId) {
    const q = QUICK.find(x => x.id === catId);
    if (!q || q.soon) { showToast("lock", q.label + " — tez kunda", "II jild qo'shilgach ochiladi"); return; }
    const pool = [];
    q.units.forEach(uid => { const u = COURSE.units.find(x => x.id === uid); if (u) u.lessons.forEach(l => l.ex.forEach(e => pool.push({ ...e, _key: null }))); });
    const exs = shuffle(pool).slice(0, 8);
    if (!exs.length) return;
    session = { kind: "quick", lessonId: null, title: q.label, retry: () => startQuickTopic(catId), queue: exs, idx: 0, correct: 0, xpBase: 8, useHearts: false, startedAt: Date.now() };
    renderExercise();
  }
  function startExam() {
    const exs = shuffle(allExercises).slice(0, EXAM.count).map(e => ({ ...e }));
    session = { kind: "exam", lessonId: null, title: EXAM.title, retry: startExam, queue: exs, idx: 0, correct: 0, xpBase: 40, useHearts: false, deadline: Date.now() + EXAM.minutes * 60 * 1000, startedAt: Date.now() };
    renderExercise();
  }

  function renderNoHearts() {
    let waitTxt = "";
    if (S.heartsLostAt) {
      const next = 30 * 60 * 1000 - (Date.now() - S.heartsLostAt) % (30 * 60 * 1000);
      waitTxt = ` Keyingi yurak ~${Math.ceil(next / 60000)} daqiqada tiklanadi.`;
    }
    const html = `<div class="nohearts">
      <div class="r-emoji" style="color:var(--pink)">${ic("heart")}</div>
      <h1>Yuraklar tugadi</h1>
      <p>Har 30 daqiqada 1 yurak tiklanadi.${waitTxt}<br>Yuraklarsiz «Tezkor mashq» rejimida mashq qilishingiz mumkin.</p>
      <button class="btn" id="go-quick" style="max-width:300px;width:100%;margin-bottom:10px">Tezkor mashq</button><br>
      <button class="btn ghost" id="back-home" style="max-width:300px;width:100%">Bosh sahifaga</button>
    </div>`;
    $app.innerHTML = layout(html, "home");
    document.getElementById("back-home").addEventListener("click", renderHome);
    document.getElementById("go-quick").addEventListener("click", startQuick);
    bindNav();
  }

  function lessonHeader() {
    const pct = Math.round((session.idx / session.queue.length) * 100);
    let right;
    if (session.kind === "exam") right = `<div class="exam-timer" id="timer">${ic("clock", "ico-sm")} <span id="timer-num">--:--</span></div>`;
    else if (session.useHearts) right = `<div class="lesson-hearts">${ic("heart", "ico-sm")} ${S.hearts}</div>`;
    else right = `<div class="exam-timer">${session.idx + 1}/${session.queue.length}</div>`;
    return `<div class="lesson-top glass">
      <button class="btn-quit" id="quit">${ic("x")}</button>
      <div class="progress"><div style="width:${pct}%"></div></div>
      ${right}
    </div>`;
  }

  function tickExam() {
    const el = document.getElementById("timer");
    if (!el || !session || session.kind !== "exam") return;
    const left = Math.max(0, session.deadline - Date.now());
    const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    const num = document.getElementById("timer-num");
    if (num) num.textContent = `${m}:${String(s).padStart(2, "0")}`;
    else el.textContent = `${m}:${String(s).padStart(2, "0")}`;
    if (left < 60000) el.classList.add("low");
    if (left <= 0) { clearInterval(examTimer); renderResult(true); }
  }

  function renderExercise() {
    if (!session) return;
    if (session.slides && session.slideIdx < session.slides.length) return renderSlide();
    if (session.idx >= session.queue.length) return renderResult();
    const ex = session.queue[session.idx];
    let body = "";
    if (ex.t === "quiz" || ex.t === "img" || ex.t === "func") body = quizBody(ex);
    else if (ex.t === "tf") body = tfBody(ex);
    else if (ex.t === "match") body = matchBody(ex);
    else if (ex.t === "build") body = buildBody(ex);
    else if (ex.t === "order") body = orderBody(ex);
    else if (ex.t === "fill") body = fillBody(ex);

    $app.innerHTML = `<div class="lesson">${lessonHeader()}
      <div class="ex-body">
        <div class="ex-kind">${KIND_LABEL[ex.t] || ""}${session.source ? ` · <span style="opacity:.6">${BOOKS[session.source.book].title} · ${session.source.page}-bet</span>` : ""}</div>
        ${body}
      </div>
      <div class="ex-footer"><button class="btn full" id="check" disabled>Tekshirish</button></div>
    </div>`;
    document.getElementById("quit").addEventListener("click", () => {
      if (confirm("Chiqasizmi? Sessiya natijasi saqlanmaydi.")) { clearInterval(examTimer); session = null; renderHome(); }
    });
    if (session.kind === "exam") { clearInterval(examTimer); examTimer = setInterval(tickExam, 500); tickExam(); }
    if (ex.t === "quiz" || ex.t === "img" || ex.t === "func") bindQuiz(ex);
    else if (ex.t === "tf") bindTF(ex);
    else if (ex.t === "match") bindMatch(ex);
    else if (ex.t === "build") bindBuild(ex);
    else if (ex.t === "order") bindOrder(ex);
    else if (ex.t === "fill") bindFill(ex);
    const hb = document.getElementById("hint-btn");
    if (hb) hb.addEventListener("click", () => { document.getElementById("hint-txt").style.display = "block"; hb.style.display = "none"; });
    window.scrollTo(0, 0);
  }

  // ---------- O'rganish slaydlari (intro → vizual → tushuntirish) ----------
  function renderSlide() {
    const s = session.slides[session.slideIdx];
    const total = session.slides.length;
    const pct = Math.round((session.slideIdx / total) * 100);
    let body;
    if (s.parts && s.parts.length) {
      // Interaktiv «qismlarni o'rganish» — nuqtaga bosing, nomi chiqadi
      body = `<div class="ex-kind">${esc(session.title)}</div>
        <h2 style="font-size:20px;margin:6px 0 12px">${esc(s.title)}</h2>
        <p style="color:var(--text-2);line-height:1.7;font-size:14px;max-width:420px">${esc(s.text)}</p>
        <div class="study">
          <div class="study-img">
            <img src="${s.img}" alt="" onerror="this.style.display='none'">
            ${s.parts.map((p, i) => `<button class="study-dot" data-i="${i}" style="left:${p.x}%;top:${p.y}%" aria-label="${esc(p.label)}"><span>${i + 1}</span></button>`).join("")}
          </div>
          <div class="study-tag" id="study-tag">Qismlardan birini bosing 👆</div>
          <div class="study-list">${s.parts.map((p, i) => `<button class="study-chip" data-i="${i}"><span class="n">${i + 1}</span><span>${esc(p.label)}</span></button>`).join("")}</div>
          ${s.cap ? `<div class="lead-muted" style="margin-top:12px;font-size:11.5px">${esc(s.cap)}</div>` : ""}
        </div>`;
    } else {
      body = `<div class="ex-kind">${esc(session.title)}</div>
        <h2 style="font-size:22px;margin:6px 0 14px">${esc(s.title)}</h2>
        ${s.img ? `<div class="ex-img"><img src="${s.img}" alt="" onerror="this.style.display='none'" style="max-height:240px"></div>` : ""}
        <p style="color:var(--text-2);line-height:1.7;font-size:14.5px;max-width:420px">${esc(s.text)}</p>
        ${s.cap ? `<div class="lead-muted" style="margin-top:12px;font-size:11.5px">${esc(s.cap)}</div>` : ""}`;
    }
    $app.innerHTML = `<div class="lesson">
      <div class="lesson-top glass">
        <button class="btn-quit" id="quit">${ic("x")}</button>
        <div class="progress"><div style="width:${pct}%"></div></div>
        <div class="exam-timer">${session.slideIdx + 1}/${total}</div>
      </div>
      <div class="ex-body" style="align-items:center;text-align:center;justify-content:center">
        ${body}
      </div>
      <div class="ex-footer"><button class="btn full" id="next-slide">${session.slideIdx + 1 >= total ? "Mashqni boshlash" : "Davom etish"}</button></div>
    </div>`;
    document.getElementById("quit").addEventListener("click", () => {
      if (confirm("Chiqasizmi? Sessiya natijasi saqlanmaydi.")) { session = null; renderHome(); }
    });
    if (s.parts && s.parts.length) bindStudySlide(s.parts);
    document.getElementById("next-slide").addEventListener("click", () => {
      session.slideIdx++;
      renderExercise();
    });
    window.scrollTo(0, 0);
  }

  // Interaktiv o'rganish: nuqta/chipga bosilganda nomni ko'rsatadi
  function bindStudySlide(parts) {
    const tag = document.getElementById("study-tag");
    const dots = Array.from($app.querySelectorAll(".study-dot"));
    const chips = Array.from($app.querySelectorAll(".study-chip"));
    const seen = new Set();
    function activate(i) {
      dots.forEach(d => d.classList.toggle("on", +d.dataset.i === i));
      chips.forEach(c => c.classList.toggle("on", +c.dataset.i === i));
      if (tag) tag.innerHTML = `<b>${i + 1}.</b> ${esc(parts[i].label)}`;
    }
    function markSeen(i) {
      seen.add(i);
      dots[i].classList.add("seen");
      chips[i].classList.add("seen");
      if (seen.size >= parts.length && tag) tag.innerHTML = `${ic("check", "ico-sm")} Barcha qismlar ko'rildi — davom etishingiz mumkin`;
    }
    dots.forEach(d => d.addEventListener("click", () => { const i = +d.dataset.i; markSeen(i); activate(i); }));
    chips.forEach(c => c.addEventListener("click", () => { const i = +c.dataset.i; markSeen(i); activate(i); }));
  }

  function quizBody(ex) {
    const order = shuffle(ex.opts.map((o, i) => ({ o, i })));
    return `<div class="ex-title">${esc(ex.q)}</div>
      ${ex.img ? `<div class="ex-img"><img src="${ex.img}" alt="" onerror="this.style.display='none'"></div>` : ""}
      <div class="opts">${order.map((x, k) =>
        `<button class="opt" data-i="${x.i}"><span class="key">${String.fromCharCode(65 + k)}</span><span>${esc(x.o)}</span></button>`).join("")}
      </div>
      ${ex.hint && session.kind !== "exam" ? `<button class="hint-btn" id="hint-btn">${ic("info", "ico-sm")} Maslahat</button><div class="hint-txt" id="hint-txt" style="display:none">${esc(ex.hint)}</div>` : ""}`;
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
  function tfBody(ex) {
    return `<div class="ex-title">${esc(ex.q)}</div>
      <div class="tf-row">
        <button class="opt" data-v="1"><span>To'g'ri</span></button>
        <button class="opt" data-v="0"><span>Noto'g'ri</span></button>
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
      if (selBtn.dataset.side === b.dataset.side) { selBtn.classList.remove("sel"); selBtn = b; b.classList.add("sel"); return; }
      if (selBtn.dataset.id === b.dataset.id) {
        selBtn.classList.remove("sel"); selBtn.classList.add("ok"); b.classList.add("ok");
        solved++; selBtn = null; beep(true);
        if (solved === ex.pairs.length) finishStep(ex, errors === 0, errors ? errors + " ta xato bilan bajarildi" : null);
      } else {
        errors++;
        const a = selBtn, c = b;
        a.classList.remove("sel"); a.classList.add("err"); c.classList.add("err");
        beep(false);
        setTimeout(() => { a.classList.remove("err"); c.classList.remove("err"); }, 380);
        selBtn = null;
      }
    }));
  }
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

  // ----- Ordering (tartiblash) -----
  function orderBody(ex) {
    const items = shuffle(ex.items.map((t, i) => ({ t, i })));
    return `<div class="ex-title">${esc(ex.q)}</div>
      <div class="build-area" id="area" style="min-height:84px"></div>
      <div class="bank" id="bank">${items.map((it, k) =>
        `<button class="chip" data-t="${esc(it.t)}" data-i="${it.i}" data-k="${k}"><span class="num" style="margin-right:6px;opacity:.6">${k + 1}</span>${esc(it.t)}</button>`).join("")}
      </div>
      <div class="hint-txt" style="display:block;margin-top:16px;font-size:12px;color:var(--muted)">Elementlarni to'g'ri ketma-ketlikda bosing</div>`;
  }
  function bindOrder(ex) {
    const area = document.getElementById("area");
    const check = document.getElementById("check");
    const picked = [];
    function refresh() {
      check.disabled = picked.length !== ex.items.length;
      // qayta raqamlash
      area.querySelectorAll(".chip .num").forEach((n, i) => n.textContent = i + 1);
    }
    $app.querySelectorAll("#bank .chip").forEach(b => b.addEventListener("click", () => {
      if (b.classList.contains("ghost")) return;
      b.classList.add("ghost");
      const chip = document.createElement("button");
      chip.className = "chip"; chip.dataset.i = b.dataset.i; chip.dataset.t = b.dataset.t;
      chip.innerHTML = `<span class="num" style="margin-right:6px;opacity:.7">${picked.length + 1}</span>${esc(b.dataset.t)}`;
      chip.addEventListener("click", () => {
        area.removeChild(chip);
        picked.splice(picked.indexOf(chip), 1);
        $app.querySelector(`#bank .chip[data-k="${b.dataset.k}"]`).classList.remove("ghost");
        refresh();
      });
      area.appendChild(chip); picked.push(chip); refresh();
    }));
    check.addEventListener("click", () => {
      const good = picked.every((c, i) => c.dataset.i == ex.items[i]);
      finishStep(ex, good, good ? null : `To'g'ri tartib: ${ex.items.join(" → ")}`);
    });
  }

  // ----- Fill (bo'sh joyni to'ldirish) -----
  function fillBody(ex) {
    const bank = shuffle([ex.answer].concat(ex.extra || []));
    return `<div class="ex-title">${esc(ex.q.replace("____", "______"))}</div>
      <div class="bank" id="bank" style="margin-top:20px">${bank.map((w, i) =>
        `<button class="chip fill-chip" data-w="${esc(w)}" data-i="${i}">${esc(w)}</button>`).join("")}
      </div>
      <div class="hint-txt" style="display:block;margin-top:16px;font-size:12px;color:var(--muted)">Bo'sh joyga mos keladigan so'zni tanlang</div>`;
  }
  function bindFill(ex) {
    const check = document.getElementById("check");
    check.textContent = "Tekshirish";
    check.disabled = true;
    $app.querySelectorAll("#bank .fill-chip").forEach(b => b.addEventListener("click", () => {
      if (b.classList.contains("ghost")) return;
      const good = b.dataset.w.toLowerCase() === ex.answer.toLowerCase();
      $app.querySelectorAll("#bank .fill-chip").forEach(x => {
        x.disabled = true;
        if (x.dataset.w.toLowerCase() === ex.answer.toLowerCase()) x.classList.add("correct");
        else if (x === b && !good) x.classList.add("wrong");
        else x.classList.add("ghost");
      });
      finishStep(ex, good, good ? null : `To'g'ri javob: ${ex.answer}`);
    }));
  }

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
    fb.innerHTML = `<div class="fb-title">${good ? ic("check") + " To'g'ri" : ic("x") + " Noto'g'ri"}</div>
      ${subText ? `<div class="fb-sub">${esc(subText)}</div>` : `<div class="fb-sub"></div>`}
      ${ex.explanation ? `<div class="fb-sub" style="opacity:.85;display:flex;gap:7px;align-items:flex-start">${ic("info", "ico-sm")}<span>${esc(ex.explanation)}</span></div>` : ""}
      <button class="btn full ${good ? "" : "danger"}" id="next">Davom etish</button>`;
    document.body.appendChild(fb);
    document.getElementById("next").addEventListener("click", () => {
      fb.remove();
      session.idx++;
      if (session.useHearts && S.hearts <= 0 && session.idx < session.queue.length) {
        clearInterval(examTimer); session = null; return renderNoHearts();
      }
      renderExercise();
    });
  }

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
    S.history[todayKey()] = (S.history[todayKey()] || 0) + gained;
    if (session.lessonId) S.done[session.lessonId] = { acc, at: Date.now() };
    if (isExam && (!S.examBest || acc > S.examBest.pct)) S.examBest = { pct: acc, at: Date.now() };
    const newStreak = touchStreak();
    save();
    const newAch = checkAchievements();
    const retryFn = session.retry;

    let h1, sub, rico, rcolor;
    if (isExam) {
      rico = passed ? "graduation-cap" : "book-open";
      rcolor = passed ? "var(--success)" : "var(--warn)";
      h1 = timeUp ? "Vaqt tugadi" : passed ? "Imtihondan o'tdingiz!" : "Imtihondan o'tolmadingiz";
      sub = passed ? `Natija: ${acc}% (o'tish balli ${EXAM.passPct}%)` : `Natija: ${acc}%. Yana tayyorlanib qayta topshiring.`;
    } else {
      rico = acc === 100 ? "trophy" : acc >= 70 ? "award" : "trending-up";
      rcolor = acc === 100 ? "var(--warn)" : acc >= 70 ? "var(--success)" : "var(--purple-3)";
      h1 = acc === 100 ? "Zo'r natija!" : session.kind === "review" ? "Takrorlash yakunlandi" : "Dars yakunlandi";
      sub = acc === 100 ? "Mukammal — barcha javoblar to'g'ri." : "Xatolar avtomatik takrorlash navbatiga qo'shildi.";
    }

    $app.innerHTML = `<div class="result">
      <div class="r-emoji" style="color:${rcolor}">${ic(rico)}</div>
      <h1>${h1}</h1>
      <div class="r-xp num">+${gained} XP</div>
      <p>${sub}</p>
      <div class="res-grid">
        <div class="res-stat acc"><div class="rv num">${acc}%</div><div class="rl">Aniqlik</div></div>
        <div class="res-stat time"><div class="rv num">${timeStr}</div><div class="rl">Vaqt</div></div>
        <div class="res-stat xp"><div class="rv num">+${gained}</div><div class="rl">XP</div></div>
        <div class="res-stat correct"><div class="rv num">${session.correct}/${total}</div><div class="rl">To'g'ri</div></div>
      </div>
      <button class="btn" id="continue">Davom etish</button>
      <button class="btn ghost" id="retry">${ic("repeat", "ico-sm")} Qayta ishlash</button>
    </div>`;
    beep(passed && acc >= 70);
    if (passed && acc >= 70) confetti();
    if (newAch.length) showAchievements(newAch);
    const wasExam = isExam;
    session = null;
    document.getElementById("continue").addEventListener("click", () => {
      if (newStreak) showStreak();
      else if (wasExam) renderQuizPage();
      else renderHome();
    });
    document.getElementById("retry").addEventListener("click", () => { if (retryFn) retryFn(); });
  }

  function showStreak() {
    const d = document.createElement("div");
    d.className = "streak-flame";
    d.innerHTML = `<div class="f">${ic("flame")}</div><h2>${S.streak} kunlik seriya</h2>
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
