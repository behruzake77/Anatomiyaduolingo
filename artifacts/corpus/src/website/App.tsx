import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, ChartNoAxesColumnIncreasing, CheckCircle2, Circle, Flame, Hand, Menu, Play, RefreshCw, ShieldCheck, Star, X } from 'lucide-react';
import { getOrgan, learningPath, organs, type OrganId } from './data/anatomy';
import OrganIcon from './components/OrganIcon';
import AnatomyDiagram from './components/AnatomyDiagram';
import LearningDialog, { type LearningMode } from './components/LearningDialog';
import ProfileDialog, { type LocalProfile } from './components/ProfileDialog';
import ProgressDialog, { type MetricType } from './components/ProgressDialog';
import { useLearningProgress, type LearningProgress } from './hooks/useLearningProgress';

const navigation = [
  { label: 'Learn', href: '#learn' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Progress', href: '#progress' },
];

type ModalState = { type: 'lesson'; organ: OrganId; mode: LearningMode } | { type: 'profile' } | { type: 'progress'; metric: MetricType } | null;

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 19 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.13 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function Header({ onStart, onProfile, profile }: { onStart: () => void; onProfile: () => void; profile: LocalProfile | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function escapeMenu(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') { setMenuOpen(false); menuButtonRef.current?.focus(); }
    }
    if (menuOpen) document.addEventListener('keydown', escapeMenu);
    return () => document.removeEventListener('keydown', escapeMenu);
  }, [menuOpen]);

  return <header className="site-header container">
    <a className="wordmark" href="#top" aria-label="CORPUS bosh sahifa">CORPUS</a>
    <nav className="desktop-navigation" aria-label="Asosiy navigatsiya">{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
    <div className="header-actions"><button className="login-button" onClick={onProfile}>{profile ? profile.name : 'Log in'}</button><button className="button button-primary header-start" onClick={onStart}>Start learning <ArrowRight size={17} /></button><button ref={menuButtonRef} className="menu-toggle icon-button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Menyuni yopish' : 'Menyuni ochish'} aria-expanded={menuOpen} aria-controls="mobile-navigation">{menuOpen ? <X size={24} /> : <Menu size={24} />}</button></div>
    <AnimatePresence>{menuOpen && <motion.nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobil navigatsiya" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowRight size={17} /></a>)}<button onClick={() => { setMenuOpen(false); onProfile(); }}>{profile ? 'Mening profilim' : 'Log in'}<ArrowRight size={17} /></button></motion.nav>}</AnimatePresence>
  </header>;
}

function Hero({ onStart, onProfile, onExplore, profile }: { onStart: () => void; onProfile: () => void; onExplore: (id: OrganId) => void; profile: LocalProfile | null }) {
  const [activeOrgan, setActiveOrgan] = useState<OrganId>('heart');
  const organ = getOrgan(activeOrgan);
  return <section className="hero" id="top" aria-labelledby="hero-heading">
    <motion.img className="hero-art" src="/images/anatomy-hero.jpg" alt="Inson tanasi, ichki organlar va mushaklarning yoritilgan anatomik modeli" fetchPriority="high" initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
    <div className="hero-shade" />
    <Header onStart={onStart} onProfile={onProfile} profile={profile} />
    <div className="hero-content container"><motion.div className="hero-copy" initial={{ opacity: 0, y: 21 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
      <h1 id="hero-heading">Anatomiyani<br />tushuning.<br /><span>Yodlang.</span></h1>
      <p className="hero-description">Vizual darslar, interaktiv mashqlar va takrorlash<br className="desktop-break" /> orqali anatomiyani oson va samarali o'rganing.</p>
      <div className="hero-actions"><button className="button button-primary hero-start" onClick={onStart}>Boshlash <ArrowRight size={22} /></button><a className="watch-link" href="#how-it-works"><span className="play-circle"><Play size={21} fill="currentColor" strokeWidth={0} /></span>Qanday ishlaydi</a></div>
      <div className="hero-stats" aria-label="CORPUS hamjamiyati"><div><strong>10K+</strong><span>Talabalar</span></div><div><strong>500+</strong><a href="#learn">Darslar</a></div><div><strong>96%</strong><span>Tavsiya etadi</span></div></div>
    </motion.div></div>
    <motion.div className="hero-annotations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.55 }}>
      <svg className="hero-connectors" viewBox="0 0 1536 644" preserveAspectRatio="none" aria-hidden="true"><path d="M 885 109 H 937 L 997 77" /><path d="M 789 321 H 873 L 948 350" /><path d="M 738 476 H 864 L 917 458" /><path d="M 1305 488 H 1159 L 1098 526" /><path d="M 1194 260 H 1160 L 1086 318" /></svg>
      {(['brain', 'lungs', 'liver', 'kidneys'] as OrganId[]).map((id) => <button className={`organ-label hero-label-${id} ${activeOrgan === id ? 'is-active' : ''}`} key={id} onClick={() => setActiveOrgan(id)} aria-label={`${getOrgan(id).name} haqida ma'lumot`}><strong>{getOrgan(id).name.toUpperCase()}</strong><span>{getOrgan(id).heroDescription.map((line) => <span key={line}>{line}</span>)}</span></button>)}
      {(['brain', 'lungs', 'liver', 'kidneys', 'heart'] as OrganId[]).map((id) => <button key={id} className={`hotspot hotspot-${id} ${activeOrgan === id ? 'is-active' : ''}`} onClick={() => setActiveOrgan(id)} aria-label={`${getOrgan(id).name} organini tanlash`} aria-pressed={activeOrgan === id}><span /></button>)}
      <div className="hero-organ-callout" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.div className="hero-callout-inner" key={activeOrgan} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.18 }}><img src={organ.image} alt="" className={`callout-organ image-${organ.id}`} /><div><h2>{organ.name.toUpperCase()}</h2><p>{organ.heroDescription.map((line) => <span key={line}>{line}</span>)}</p><button className="button button-primary callout-button" onClick={() => onExplore(activeOrgan)}>Batafsil o'rganish <ArrowRight size={15} /></button></div></motion.div></AnimatePresence></div>
      <p className="hero-hint"><Hand size={15} /> Organlarni bosing va o'rganing</p>
    </motion.div>
  </section>;
}

const methodSteps = [
  { title: "O'RGANING", lines: ['Vizual va qisqa', 'darslar bilan'], icon: BookOpen },
  { title: 'ESLAB QOLING', lines: ['Interaktiv', 'mashqlar orqali'], icon: Brain },
  { title: 'MASHQ QILING', lines: ['Takrorlash tizimi', 'bilan'], icon: RefreshCw },
  { title: 'MUSTAHKAMLANG', lines: ['Uzoq muddatli', 'bilimga aylantiring'], icon: CheckCircle2 },
];

function Method() {
  return <section className="method-section" id="features" aria-labelledby="method-heading"><div className="container method-layout">
    <Reveal className="method-intro"><h2 id="method-heading">Bilish boshqa.<br />Eslab qolish boshqa.</h2><p>CORPUS sizga nafaqat o'rganishga,<br className="desktop-break" /> balki uzoq muddat eslab qolishga yordam beradi.</p><a className="text-link" href="#how-it-works">Qanday ishlaydi <ArrowRight size={19} /></a></Reveal>
    <div className="method-steps">{methodSteps.map((step, index) => <Reveal className="method-step" key={step.title} delay={index * 0.07}><div className="method-icon"><step.icon strokeWidth={1.5} /></div><h3>{step.title}</h3><p>{step.lines[0]}<br />{step.lines[1]}</p>{index < methodSteps.length - 1 && <ArrowRight className="method-arrow" strokeWidth={1.4} />}</Reveal>)}</div>
  </div></section>;
}

function Explorer({ selected, onSelect, onStart }: { selected: OrganId; onSelect: (id: OrganId) => void; onStart: (id: OrganId) => void }) {
  const organ = getOrgan(selected);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % organs.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + organs.length) % organs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = organs.length - 1;
    else return;
    event.preventDefault();
    onSelect(organs[next].id);
    tabRefs.current[next]?.focus({ preventScroll: true });
    tabRefs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  return <section className="explorer-section" id="learn" aria-labelledby="explorer-heading"><div className="container explorer-layout">
    <div className="organ-tabs" role="tablist" aria-label="Tana organlari">{organs.map((item, index) => <button ref={(element) => { tabRefs.current[index] = element; }} key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={selected === item.id} aria-controls="organ-panel" tabIndex={selected === item.id ? 0 : -1} className={`organ-tab ${selected === item.id ? 'selected' : ''}`} onClick={() => onSelect(item.id)} onKeyDown={(event) => navigateTabs(event, index)}>{selected === item.id && <motion.span className="tab-highlight" layoutId="selected-organ" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}<OrganIcon organ={item.id} /><span>{item.name}</span></button>)}</div>
    <div id="organ-panel" className="organ-visual" role="tabpanel" aria-labelledby={`tab-${selected}`} tabIndex={0}><AnimatePresence mode="wait" initial={false}><motion.div className="diagram-motion" key={selected} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} transition={{ duration: 0.25 }}><AnatomyDiagram organ={organ} /></motion.div></AnimatePresence></div>
    <Reveal className="explorer-copy"><p className="eyebrow">INTERAKTIV ANATOMIYA</p><h2 id="explorer-heading">Inson tanasini<br />batafsil o'rganing</h2><p className="section-description">Har bir tuzilmani bosing, 3D ko'rinishda ko'ring<br className="desktop-break" /> va muhim ma'lumotlar bilan tanishing.</p><div className="selected-organ-detail" aria-live="polite"><img className={`organ-detail-image image-${organ.id}`} src={organ.image} alt="" loading="lazy" /><div><h3>{organ.name.toUpperCase()}</h3><p className="organ-facts-line">{organ.stats.map((stat) => <span key={stat}>{stat}</span>)}</p><p className="organ-detail-description">{organ.description}</p><button className="button button-primary explore-button" onClick={() => onStart(selected)}>O'rganish <ArrowRight size={17} /></button></div></div></Reveal>
  </div></section>;
}

