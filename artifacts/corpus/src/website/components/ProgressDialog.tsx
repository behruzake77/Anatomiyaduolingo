import { ArrowRight, BookOpen, Check, CheckCircle2, Flame, Medal, ShieldCheck, Sparkles, Star, Target, Trophy } from 'lucide-react';
import { getOrgan, learningPath } from '../data/anatomy';
import type { LearningProgress } from '../hooks/useLearningProgress';
import Dialog from './Dialog';

export type MetricType = 'streak' | 'xp' | 'anatomy' | 'achievements';

const metricInfo = {
  streak: { eyebrow: 'KICHIK QADAMLAR, HAR KUNI', title: 'Muntazamlik kuchi.', description: 'Kuniga bitta dars bilan o`rganish odatini mustahkamlang.', icon: Flame },
  xp: { eyebrow: 'HAR BIR DARS QADRLIDIR', title: 'Bilimingiz o`sib bormoqda.', description: 'Darslarni tugating, savollarga javob bering va XP to`plang.', icon: Star },
  anatomy: { eyebrow: 'SIZNING O`RGANISH YO`LINGIZ', title: 'Bir butun tasavvur sari.', description: 'Har bir tizimni o`rganib, inson tanasini yaxshiroq tushuning.', icon: Target },
  achievements: { eyebrow: 'MEHNATINGIZNING E`TIROFI', title: 'Kichik g`alabalarni nishonlang.', description: 'Izlanish, muntazamlik va yangi bilimlar uchun yutuqlar.', icon: ShieldCheck },
};

export default function ProgressDialog({ metric, progress, onClose, onStart }: { metric: MetricType; progress: LearningProgress; onClose: () => void; onStart: () => void }) {
  const info = metricInfo[metric];
  const Icon = info.icon;
  const value = metric === 'streak' ? `${progress.streak} kun` : metric === 'xp' ? `${progress.xp.toLocaleString('en-US')} XP` : metric === 'anatomy' ? `${progress.anatomy}%` : `${progress.achievements} ta yutuq`;
  return <Dialog onClose={onClose} labelledBy="progress-title" className="progress-dialog">
    <div className={`progress-dialog-icon metric-${metric}`}><Icon size={33} /></div><p className="eyebrow">{info.eyebrow}</p><h2 id="progress-title">{info.title}</h2><p className="lesson-description">{info.description}</p><div className="progress-big-value">{value}</div>
    {metric === 'streak' && <><div className="streak-week">{['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map((day) => <div key={day}><span>{day}</span><span className="streak-day"><Check size={20} /></span></div>)}</div><div className="progress-tip"><Flame size={20} /><p>Bugungi 5 daqiqangiz ertangi bilimingiz uchun eng yaxshi sarmoya.</p></div></>}
    {metric === 'xp' && <div className="xp-history"><h3>So'nggi faollik</h3>{progress.sessions.length > 0 ? progress.sessions.slice(0, 4).map((session, index) => <div className="history-row" key={`${session.date}-${index}`}><BookOpen size={19} /><div><strong>{getOrgan(session.organ).name}</strong><span>{session.correct}/{session.total} to'g'ri javob</span></div><b>+{session.xp} XP</b></div>) : <div className="progress-tip"><Sparkles size={24} /><p>Yangi darsni yakunlang. Keyingi yutug'ingiz shu yerda paydo bo'ladi.</p></div>}<div className="history-baseline"><span>Boshlang'ich o'quv balansi</span><strong>1,240 XP</strong></div></div>}
    {metric === 'anatomy' && <div className="dialog-learning-path">{learningPath.map((item) => <div key={item.name} className={progress.completed.includes(item.organ) ? 'done' : ''}><CheckCircle2 size={19} /><span>{item.name}</span><span>{progress.completed.includes(item.organ) ? "O'rganildi" : 'Oldinda'}</span></div>)}</div>}
    {metric === 'achievements' && <div className="achievement-list">{[{ icon: Medal, title: 'Birinchi qadam', text: 'Yangi bilim sari yo`l boshlandi.' }, { icon: Flame, title: 'Muntazam o`quvchi', text: '7 kunlik o`rganish odati.' }, { icon: Trophy, title: 'Izlanuvchi', text: '1,000 XP marrasi zabt etildi.' }].map((item) => <div key={item.title}><item.icon size={27} /><div><strong>{item.title}</strong><p>{item.text}</p></div><CheckCircle2 size={19} /></div>)}</div>}
    <button className="button button-primary" onClick={onStart}>Keyingi darsni boshlash <ArrowRight size={18} /></button><p className="dialog-storage-note">O'quv natijalari ushbu qurilmada saqlanadi.</p>
  </Dialog>;
}