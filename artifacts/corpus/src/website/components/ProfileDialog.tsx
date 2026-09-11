import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Mail, ShieldCheck, UserRound } from 'lucide-react';
import Dialog from './Dialog';

export interface LocalProfile { name: string; email: string }

export default function ProfileDialog({ profile, onChange, onClose }: { profile: LocalProfile | null; onChange: (profile: LocalProfile | null) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2) { setError('Iltimos, ismingizni kamida 2 ta harf bilan kiriting.'); return; }
    onChange({ name: name.trim(), email: email.trim().toLowerCase() });
  }

  return <Dialog onClose={onClose} labelledBy="profile-title" className="profile-dialog">
    <span className="wordmark">CORPUS</span>
    {profile ? <div className="profile-success"><div className="profile-avatar">{profile.name.charAt(0).toUpperCase()}</div><p className="eyebrow">SIZNING O'QUV PROFILINGIZ</p><h2 id="profile-title">Salom, {profile.name}.</h2><p className="profile-email">{profile.email}</p><div className="profile-note"><CheckCircle2 size={20} /><p>Bugun yangi bilim uchun ajoyib kun. O'rganishni davom ettiring, natijalaringiz shu qurilmada saqlanadi.</p></div><button className="button button-primary" onClick={onClose}>O'rganishga qaytish <ArrowRight size={18} /></button><button className="text-button muted logout-button" onClick={() => onChange(null)}>Profildan chiqish</button></div> : <>
      <div className="profile-heading"><p className="eyebrow">BILIM SIZDAN BOSHLANADI</p><h2 id="profile-title">Xush kelibsiz.</h2><p>O'zingizni tanishtiring. O'rganish yo'lingizni birga davom ettiramiz.</p></div>
      <form onSubmit={submit} className="profile-form">
        <label htmlFor="profile-name">Ismingiz<span className="input-wrap"><UserRound size={18} /><input id="profile-name" name="name" autoComplete="given-name" placeholder="Ismingizni kiriting" value={name} onChange={(event) => { setName(event.target.value); setError(''); }} required minLength={2} maxLength={40} /></span></label>
        <label htmlFor="profile-email">Email manzilingiz<span className="input-wrap"><Mail size={18} /><input id="profile-email" name="email" type="email" autoComplete="email" placeholder="siz@misol.uz" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={120} /></span></label>
        {error && <p role="alert" className="form-error">{error}</p>}
        <button type="submit" className="button button-primary">Davom etish <ArrowRight size={18} /></button>
      </form>
      <p className="privacy-note"><ShieldCheck size={18} /><span>Mahalliy profil: ma'lumotlaringiz faqat shu brauzerda saqlanadi. Parol yoki to'lov talab qilinmaydi.</span></p>
    </>}
  </Dialog>;
}