function HowItWorks({ onStart }: { onStart: (id: OrganId, mode: LearningMode) => void }) {
  return <section className="how-section" id="how-it-works" aria-labelledby="how-heading"><div className="container how-layout">
    <Reveal className="how-intro"><p className="eyebrow eyebrow-light">QANDAY O'RGANASIZ?</p><h2 id="how-heading">Uch bosqich.<br />Bitta natija <span className="heading-dash" /> bilim.</h2><p>CORPUS sizni o'rganishdan tortib,<br className="desktop-break" /> mustahkam bilimga erishgungizcha<br className="desktop-break" /> bosqichma-bosqich olib boradi.</p></Reveal>
    <div className="learning-steps">
      <Reveal className="learning-step-wrap"><button className="learning-step" onClick={() => onStart('skeleton', 'learn')}><div className="learning-step-heading"><span>01</span><h3>O'RGANING</h3></div><div className="step-preview lesson-preview"><img src="/images/anatomy-lesson.jpg" alt="Vizual anatomiya darsidan namuna" loading="lazy" /><div className="preview-lesson-caption"><small>Etude</small><strong>Osteologiya asoslari</strong><span><BookOpen size={8} /> Qisqa dars</span></div><span className="preview-image-point" /></div><p>Qisqa va vizual darslar</p><div className="step-timeline"><span /></div></button><ArrowRight className="learning-step-arrow" size={25} strokeWidth={1.4} /></Reveal>
      <Reveal className="learning-step-wrap" delay={0.08}><button className="learning-step" onClick={() => onStart('skeleton', 'quiz')}><div className="learning-step-heading"><span>02</span><h3>MASHQ QILING</h3></div><div className="step-preview quiz-preview"><p>Qaysi suyak hisoblanadi?</p>{['Femur', 'Humerus', 'Radius', 'Ulna'].map((answer, index) => <div className={`mini-answer ${index === 0 ? 'mini-correct' : ''}`} key={answer}><span>{String.fromCharCode(65 + index)}</span>{answer}</div>)}</div><p>Interaktiv testlar</p><div className="step-timeline"><span /></div></button><ArrowRight className="learning-step-arrow" size={25} strokeWidth={1.4} /></Reveal>
      <Reveal className="learning-step-wrap" delay={0.16}><button className="learning-step" onClick={() => onStart('brain', 'review')}><div className="learning-step-heading"><span>03</span><h3>MUSTAHKAMLANG</h3></div><div className="step-preview memory-preview"><img src="/images/brain.jpg" alt="Miya va xotirani mustahkamlash" loading="lazy" /><span className="correct-badge"><CheckCircle2 size={14} fill="#55e8b1" /> To'g'ri!</span></div><p>Takrorlash orqali<br />bilimingizni mustahkamlang.</p><div className="step-timeline"><span /></div></button></Reveal>
    </div>
  </div></section>;
}

function Progress({ progress, onMetric, onStart }: { progress: LearningProgress; onMetric: (metric: MetricType) => void; onStart: (id: OrganId) => void }) {
  const firstIncomplete = learningPath.findIndex((item) => !progress.completed.includes(item.organ));
  const metrics = [
    { type: 'streak' as const, icon: Flame, value: progress.streak, label: 'kunlik streak' },
    { type: 'xp' as const, icon: Star, value: progress.xp.toLocaleString('en-US'), label: 'XP' },
    { type: 'anatomy' as const, icon: ChartNoAxesColumnIncreasing, value: `${progress.anatomy}%`, label: 'Anatomiya' },
    { type: 'achievements' as const, icon: ShieldCheck, value: progress.achievements, label: 'Yutuqlar' },
  ];
  return <section className="progress-section" id="progress" aria-labelledby="progress-heading"><div className="container progress-layout">
    <Reveal className="progress-intro"><p className="eyebrow">RIVOJLANING</p><h2 id="progress-heading">Har kuni bir qadam<br />oldinga.</h2><p>Bosqichlarni tamomlang, XP to'plang,<br className="desktop-break" /> streak saqlang va o'z yutuqlaringizni kuzating.</p></Reveal>
    <div className="progress-metrics">{metrics.map((metric, index) => <Reveal key={metric.type} delay={index * 0.05}><button className={`metric-tile metric-${metric.type}`} onClick={() => onMetric(metric.type)} aria-label={`${metric.value} ${metric.label}. Batafsil ko'rish`}><metric.icon className="metric-icon" size={33} strokeWidth={metric.type === 'anatomy' ? 3 : 1.7} /><strong>{metric.value}</strong><span>{metric.label}</span></button></Reveal>)}</div>
    <Reveal className="learning-path"><h3>O'QISH YO'LI</h3><ol>{learningPath.map((item, index) => { const complete = progress.completed.includes(item.organ); const current = index === firstIncomplete; return <li key={item.name}><button onClick={() => onStart(item.organ)} className={`${complete ? 'complete' : ''} ${current ? 'current' : ''}`}>{complete ? <CheckCircle2 size={15} /> : current ? <span className="current-circle"><span /></span> : <Circle size={15} />}<span>{item.name}</span></button></li>; })}</ol></Reveal>
  </div></section>;
}

function Closing({ onStart }: { onStart: () => void }) {
  return <section className="closing-section" aria-labelledby="closing-heading"><img className="closing-art" src="/images/anatomy-light.jpg" alt="" loading="lazy" /><div className="closing-shade" /><div className="container closing-layout"><Reveal className="closing-copy"><p className="eyebrow">KICHIK QADAMLAR. KATTA NATIJALAR.</p><h2 id="closing-heading">Bugun 5 daqiqa.<br />Ertaga yana 5.</h2><p>Anatomiyani har kuni o'rganing.<br />O'zingizning eng yaxshi versiyangizga yaqinlashing.</p><div className="closing-actions"><button className="button button-primary" onClick={onStart}>Bepul boshlash <ArrowRight size={20} /></button><span>Bu bepul. Har doim.</span></div></Reveal><Reveal className="closing-quote" delay={0.1}><blockquote><span className="quote-mark">&ldquo;</span><p><strong>Bilim</strong><br />sog'liqni kuchaytiradi<span className="quote-end">&rdquo;</span></p><cite><span /> CORPUS</cite></blockquote></Reveal></div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-layout"><div><a className="wordmark" href="#top">CORPUS</a><p>Anatomiya. Bugun. Yaxshiroq kelajak uchun.</p></div><nav aria-label="Pastki navigatsiya">{navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</nav><p className="copyright">&copy; 2024 CORPUS. Barcha huquqlar himoyalangan.</p></div></footer>;
}

function readProfile(): LocalProfile | null {
  try {
    const saved = JSON.parse(localStorage.getItem('corpus-profile-v1') ?? 'null') as LocalProfile | null;
    return saved && typeof saved.name === 'string' && typeof saved.email === 'string' ? saved : null;
  } catch { return null; }
}

export default function App() {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganId>('heart');
  const [modal, setModal] = useState<ModalState>(null);
  const [profile, setProfile] = useState<LocalProfile | null>(readProfile);
  const { progress, completeLesson } = useLearningProgress();

  function openLesson(organ: OrganId = selectedOrgan, mode: LearningMode = 'learn') { setModal({ type: 'lesson', organ, mode }); }

  function exploreOrgan(id: OrganId) {
    setSelectedOrgan(id);
    document.getElementById('learn')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }

  function updateProfile(next: LocalProfile | null) {
    setProfile(next);
    try {
      if (next) localStorage.setItem('corpus-profile-v1', JSON.stringify(next));
      else localStorage.removeItem('corpus-profile-v1');
    } catch { /* A local profile remains available for this session. */ }
  }

  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#learn">Asosiy mazmunga o'tish</a><main>
    <Hero onStart={() => openLesson()} onProfile={() => setModal({ type: 'profile' })} onExplore={exploreOrgan} profile={profile} />
    <Method />
    <Explorer selected={selectedOrgan} onSelect={setSelectedOrgan} onStart={(id) => openLesson(id)} />
    <HowItWorks onStart={openLesson} />
    <Progress progress={progress} onMetric={(metric) => setModal({ type: 'progress', metric })} onStart={(id) => openLesson(id)} />
    <Closing onStart={() => openLesson()} />
  </main><Footer /><AnimatePresence mode="wait">
    {modal?.type === 'lesson' && <LearningDialog key={`lesson-${modal.organ}-${modal.mode}`} organ={getOrgan(modal.organ)} mode={modal.mode} onClose={() => setModal(null)} onComplete={(xp, correct, total) => completeLesson(modal.organ, xp, correct, total)} />}
    {modal?.type === 'profile' && <ProfileDialog key="profile" profile={profile} onChange={updateProfile} onClose={() => setModal(null)} />}
    {modal?.type === 'progress' && <ProgressDialog key="progress" metric={modal.metric} progress={progress} onClose={() => setModal(null)} onStart={() => openLesson(learningPath.find((item) => !progress.completed.includes(item.organ))?.organ ?? 'heart')} />}
  </AnimatePresence></MotionConfig>;
}
